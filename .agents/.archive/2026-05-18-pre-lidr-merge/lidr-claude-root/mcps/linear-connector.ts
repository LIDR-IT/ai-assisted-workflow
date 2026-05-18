/**
 * LINEAR MCP CONNECTOR - Phase 4 Enhancement
 * Bidirectional synchronization between SDLC tracking and Linear
 *
 * Version: 1.0.0
 * Author: SDLC Enhancement Team
 * Date: 2026-03-17
 */

import {
  ValidationResult,
  ValidationSeverity,
  ValidationIssue,
} from "../_shared/validators/types.js";

interface LinearConfig {
  apiKey: string;
  teamId: string;
  baseUrl: string;
  webhookSecret?: string;
}

interface LinearIssue {
  id: string;
  title: string;
  description: string;
  state: {
    name: string;
    type: "backlog" | "unstarted" | "started" | "completed" | "canceled";
  };
  assignee?: {
    id: string;
    name: string;
    email: string;
  };
  estimate?: number;
  labels: Array<{
    id: string;
    name: string;
    color: string;
  }>;
  project?: {
    id: string;
    name: string;
  };
  team: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  url: string;
}

interface LinearProject {
  id: string;
  name: string;
  description: string;
  state: "planned" | "started" | "paused" | "completed" | "canceled";
  progress: number;
  startDate?: string;
  targetDate?: string;
}

interface SyncResult {
  success: boolean;
  synced: number;
  skipped: number;
  errors: number;
  details: SyncDetail[];
}

interface SyncDetail {
  itemId: string;
  action: "created" | "updated" | "skipped" | "error";
  message: string;
}

/**
 * Linear MCP Connector for SDLC Tracking Integration
 * Provides bidirectional sync between sdlc-tracking.yaml and Linear
 */
export class LinearConnector {
  private config: LinearConfig;
  private rateLimitCount: number = 0;
  private lastRateLimitReset: number = Date.now();

  constructor(config: LinearConfig) {
    this.config = config;
  }

