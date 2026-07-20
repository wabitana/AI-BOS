import type { Agent, AgentVersion, AgentExecution } from '@ai-bos/database';

export interface AgentExecutionContext {
  input: Record<string, any>;
  organizationId: string;
  workspaceId?: string;
  userId?: string;
}

export interface AgentExecutionResult {
  status: 'COMPLETED' | 'FAILED';
  output?: any;
  error?: string;
  tokensUsed: number;
  cost: number;
  logs: any[];
}

export abstract class BaseAgent {
  protected agent: Agent;
  protected version: AgentVersion;

  constructor(agent: Agent, version: AgentVersion) {
    this.agent = agent;
    this.version = version;
  }

  /**
   * Abstract method that subclasses must implement to provide their specific execution logic.
   */
  protected abstract run(context: AgentExecutionContext, execution: AgentExecution): Promise<AgentExecutionResult>;

  /**
   * Wraps the execution with token tracking, cost tracking, and error handling.
   */
  public async execute(context: AgentExecutionContext, dbClient: any): Promise<AgentExecutionResult> {
    // Create execution record
    let execution = await dbClient.agentExecution.create({
      data: {
        organizationId: context.organizationId,
        workspaceId: context.workspaceId,
        agentId: this.agent.id,
        agentVersionId: this.version.id,
        input: context.input,
        status: 'RUNNING',
      },
    });

    let result: AgentExecutionResult;

    try {
      result = await this.run(context, execution);
      
      // Update execution with success
      await dbClient.agentExecution.update({
        where: { id: execution.id },
        data: {
          status: 'COMPLETED',
          output: result.output,
          tokensUsed: result.tokensUsed,
          cost: result.cost,
          logs: result.logs,
          completedAt: new Date(),
        },
      });
    } catch (error: any) {
      result = {
        status: 'FAILED',
        error: error.message || 'Unknown error',
        tokensUsed: 0,
        cost: 0,
        logs: [{ error: error.message }],
      };

      // Update execution with failure
      await dbClient.agentExecution.update({
        where: { id: execution.id },
        data: {
          status: 'FAILED',
          output: { error: result.error },
          logs: result.logs,
          completedAt: new Date(),
        },
      });
    }

    return result;
  }
}
