import { AggregateRoot, UniqueEntityID } from '@ai-bos/core';
import { WorkflowTask } from './WorkflowTask';

export type WorkflowStatus = 'DRAFT' | 'PLANNED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export interface WorkflowProps {
  name: string;
  description: string;
  organizationId: string;
  workspaceId?: string | null;
  status: WorkflowStatus;
  tasks: WorkflowTask[];
  createdAt: Date;
  updatedAt: Date;
  startedAt?: Date | null;
  completedAt?: Date | null;
}

/**
 * Aggregate Root representing a complete workflow — an ordered graph of tasks
 * that are planned, scheduled, executed, and evaluated.
 */
export class Workflow extends AggregateRoot<WorkflowProps> {
  private constructor(props: WorkflowProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get name(): string {
    return this.props.name;
  }

  get status(): WorkflowStatus {
    return this.props.status;
  }

  get tasks(): WorkflowTask[] {
    return this.props.tasks;
  }

  /**
   * Add a task to the workflow. Only allowed while in DRAFT or PLANNED state.
   */
  public addTask(task: WorkflowTask): void {
    if (this.props.status !== 'DRAFT' && this.props.status !== 'PLANNED') {
      throw new Error(`Cannot add tasks to a workflow in "${this.props.status}" state`);
    }
    this.props.tasks.push(task);
    this.props.updatedAt = new Date();
  }

  /**
   * Returns tasks whose dependencies are all satisfied and are ready to run.
   */
  public getRunnableTasks(): WorkflowTask[] {
    const completedIds = this.props.tasks
      .filter((t) => t.status === 'COMPLETED')
      .map((t) => t.id.toValue());

    return this.props.tasks.filter((t) => t.canRun(completedIds));
  }

  /**
   * Transition workflow to RUNNING state.
   */
  public start(): void {
    if (this.props.status !== 'PLANNED') {
      throw new Error(`Cannot start a workflow in "${this.props.status}" state`);
    }
    this.props.status = 'RUNNING';
    this.props.startedAt = new Date();
    this.props.updatedAt = new Date();
  }

  /**
   * Evaluate whether the workflow is complete or has failed.
   */
  public evaluate(): void {
    const allDone = this.props.tasks.every(
      (t) => t.status === 'COMPLETED' || t.status === 'SKIPPED'
    );
    const anyFailed = this.props.tasks.some((t) => t.status === 'FAILED');

    if (anyFailed) {
      this.props.status = 'FAILED';
      this.props.completedAt = new Date();
    } else if (allDone) {
      this.props.status = 'COMPLETED';
      this.props.completedAt = new Date();
    }
    this.props.updatedAt = new Date();
  }

  /**
   * Cancel the workflow.
   */
  public cancel(): void {
    this.props.status = 'CANCELLED';
    this.props.completedAt = new Date();
    this.props.updatedAt = new Date();
  }

  /**
   * Transition from DRAFT → PLANNED, indicating the planner has finalized the task graph.
   */
  public finalizePlan(): void {
    if (this.props.status !== 'DRAFT') {
      throw new Error(`Cannot finalize a workflow in "${this.props.status}" state`);
    }
    if (this.props.tasks.length === 0) {
      throw new Error('Cannot finalize a workflow with no tasks');
    }
    this.props.status = 'PLANNED';
    this.props.updatedAt = new Date();
  }

  public static create(
    props: Omit<WorkflowProps, 'status' | 'tasks' | 'createdAt' | 'updatedAt'> & {
      status?: WorkflowStatus;
      tasks?: WorkflowTask[];
      createdAt?: Date;
      updatedAt?: Date;
    },
    id?: UniqueEntityID
  ): Workflow {
    return new Workflow(
      {
        ...props,
        status: props.status ?? 'DRAFT',
        tasks: props.tasks ?? [],
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id
    );
  }
}
