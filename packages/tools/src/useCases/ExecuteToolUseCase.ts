import { UseCase } from '@ai-bos/core';
import { IToolRegistry } from '../domain/IToolRegistry';
import { IToolPermissionChecker } from '../domain/IToolPermissionChecker';
import { IToolUsageLogRepository } from '../domain/IToolUsageLogRepository';
import { ToolUsageLog } from '../domain/ToolUsageLog';

interface ExecuteToolRequestDTO {
  toolName: string;
  args: Record<string, unknown>;
  /** Context for permission checks and usage logging */
  context?: {
    organizationId?: string;
    workspaceId?: string | null;
    agentId?: string | null;
  };
}

interface ExecuteToolResponseDTO {
  result: unknown;
  latencyMs: number;
}

interface ExecuteToolDeps {
  toolRegistry: IToolRegistry;
  permissionChecker?: IToolPermissionChecker;
  usageLogRepository?: IToolUsageLogRepository;
}

export class ExecuteToolUseCase implements UseCase<ExecuteToolRequestDTO, ExecuteToolResponseDTO> {
  private toolRegistry: IToolRegistry;
  private permissionChecker?: IToolPermissionChecker;
  private usageLogRepository?: IToolUsageLogRepository;

  constructor(deps: ExecuteToolDeps);
  /** @deprecated Use the deps-object constructor. Kept for backward compatibility. */
  constructor(toolRegistry: IToolRegistry);
  constructor(depsOrRegistry: ExecuteToolDeps | IToolRegistry) {
    if ('toolRegistry' in depsOrRegistry) {
      this.toolRegistry = depsOrRegistry.toolRegistry;
      this.permissionChecker = depsOrRegistry.permissionChecker;
      this.usageLogRepository = depsOrRegistry.usageLogRepository;
    } else {
      // Legacy single-arg constructor
      this.toolRegistry = depsOrRegistry;
    }
  }

  async execute(request: ExecuteToolRequestDTO): Promise<ExecuteToolResponseDTO> {
    const tool = await this.toolRegistry.getTool(request.toolName);
    if (!tool) {
      throw new Error(`Tool ${request.toolName} not found`);
    }

    // --- Permission check ---
    if (this.permissionChecker && request.context) {
      const allowed = await this.permissionChecker.isAllowed({
        toolName: request.toolName,
        workspaceId: request.context.workspaceId,
        agentId: request.context.agentId,
      });
      if (!allowed) {
        throw new Error(`Permission denied: tool "${request.toolName}" is not allowed in this context.`);
      }
    }

    // --- Execute with latency tracking ---
    const startTime = performance.now();
    let status: 'SUCCESS' | 'ERROR' = 'SUCCESS';
    let errorMessage: string | null = null;
    let result: unknown;

    try {
      result = await tool.execute(request.args);
    } catch (err) {
      status = 'ERROR';
      errorMessage = err instanceof Error ? err.message : String(err);
      throw err;
    } finally {
      const latencyMs = Math.round(performance.now() - startTime);

      // --- Usage logging (fire-and-forget) ---
      if (this.usageLogRepository && request.context?.organizationId) {
        const log = ToolUsageLog.create({
          organizationId: request.context.organizationId,
          workspaceId: request.context.workspaceId,
          agentId: request.context.agentId,
          toolName: request.toolName,
          latencyMs,
          status,
          error: errorMessage,
          tokensUsed: 0,
          cost: 0,
        });
        // Intentionally not awaited to avoid blocking the response
        this.usageLogRepository.save(log).catch(() => {
          // Silently swallow logging errors — never block tool execution
        });
      }
    }

    return {
      result,
      latencyMs: Math.round(performance.now() - startTime),
    };
  }
}

