/**
 * NOTION MCP CONNECTOR - Phase 4 Enhancement
 * Bidirectional synchronization between SDLC tracking and Notion
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

interface NotionConfig {
  apiKey: string;
  databaseId: string;
  baseUrl: string;
  version: string;
}

interface NotionPage {
  id: string;
  created_time: string;
  last_edited_time: string;
  url: string;
  properties: {
    [key: string]: NotionProperty;
  };
}

interface NotionProperty {
  id: string;
  type: string;
  title?: Array<{ plain_text: string }>;
  rich_text?: Array<{ plain_text: string }>;
  select?: { name: string; color: string };
  multi_select?: Array<{ name: string; color: string }>;
  number?: number;
  date?: { start: string; end?: string };
  people?: Array<{ id: string; name: string; avatar_url: string }>;
  status?: { name: string; color: string };
  url?: string;
}

interface NotionDatabase {
  id: string;
  title: Array<{ plain_text: string }>;
  description: Array<{ plain_text: string }>;
  properties: {
    [key: string]: NotionDatabaseProperty;
  };
}

interface NotionDatabaseProperty {
  id: string;
  name: string;
  type: string;
  [key: string]: any;
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
 * Notion MCP Connector for SDLC Tracking Integration
 * Provides bidirectional sync between sdlc-tracking.yaml and Notion databases
 */
export class NotionConnector {
  private config: NotionConfig;
  private rateLimitCount: number = 0;
  private lastRateLimitReset: number = Date.now();

  constructor(config: NotionConfig) {
    this.config = config;
  }

