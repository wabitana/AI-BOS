import { WorkflowTask } from './WorkflowTask';

/**
 * The Executor runs a single task, producing output or throwing an error.
 * Implementations may delegate to agents, tools, or external services.
 */
export interface IExecutor {
  /**
   * Execute a task and return the output.
   * The executor is responsible for calling the appropriate agent or tool.
   */
  execute(task: WorkflowTask): Promise<Record<string, any>>;
}
