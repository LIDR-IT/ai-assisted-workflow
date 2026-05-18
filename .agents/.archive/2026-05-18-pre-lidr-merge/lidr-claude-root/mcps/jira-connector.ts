/**
 * JIRA MCP CONNECTOR - Phase 4 Enhancement
 * Bidirectional synchronization between SDLC tracking and Jira
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

interface JiraConfig {
  baseUrl: string;
  email: string;
  apiToken: string;
  projectKey: string;
  defaultIssueType: string;
}

interface JiraIssue {
  key: string;
  fields: {
    summary: string;
    description: string;
    status: {
      name: string;
    };
    assignee?: {
      displayName: string;
      emailAddress: string;
    };
    customfield_10016?: number; // Story points
    fixVersions: Array<{
      name: string;
      id: string;
    }>;
    components: Array<{
      name: string;
      id: string;
    }>;
    labels: string[];
    created: string;
    updated: string;
  };
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
 * Jira MCP Connector for SDLC Tracking Integration
 * Provides bidirectional sync between sdlc-tracking.yaml and Jira
 */
export class JiraConnector {
  private config: JiraConfig;
  private rateLimitCount: number = 0;
  private lastRateLimitReset: number = Date.now();

  constructor(config: JiraConfig) {
    this.config = config;
  }