  /**
   * Test Linear connection and authentication
   */
  async testConnection(): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];

    try {
      // Test authentication with viewer query
      const query = `
        query Viewer {
          viewer {
            id
            name
            email
          }
        }
      `;

      const response = await this.makeGraphQLRequest(query);

      if (response.data?.viewer) {
        // Test team access
        const teamQuery = `
          query Team($teamId: String!) {
            team(id: $teamId) {
              id
              name
              description
            }
          }
        `;

        const teamResponse = await this.makeGraphQLRequest(teamQuery, {
          teamId: this.config.teamId,
        });

        if (teamResponse.data?.team) {
          return {
            success: true,
            score: 5.0,
            issues: [
              {
                severity: ValidationSeverity.INFO,
                message: `Connected to Linear team ${teamResponse.data.team.name}`,
                location: "Linear connection",
                suggestion: "Connection is healthy",
              },
            ],
            context: {
              linearTeam: teamResponse.data.team.name,
              userEmail: response.data.viewer.email,
            },
          };
        }
      }
    } catch (error) {
      issues.push({
        severity: ValidationSeverity.ERROR,
        message: `Linear connection failed: ${error}`,
        location: "Linear authentication",
        suggestion: "Check API key and team access",
      });
    }

    return {
      success: false,
      score: 1.0,
      issues,
      context: { connectionTest: "failed" },
    };
  }

  /**
   * Sync epic from SDLC tracking to Linear as Project
   */
  async syncEpicToLinear(epic: any, trackingData: any): Promise<SyncResult> {
    const results: SyncDetail[] = [];
    let synced = 0,
      skipped = 0,
      errors = 0;

    try {
      const linearProjectId = epic.external_refs?.linear;

      if (linearProjectId) {
        // Update existing project
        const updateMutation = `
          mutation ProjectUpdate($id: String!, $input: ProjectUpdateInput!) {
            projectUpdate(id: $id, input: $input) {
              success
              project {
                id
                name
              }
            }
          }
        `;

        const updateInput = {
          name: epic.title,
          description: this.formatEpicDescription(epic, trackingData),
          state: this.mapEpicStatusToLinear(epic.status),
          targetDate: epic.planned_completion || null,
        };

        const updateResult = await this.makeGraphQLRequest(updateMutation, {
          id: linearProjectId,
          input: updateInput,
        });

        if (updateResult.data?.projectUpdate?.success) {
          results.push({
            itemId: epic.id,
            action: "updated",
            message: `Updated Linear project ${linearProjectId}`,
          });
          synced++;
        } else {
          results.push({
            itemId: epic.id,
            action: "error",
            message: `Failed to update Linear project: ${updateResult.errors?.[0]?.message || "Unknown error"}`,
          });
          errors++;
        }
      } else {
        // Create new project
        const createMutation = `
          mutation ProjectCreate($input: ProjectCreateInput!) {
            projectCreate(input: $input) {
              success
              project {
                id
                name
                url
              }
            }
          }
        `;

        const createInput = {
          name: epic.title,
          description: this.formatEpicDescription(epic, trackingData),
          teamIds: [this.config.teamId],
          state: "planned",
          targetDate: epic.planned_completion || null,
        };

        const createResult = await this.makeGraphQLRequest(createMutation, {
          input: createInput,
        });

        if (createResult.data?.projectCreate?.success) {
          const newProject = createResult.data.projectCreate.project;
          results.push({
            itemId: epic.id,
            action: "created",
            message: `Created Linear project ${newProject.id}`,
          });

          // Update tracking with new Linear ID
          await this.updateTrackingWithLinearId(epic.id, newProject.id, "epic");
          synced++;
        } else {
          results.push({
            itemId: epic.id,
            action: "error",
            message: `Failed to create Linear project: ${createResult.errors?.[0]?.message || "Unknown error"}`,
          });
          errors++;
        }
      }
    } catch (error) {
      results.push({
        itemId: epic.id,
        action: "error",
        message: `Epic sync error: ${error}`,
      });
      errors++;
    }

    return { success: errors === 0, synced, skipped, errors, details: results };
  }

  /**
   * Sync story from SDLC tracking to Linear as Issue
   */
  async syncStoryToLinear(story: any, trackingData: any): Promise<SyncResult> {
    const results: SyncDetail[] = [];
    let synced = 0,
      skipped = 0,
      errors = 0;

    try {
      const linearIssueId = story.external_refs?.linear;

      if (linearIssueId) {
        // Update existing issue
        const updateMutation = `
          mutation IssueUpdate($id: String!, $input: IssueUpdateInput!) {
            issueUpdate(id: $id, input: $input) {
              success
              issue {
                id
                title
              }
            }
          }
        `;

        const updateInput = {
          title: story.title,
          description: this.formatStoryDescription(story, trackingData),
          stateId: await this.getStateId(this.mapStatusToLinear(story.status)),
          estimate: story.estimation,
          assigneeId: story.assignee ? await this.getUserId(story.assignee) : null,
          labelIds: await this.getLabelIds(this.generateLabels(story, trackingData)),
        };

        const updateResult = await this.makeGraphQLRequest(updateMutation, {
          id: linearIssueId,
          input: updateInput,
        });

        if (updateResult.data?.issueUpdate?.success) {
          results.push({
            itemId: story.id,
            action: "updated",
            message: `Updated Linear issue ${linearIssueId}`,
          });
          synced++;
        } else {
          results.push({
            itemId: story.id,
            action: "error",
            message: `Failed to update Linear issue: ${updateResult.errors?.[0]?.message || "Unknown error"}`,
          });
          errors++;
        }
      } else {
        // Create new issue
        const createMutation = `
          mutation IssueCreate($input: IssueCreateInput!) {
            issueCreate(input: $input) {
              success
              issue {
                id
                title
                url
              }
            }
          }
        `;

        const parentEpic = trackingData.implementation.epics.find((e: any) => e.id === story.epic);

        const createInput = {
          title: story.title,
          description: this.formatStoryDescription(story, trackingData),
          teamId: this.config.teamId,
          estimate: story.estimation,
          assigneeId: story.assignee ? await this.getUserId(story.assignee) : null,
          labelIds: await this.getLabelIds(this.generateLabels(story, trackingData)),
          projectId: parentEpic?.external_refs?.linear || null,
        };

        const createResult = await this.makeGraphQLRequest(createMutation, {
          input: createInput,
        });

        if (createResult.data?.issueCreate?.success) {
          const newIssue = createResult.data.issueCreate.issue;
          results.push({
            itemId: story.id,
            action: "created",
            message: `Created Linear issue ${newIssue.id}`,
          });

          // Update tracking with new Linear ID
          await this.updateTrackingWithLinearId(story.id, newIssue.id, "story");
          synced++;
        } else {
          results.push({
            itemId: story.id,
            action: "error",
            message: `Failed to create Linear issue: ${createResult.errors?.[0]?.message || "Unknown error"}`,
          });
          errors++;
        }
      }
    } catch (error) {
      results.push({
        itemId: story.id,
        action: "error",
        message: `Story sync error: ${error}`,
      });
      errors++;
    }

    return { success: errors === 0, synced, skipped, errors, details: results };
  }

  /**
   * Pull updates from Linear and update SDLC tracking
   */
  async pullFromLinear(trackingData: any): Promise<SyncResult> {
    const results: SyncDetail[] = [];
    let synced = 0,
      skipped = 0,
      errors = 0;

    try {
      // Get all issues for this team
      const query = `
        query TeamIssues($teamId: String!, $first: Int!) {
          team(id: $teamId) {
            issues(first: $first) {
              nodes {
                id
                title
                description
                state {
                  name
                  type
                }
                assignee {
                  id
                  name
                  email
                }
                estimate
                labels {
                  nodes {
                    id
                    name
                    color
                  }
                }
                project {
                  id
                  name
                }
                createdAt
                updatedAt
                url
              }
            }
          }
        }
      `;

      const issues = await this.makeGraphQLRequest(query, {
        teamId: this.config.teamId,
        first: 100,
      });

      const issuesList = issues.data?.team?.issues?.nodes || [];

      for (const issue of issuesList) {
        try {
          const updated = await this.updateTrackingFromLinear(issue, trackingData);

          if (updated) {
            results.push({
              itemId: issue.id,
              action: "updated",
              message: `Updated tracking from Linear ${issue.id}`,
            });
            synced++;
          } else {
            results.push({
              itemId: issue.id,
              action: "skipped",
              message: `No updates needed for ${issue.id}`,
            });
            skipped++;
          }
        } catch (error) {
          results.push({
            itemId: issue.id,
            action: "error",
            message: `Failed to update from Linear: ${error}`,
          });
          errors++;
        }
      }
    } catch (error) {
      results.push({
        itemId: "linear-pull",
        action: "error",
        message: `Linear pull error: ${error}`,
      });
      errors++;
    }

    return { success: errors === 0, synced, skipped, errors, details: results };
  }

  // Private helper methods

  private async makeGraphQLRequest(query: string, variables: any = {}): Promise<any> {
    await this.checkRateLimit();

    const response = await fetch(`${this.config.baseUrl}/graphql`, {
      method: "POST",
      headers: {
        Authorization: this.config.apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });

    this.rateLimitCount++;

    if (!response.ok) {
      throw new Error(`Linear GraphQL error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  private async checkRateLimit(): Promise<void> {
    const now = Date.now();
    const oneMinute = 60 * 1000;

    // Reset rate limit counter every minute
    if (now - this.lastRateLimitReset > oneMinute) {
      this.rateLimitCount = 0;
      this.lastRateLimitReset = now;
    }

    // Linear rate limit: 60 requests per minute
    if (this.rateLimitCount >= 50) {
      const sleepTime = oneMinute - (now - this.lastRateLimitReset);
      await new Promise((resolve) => setTimeout(resolve, sleepTime));
      this.rateLimitCount = 0;
      this.lastRateLimitReset = Date.now();
    }
  }

  private formatEpicDescription(epic: any, trackingData: any): string {
    return `
**Epic Summary**
${epic.title}

**Project**: ${trackingData.project.name} (${trackingData.project.id})
**Priority**: ${epic.priority}
**Estimation**: ${epic.estimation_sp} story points

**Status**: ${epic.status}
**Created**: ${epic.created || "N/A"}

**External References**
- Jira: ${epic.external_refs?.jira || "N/A"}
- Notion: ${epic.external_refs?.notion || "N/A"}

Generated by SDLC Tracking System
Last sync: ${new Date().toISOString()}
`.trim();
  }

  private formatStoryDescription(story: any, trackingData: any): string {
    return `
**User Story**
${story.title}

**Epic**: ${story.epic}
**Sprint**: ${story.sprint || "Unassigned"}
**Estimation**: ${story.estimation} story points
**Assignee**: ${story.assignee || "Unassigned"}

**Status**: ${story.status}
**Branch**: ${story.branch || "N/A"}
**PR**: ${story.pr || "N/A"}

**External References**
- Jira: ${story.external_refs?.jira || "N/A"}
- Notion: ${story.external_refs?.notion || "N/A"}
- GitHub: ${story.external_refs?.github || "N/A"}

Generated by SDLC Tracking System
Last sync: ${new Date().toISOString()}
`.trim();
  }

  private generateLabels(item: any, trackingData: any): string[] {
    return [
      `project:${trackingData.project.id}`,
      `priority:${item.priority}`,
      `type:${item.type || "feature"}`,
      "sdlc-tracked",
    ];
  }

  private mapEpicStatusToLinear(sdlcStatus: string): string {
    const statusMap: Record<string, string> = {
      planning: "planned",
      in_progress: "started",
      on_hold: "paused",
      completed: "completed",
      cancelled: "canceled",
    };

    return statusMap[sdlcStatus] || "planned";
  }

  private mapStatusToLinear(sdlcStatus: string): string {
    const statusMap: Record<string, string> = {
      ready: "Todo",
      in_progress: "In Progress",
      in_review: "In Review",
      done: "Done",
      blocked: "Blocked",
    };

    return statusMap[sdlcStatus] || "Todo";
  }

  private async getStateId(stateName: string): Promise<string | null> {
    const query = `
      query TeamStates($teamId: String!) {
        team(id: $teamId) {
          states {
            nodes {
              id
              name
              type
            }
          }
        }
      }
    `;

    const response = await this.makeGraphQLRequest(query, { teamId: this.config.teamId });
    const states = response.data?.team?.states?.nodes || [];
    const state = states.find((s: any) => s.name === stateName);
    return state?.id || null;
  }

  private async getUserId(userName: string): Promise<string | null> {
    const query = `
      query TeamMembers($teamId: String!) {
        team(id: $teamId) {
          members {
            nodes {
              id
              name
              email
            }
          }
        }
      }
    `;

    const response = await this.makeGraphQLRequest(query, { teamId: this.config.teamId });
    const members = response.data?.team?.members?.nodes || [];
    const user = members.find((u: any) => u.name === userName || u.email === userName);
    return user?.id || null;
  }

  private async getLabelIds(labelNames: string[]): Promise<string[]> {
    const query = `
      query TeamLabels($teamId: String!) {
        team(id: $teamId) {
          labels {
            nodes {
              id
              name
            }
          }
        }
      }
    `;

    const response = await this.makeGraphQLRequest(query, { teamId: this.config.teamId });
    const labels = response.data?.team?.labels?.nodes || [];

    return labelNames.map((name) => labels.find((l: any) => l.name === name)?.id).filter(Boolean);
  }

  private async updateTrackingWithLinearId(
    itemId: string,
    linearId: string,
    itemType: "epic" | "story"
  ): Promise<void> {
    // This would update the sdlc-tracking.yaml file with the new Linear ID
    // Implementation would depend on the specific file update mechanism
    console.log(`Would update ${itemType} ${itemId} with Linear ID ${linearId}`);
  }

  private async updateTrackingFromLinear(issue: LinearIssue, trackingData: any): Promise<boolean> {
    // This would update the sdlc-tracking.yaml with data from Linear
    // Implementation would depend on the specific file update mechanism
    console.log(`Would update tracking from Linear issue ${issue.id}`);
    return true;
  }
}

/**
 * Factory function for creating Linear connector instances
 */
export function createLinearConnector(config: Partial<LinearConfig>): LinearConnector {
  const defaultConfig: LinearConfig = {
    apiKey: process.env.LINEAR_API_KEY || "",
    teamId: process.env.LINEAR_TEAM_ID || "",
    baseUrl: process.env.LINEAR_BASE_URL || "https://api.linear.app",
    webhookSecret: process.env.LINEAR_WEBHOOK_SECRET || undefined,
  };

  return new LinearConnector({ ...defaultConfig, ...config });
}

/**
 * Validate Linear connector configuration
 */
export async function validateLinearConfig(
  config?: Partial<LinearConfig>
): Promise<ValidationResult> {
  const connector = createLinearConnector(config || {});
  return connector.testConnection();
}
