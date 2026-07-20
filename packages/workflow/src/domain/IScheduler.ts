import { WorkflowTask } from './WorkflowTask';
import { Workflow } from './Workflow';

/**
 * The Scheduler determines which tasks are ready to run
 * and in what order, respecting dependency constraints.
 */
export interface IScheduler {
  /**
   * Given a workflow, return the next batch of tasks to execute.
   * This allows for parallel execution of independent tasks.
   */
  getNextBatch(workflow: Workflow): Promise<WorkflowTask[]>;
}
