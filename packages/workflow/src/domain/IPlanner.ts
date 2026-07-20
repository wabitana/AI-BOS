import { Workflow } from './Workflow';

/**
 * The Planner takes a high-level goal and decomposes it into
 * a directed acyclic graph of WorkflowTasks.
 */
export interface IPlanner {
  /**
   * Given a workflow in DRAFT state and a goal description,
   * populate the workflow with planned tasks and finalize it.
   */
  plan(workflow: Workflow, goal: string): Promise<Workflow>;
}
