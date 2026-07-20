/**
 * Port for checking tool permissions.
 */
export interface IToolPermissionChecker {
  /**
   * Returns true if the given tool is allowed for the specified context.
   * Checks workspace-level first, then falls back to agent-level overrides.
   */
  isAllowed(params: {
    toolName: string;
    workspaceId?: string | null;
    agentId?: string | null;
  }): Promise<boolean>;
}
