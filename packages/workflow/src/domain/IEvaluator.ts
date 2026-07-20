import { Workflow } from './Workflow';

export interface EvaluationResult {
  isComplete: boolean;
  isFailed: boolean;
  completedTaskCount: number;
  failedTaskCount: number;
  pendingTaskCount: number;
  summary: string;
}

/**
 * The Evaluator inspects the current state of a workflow
 * and determines whether it has succeeded, failed, or needs more work.
 */
export interface IEvaluator {
  /**
   * Evaluate the workflow's progress and return a structured result.
   */
  evaluate(workflow: Workflow): Promise<EvaluationResult>;
}