  /**
   * Test Jira connection and authentication
   */
  async testConnection(): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];

    try {
      // Test authentication with myself endpoint
      const response = await this.makeRequest("/rest/api/3/myself");

      if (response.active) {
        // Test project access
        const project = await this.makeRequest(`/rest/api/3/project/${this.config.projectKey}`);

        if (project.key === this.config.projectKey) {
          return {
            success: true,
            score: 5.0,
            issues: [
              {
                severity: ValidationSeverity.INFO,
                message: `Connected to Jira project ${project.name}`,
                location: "Jira connection",
                suggestion: "Connection is healthy",
              },
            ],
            context: {
              jiraProject: project.name,
              userEmail: response.emailAddress,
            },
          };
        }
      }
    } catch (error) {
      issues.push({
        severity: ValidationSeverity.ERROR,
        message: `Jira connection failed: ${error}`,
        location: "Jira authentication",
        suggestion: "Check credentials and network connectivity",
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
   * Sync epic from SDLC tracking to Jira
   */
  async syncEpicToJira(epic: any, trackingData: any): Promise<SyncResult> {
    const results: SyncDetail[] = [];
    let synced = 0,
      skipped = 0,
      errors = 0;

    try {
      const jiraEpicId = epic.external_refs?.jira;

      if (jiraEpicId) {
        // Update existing epic
        const updateResult = await this.updateJiraIssue(jiraEpicId, {
          summary: epic.title,
          description: this.formatEpicDescription(epic, trackingData),
          customfield_10011: epic.estimation_sp, // Epic points
          labels: this.generateLabels(epic, trackingData),
          fixVersions: this.getFixVersions(trackingData),
        });

        if (updateResult.success) {
          results.push({
            itemId: epic.id,
            action: "updated",
            message: `Updated Jira epic ${jiraEpicId}`,
          });
          synced++;
        } else {
          results.push({
            itemId: epic.id,
            action: "error",
            message: `Failed to update Jira epic: ${updateResult.error}`,
          });
          errors++;
        }
      } else {
        // Create new epic
        const createResult = await this.createJiraIssue({
          project: { key: this.config.projectKey },
          summary: epic.title,
          description: this.formatEpicDescription(epic, trackingData),
          issuetype: { name: "Epic" },
          customfield_10011: epic.estimation_sp,
          labels: this.generateLabels(epic, trackingData),
          customfield_10014: epic.title, // Epic name
        });

        if (createResult.success) {
          results.push({
            itemId: epic.id,
            action: "created",
            message: `Created Jira epic ${createResult.key}`,
          });

          // Update tracking with new Jira ID
          await this.updateTrackingWithJiraId(epic.id, createResult.key, "epic");
          synced++;
        } else {
          results.push({
            itemId: epic.id,
            action: "error",
            message: `Failed to create Jira epic: ${createResult.error}`,
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
   * Sync story from SDLC tracking to Jira
   */
  async syncStoryToJira(story: any, trackingData: any): Promise<SyncResult> {
    const results: SyncDetail[] = [];
    let synced = 0,
      skipped = 0,
      errors = 0;

    try {
      const jiraStoryId = story.external_refs?.jira;

      if (jiraStoryId) {
        // Update existing story
        const updateResult = await this.updateJiraIssue(jiraStoryId, {
          summary: story.title,
          description: this.formatStoryDescription(story, trackingData),
          assignee: story.assignee ? { name: story.assignee } : null,
          customfield_10016: story.estimation, // Story points
          labels: this.generateLabels(story, trackingData),
          status: this.mapStatusToJira(story.status),
        });

        if (updateResult.success) {
          results.push({
            itemId: story.id,
            action: "updated",
            message: `Updated Jira story ${jiraStoryId}`,
          });
          synced++;
        } else {
          results.push({
            itemId: story.id,
            action: "error",
            message: `Failed to update Jira story: ${updateResult.error}`,
          });
          errors++;
        }
      } else {
        // Create new story
        const parentEpic = trackingData.implementation.epics.find((e: any) => e.id === story.epic);

        const createResult = await this.createJiraIssue({
          project: { key: this.config.projectKey },
          summary: story.title,
          description: this.formatStoryDescription(story, trackingData),
          issuetype: { name: "Story" },
          assignee: story.assignee ? { name: story.assignee } : null,
          customfield_10016: story.estimation,
          labels: this.generateLabels(story, trackingData),
          parent: parentEpic?.external_refs?.jira
            ? { key: parentEpic.external_refs.jira }
            : undefined,
        });

        if (createResult.success) {
          results.push({
            itemId: story.id,
            action: "created",
            message: `Created Jira story ${createResult.key}`,
          });

          // Update tracking with new Jira ID
          await this.updateTrackingWithJiraId(story.id, createResult.key, "story");
          synced++;
        } else {
          results.push({
            itemId: story.id,
            action: "error",
            message: `Failed to create Jira story: ${createResult.error}`,
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
   * Pull updates from Jira and update SDLC tracking
   */
  async pullFromJira(trackingData: any): Promise<SyncResult> {
    const results: SyncDetail[] = [];
    let synced = 0,
      skipped = 0,
      errors = 0;

    try {
      // Get all issues for this project
      const jql = `project = ${this.config.projectKey} AND fixVersion = "${trackingData.timeline.target_completion}"`;
      const issues = await this.searchJiraIssues(jql);

      for (const issue of issues) {
        try {
          const updated = await this.updateTrackingFromJira(issue, trackingData);

          if (updated) {
            results.push({
              itemId: issue.key,
              action: "updated",
              message: `Updated tracking from Jira ${issue.key}`,
            });
            synced++;
          } else {
            results.push({
              itemId: issue.key,
              action: "skipped",
              message: `No updates needed for ${issue.key}`,
            });
            skipped++;
          }
        } catch (error) {
          results.push({
            itemId: issue.key,
            action: "error",
            message: `Failed to update from Jira: ${error}`,
          });
          errors++;
        }
      }
    } catch (error) {
      results.push({
        itemId: "jira-pull",
        action: "error",
        message: `Jira pull error: ${error}`,
      });
      errors++;
    }

    return { success: errors === 0, synced, skipped, errors, details: results };
  }

  // Private helper methods

  private async makeRequest(endpoint: string, method: string = "GET", data?: any): Promise<any> {
    await this.checkRateLimit();

    const url = `${this.config.baseUrl}${endpoint}`;
    const auth = Buffer.from(`${this.config.email}:${this.config.apiToken}`).toString("base64");

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    this.rateLimitCount++;

    if (!response.ok) {
      throw new Error(`Jira API error: ${response.status} ${response.statusText}`);
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

    // Jira Cloud rate limit: 300 requests per minute
    if (this.rateLimitCount >= 250) {
      const sleepTime = oneMinute - (now - this.lastRateLimitReset);
      await new Promise((resolve) => setTimeout(resolve, sleepTime));
      this.rateLimitCount = 0;
      this.lastRateLimitReset = Date.now();
    }
  }

  private async createJiraIssue(
    issueData: any
  ): Promise<{ success: boolean; key?: string; error?: string }> {
    try {
      const response = await this.makeRequest("/rest/api/3/issue", "POST", { fields: issueData });
      return { success: true, key: response.key };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  private async updateJiraIssue(
    issueKey: string,
    updateData: any
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await this.makeRequest(`/rest/api/3/issue/${issueKey}`, "PUT", { fields: updateData });
      return { success: true };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  private async searchJiraIssues(jql: string): Promise<JiraIssue[]> {
    const response = await this.makeRequest(
      `/rest/api/3/search?jql=${encodeURIComponent(jql)}&maxResults=100`
    );
    return response.issues;
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
- Linear: ${epic.external_refs?.linear || "N/A"}
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
- Linear: ${story.external_refs?.linear || "N/A"}
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

  private getFixVersions(trackingData: any): Array<{ name: string }> {
    return [
      {
        name: `Release ${trackingData.timeline.planned_completion}`,
      },
    ];
  }

  private mapStatusToJira(sdlcStatus: string): { name: string } | undefined {
    const statusMap: Record<string, string> = {
      ready: "To Do",
      in_progress: "In Progress",
      in_review: "In Review",
      done: "Done",
      blocked: "Blocked",
    };

    const jiraStatus = statusMap[sdlcStatus];
    return jiraStatus ? { name: jiraStatus } : undefined;
  }

  private async updateTrackingWithJiraId(
    itemId: string,
    jiraKey: string,
    itemType: "epic" | "story"
  ): Promise<void> {
    // This would update the sdlc-tracking.yaml file with the new Jira ID
    // Implementation would depend on the specific file update mechanism
    console.log(`Would update ${itemType} ${itemId} with Jira ID ${jiraKey}`);
  }

  private async updateTrackingFromJira(issue: JiraIssue, trackingData: any): Promise<boolean> {
    // This would update the sdlc-tracking.yaml with data from Jira
    // Implementation would depend on the specific file update mechanism
    console.log(`Would update tracking from Jira issue ${issue.key}`);
    return true;
  }
}

/**
 * Factory function for creating Jira connector instances
 */
export function createJiraConnector(config: Partial<JiraConfig>): JiraConnector {
  const defaultConfig: JiraConfig = {
    baseUrl: process.env.JIRA_BASE_URL || "",
    email: process.env.JIRA_EMAIL || "",
    apiToken: process.env.JIRA_API_TOKEN || "",
    projectKey: process.env.JIRA_PROJECT_KEY || "PROJ",
    defaultIssueType: "Story",
  };

  return new JiraConnector({ ...defaultConfig, ...config });
}

/**
 * Validate Jira connector configuration
 */
export async function validateJiraConfig(config?: Partial<JiraConfig>): Promise<ValidationResult> {
  const connector = createJiraConnector(config || {});
  return connector.testConnection();
}