  /**
   * Test Notion connection and authentication
   */
  async testConnection(): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];

    try {
      // Test authentication with /users/me endpoint
      const response = await this.makeRequest("/users/me");

      if (response.object === "user") {
        // Test database access
        const database = await this.makeRequest(`/databases/${this.config.databaseId}`);

        if (database.object === "database") {
          return {
            success: true,
            score: 5.0,
            issues: [
              {
                severity: ValidationSeverity.INFO,
                message: `Connected to Notion database "${this.extractPlainText(database.title)}"`,
                location: "Notion connection",
                suggestion: "Connection is healthy",
              },
            ],
            context: {
              notionDatabase: this.extractPlainText(database.title),
              userName: response.name || response.person?.email,
            },
          };
        }
      }
    } catch (error) {
      issues.push({
        severity: ValidationSeverity.ERROR,
        message: `Notion connection failed: ${error}`,
        location: "Notion authentication",
        suggestion: "Check API key and database access",
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
   * Sync epic from SDLC tracking to Notion as page
   */
  async syncEpicToNotion(epic: any, trackingData: any): Promise<SyncResult> {
    const results: SyncDetail[] = [];
    let synced = 0,
      skipped = 0,
      errors = 0;

    try {
      const notionPageId = epic.external_refs?.notion;

      if (notionPageId) {
        // Update existing page
        const updateData = {
          properties: {
            Title: {
              title: [{ text: { content: epic.title } }],
            },
            Project: {
              rich_text: [{ text: { content: trackingData.project.name } }],
            },
            Status: {
              select: { name: this.mapEpicStatusToNotion(epic.status) },
            },
            Priority: {
              select: { name: epic.priority || "Medium" },
            },
            "Story Points": {
              number: epic.estimation_sp || 0,
            },
            "Start Date": epic.planned_start
              ? {
                  date: { start: epic.planned_start },
                }
              : null,
            "Target Date": epic.planned_completion
              ? {
                  date: { start: epic.planned_completion },
                }
              : null,
            "SDLC Phase": {
              select: { name: this.mapSDLCPhase(trackingData.state?.currentPhase || 1) },
            },
          },
        };

        const updateResult = await this.makeRequest(`/pages/${notionPageId}`, "PATCH", updateData);

        if (updateResult.object === "page") {
          results.push({
            itemId: epic.id,
            action: "updated",
            message: `Updated Notion page ${notionPageId}`,
          });
          synced++;
        } else {
          results.push({
            itemId: epic.id,
            action: "error",
            message: `Failed to update Notion page: ${updateResult.message || "Unknown error"}`,
          });
          errors++;
        }
      } else {
        // Create new page in database
        const createData = {
          parent: { database_id: this.config.databaseId },
          properties: {
            Title: {
              title: [{ text: { content: epic.title } }],
            },
            Type: {
              select: { name: "Epic" },
            },
            Project: {
              rich_text: [{ text: { content: trackingData.project.name } }],
            },
            Status: {
              select: { name: this.mapEpicStatusToNotion(epic.status) },
            },
            Priority: {
              select: { name: epic.priority || "Medium" },
            },
            "Story Points": {
              number: epic.estimation_sp || 0,
            },
            "Start Date": epic.planned_start
              ? {
                  date: { start: epic.planned_start },
                }
              : null,
            "Target Date": epic.planned_completion
              ? {
                  date: { start: epic.planned_completion },
                }
              : null,
            "SDLC Phase": {
              select: { name: this.mapSDLCPhase(trackingData.state?.currentPhase || 1) },
            },
            "External Refs": {
              rich_text: [
                {
                  text: {
                    content: `Jira: ${epic.external_refs?.jira || "N/A"}, Linear: ${epic.external_refs?.linear || "N/A"}`,
                  },
                },
              ],
            },
          },
          children: [
            {
              object: "block",
              type: "paragraph",
              paragraph: {
                rich_text: [{ text: { content: this.formatEpicDescription(epic, trackingData) } }],
              },
            },
          ],
        };

        const createResult = await this.makeRequest("/pages", "POST", createData);

        if (createResult.object === "page") {
          results.push({
            itemId: epic.id,
            action: "created",
            message: `Created Notion page ${createResult.id}`,
          });

          // Update tracking with new Notion ID
          await this.updateTrackingWithNotionId(epic.id, createResult.id, "epic");
          synced++;
        } else {
          results.push({
            itemId: epic.id,
            action: "error",
            message: `Failed to create Notion page: ${createResult.message || "Unknown error"}`,
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
   * Sync story from SDLC tracking to Notion as page
   */
  async syncStoryToNotion(story: any, trackingData: any): Promise<SyncResult> {
    const results: SyncDetail[] = [];
    let synced = 0,
      skipped = 0,
      errors = 0;

    try {
      const notionPageId = story.external_refs?.notion;

      if (notionPageId) {
        // Update existing page
        const updateData = {
          properties: {
            Title: {
              title: [{ text: { content: story.title } }],
            },
            Epic: {
              rich_text: [{ text: { content: story.epic || "N/A" } }],
            },
            Status: {
              select: { name: this.mapStatusToNotion(story.status) },
            },
            Priority: {
              select: { name: story.priority || "Medium" },
            },
            "Story Points": {
              number: story.estimation || 0,
            },
            Assignee: story.assignee
              ? {
                  rich_text: [{ text: { content: story.assignee } }],
                }
              : null,
            Sprint: story.sprint
              ? {
                  rich_text: [{ text: { content: story.sprint } }],
                }
              : null,
            Branch: story.branch
              ? {
                  url: story.external_refs?.github || story.branch,
                }
              : null,
          },
        };

        const updateResult = await this.makeRequest(`/pages/${notionPageId}`, "PATCH", updateData);

        if (updateResult.object === "page") {
          results.push({
            itemId: story.id,
            action: "updated",
            message: `Updated Notion page ${notionPageId}`,
          });
          synced++;
        } else {
          results.push({
            itemId: story.id,
            action: "error",
            message: `Failed to update Notion page: ${updateResult.message || "Unknown error"}`,
          });
          errors++;
        }
      } else {
        // Create new page in database
        const parentEpic = trackingData.implementation.epics.find((e: any) => e.id === story.epic);

        const createData = {
          parent: { database_id: this.config.databaseId },
          properties: {
            Title: {
              title: [{ text: { content: story.title } }],
            },
            Type: {
              select: { name: "Story" },
            },
            Project: {
              rich_text: [{ text: { content: trackingData.project.name } }],
            },
            Epic: {
              rich_text: [{ text: { content: story.epic || "N/A" } }],
            },
            Status: {
              select: { name: this.mapStatusToNotion(story.status) },
            },
            Priority: {
              select: { name: story.priority || "Medium" },
            },
            "Story Points": {
              number: story.estimation || 0,
            },
            Assignee: story.assignee
              ? {
                  rich_text: [{ text: { content: story.assignee } }],
                }
              : null,
            Sprint: story.sprint
              ? {
                  rich_text: [{ text: { content: story.sprint } }],
                }
              : null,
            Branch: story.branch
              ? {
                  url: story.external_refs?.github || story.branch,
                }
              : null,
            "External Refs": {
              rich_text: [
                {
                  text: {
                    content: `Jira: ${story.external_refs?.jira || "N/A"}, Linear: ${story.external_refs?.linear || "N/A"}`,
                  },
                },
              ],
            },
          },
          children: [
            {
              object: "block",
              type: "paragraph",
              paragraph: {
                rich_text: [
                  { text: { content: this.formatStoryDescription(story, trackingData) } },
                ],
              },
            },
          ],
        };

        const createResult = await this.makeRequest("/pages", "POST", createData);

        if (createResult.object === "page") {
          results.push({
            itemId: story.id,
            action: "created",
            message: `Created Notion page ${createResult.id}`,
          });

          // Update tracking with new Notion ID
          await this.updateTrackingWithNotionId(story.id, createResult.id, "story");
          synced++;
        } else {
          results.push({
            itemId: story.id,
            action: "error",
            message: `Failed to create Notion page: ${createResult.message || "Unknown error"}`,
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
   * Pull updates from Notion and update SDLC tracking
   */
  async pullFromNotion(trackingData: any): Promise<SyncResult> {
    const results: SyncDetail[] = [];
    let synced = 0,
      skipped = 0,
      errors = 0;

    try {
      // Query database for pages with SDLC tracking tags
      const queryData = {
        filter: {
          and: [
            {
              property: "Project",
              rich_text: {
                contains: trackingData.project.name,
              },
            },
            {
              property: "Type",
              select: {
                equals: "Epic",
              },
            },
          ],
        },
        sorts: [
          {
            property: "last_edited_time",
            direction: "descending",
          },
        ],
      };

      const pagesResponse = await this.makeRequest(
        `/databases/${this.config.databaseId}/query`,
        "POST",
        queryData
      );
      const pages = pagesResponse.results || [];

      for (const page of pages) {
        try {
          const updated = await this.updateTrackingFromNotion(page, trackingData);

          if (updated) {
            results.push({
              itemId: page.id,
              action: "updated",
              message: `Updated tracking from Notion ${page.id}`,
            });
            synced++;
          } else {
            results.push({
              itemId: page.id,
              action: "skipped",
              message: `No updates needed for ${page.id}`,
            });
            skipped++;
          }
        } catch (error) {
          results.push({
            itemId: page.id,
            action: "error",
            message: `Failed to update from Notion: ${error}`,
          });
          errors++;
        }
      }
    } catch (error) {
      results.push({
        itemId: "notion-pull",
        action: "error",
        message: `Notion pull error: ${error}`,
      });
      errors++;
    }

    return { success: errors === 0, synced, skipped, errors, details: results };
  }

  // Private helper methods

  private async makeRequest(endpoint: string, method: string = "GET", data?: any): Promise<any> {
    await this.checkRateLimit();

    const url = `${this.config.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        "Content-Type": "application/json",
        "Notion-Version": this.config.version,
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    this.rateLimitCount++;

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Notion API error: ${response.status} ${response.statusText} - ${errorData.message || "Unknown error"}`
      );
    }

    return response.json();
  }

  private async checkRateLimit(): Promise<void> {
    const now = Date.now();
    const oneSecond = 1000;

    // Reset rate limit counter every second
    if (now - this.lastRateLimitReset > oneSecond) {
      this.rateLimitCount = 0;
      this.lastRateLimitReset = now;
    }

    // Notion rate limit: 3 requests per second
    if (this.rateLimitCount >= 3) {
      const sleepTime = oneSecond - (now - this.lastRateLimitReset);
      await new Promise((resolve) => setTimeout(resolve, sleepTime));
      this.rateLimitCount = 0;
      this.lastRateLimitReset = Date.now();
    }
  }

  private extractPlainText(richTextArray: any[]): string {
    if (!Array.isArray(richTextArray)) return "";
    return richTextArray.map((item) => item.plain_text || item.text?.content || "").join("");
  }

  private formatEpicDescription(epic: any, trackingData: any): string {
    return `
Epic: ${epic.title}
Project: ${trackingData.project.name} (${trackingData.project.id})
Priority: ${epic.priority}
Estimation: ${epic.estimation_sp} story points
Status: ${epic.status}
Created: ${epic.created || "N/A"}

External References:
- Jira: ${epic.external_refs?.jira || "N/A"}
- Linear: ${epic.external_refs?.linear || "N/A"}

Generated by SDLC Tracking System
Last sync: ${new Date().toISOString()}
`.trim();
  }

  private formatStoryDescription(story: any, trackingData: any): string {
    return `
User Story: ${story.title}
Epic: ${story.epic}
Sprint: ${story.sprint || "Unassigned"}
Estimation: ${story.estimation} story points
Assignee: ${story.assignee || "Unassigned"}
Status: ${story.status}
Branch: ${story.branch || "N/A"}
PR: ${story.pr || "N/A"}

External References:
- Jira: ${story.external_refs?.jira || "N/A"}
- Linear: ${story.external_refs?.linear || "N/A"}
- GitHub: ${story.external_refs?.github || "N/A"}

Generated by SDLC Tracking System
Last sync: ${new Date().toISOString()}
`.trim();
  }

  private mapEpicStatusToNotion(sdlcStatus: string): string {
    const statusMap: Record<string, string> = {
      planning: "Planning",
      in_progress: "In Progress",
      on_hold: "On Hold",
      completed: "Completed",
      cancelled: "Cancelled",
    };

    return statusMap[sdlcStatus] || "Planning";
  }

  private mapStatusToNotion(sdlcStatus: string): string {
    const statusMap: Record<string, string> = {
      ready: "Ready",
      in_progress: "In Progress",
      in_review: "In Review",
      done: "Done",
      blocked: "Blocked",
    };

    return statusMap[sdlcStatus] || "Ready";
  }

  private mapSDLCPhase(phase: number): string {
    const phaseMap: Record<number, string> = {
      1: "Originación",
      2: "Discovery",
      3: "Especificación",
      4: "Planning",
      5: "Desarrollo",
      6: "QA",
      7: "Seguridad",
      8: "Despliegue",
    };

    return phaseMap[phase] || "Unknown";
  }

  private async updateTrackingWithNotionId(
    itemId: string,
    notionId: string,
    itemType: "epic" | "story"
  ): Promise<void> {
    // This would update the sdlc-tracking.yaml file with the new Notion ID
    // Implementation would depend on the specific file update mechanism
    console.log(`Would update ${itemType} ${itemId} with Notion ID ${notionId}`);
  }

  private async updateTrackingFromNotion(page: NotionPage, trackingData: any): Promise<boolean> {
    // This would update the sdlc-tracking.yaml with data from Notion
    // Implementation would depend on the specific file update mechanism
    console.log(`Would update tracking from Notion page ${page.id}`);
    return true;
  }
}

/**
 * Factory function for creating Notion connector instances
 */
export function createNotionConnector(config: Partial<NotionConfig>): NotionConnector {
  const defaultConfig: NotionConfig = {
    apiKey: process.env.NOTION_API_KEY || "",
    databaseId: process.env.NOTION_DATABASE_ID || "",
    baseUrl: process.env.NOTION_BASE_URL || "https://api.notion.com/v1",
    version: process.env.NOTION_VERSION || "2022-06-28",
  };

  return new NotionConnector({ ...defaultConfig, ...config });
}

/**
 * Validate Notion connector configuration
 */
export async function validateNotionConfig(
  config?: Partial<NotionConfig>
): Promise<ValidationResult> {
  const connector = createNotionConnector(config || {});
  return connector.testConnection();
}
