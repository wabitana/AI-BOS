import { Entity, UniqueEntityID } from '@ai-bos/core';

export type TaskStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'SKIPPED';

export interface WorkflowTaskProps {
  name: string;
  description: string;
  agentId?: string | null;
  toolName?: string | null;
  input: Record<string, any>;
  output?: Record<string, any> | null;
  status: TaskStatus;
  dependsOn: string[];
  retryCount: number;
  maxRetries: number;
  startedAt?: Date | null;
  completedAt?: Date | null;
  error?: string | null;
}

/**
 * Domain Entity representing a single task within a workflow.
 * A task can be executed by an Agent, a Tool, or both.
 */
export class WorkflowTask extends Entity<WorkflowTaskProps> {
  private constructor(props: WorkflowTaskProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get name(): string {
    return this.props.name;
  }

  get status(): TaskStatus {
    return this.props.status;
  }

  get dependsOn(): string[] {
    return this.props.dependsOn;
  }

  get output(): Record<string, any> | null | undefined {
    return this.props.output;
  }

  get error(): string | null | undefined {
    return this.props.error;
  }

  public canRun(completedTaskIds: string[]): boolean {
    return (
      this.props.status === 'PENDING' &&
      this.props.dependsOn.every((depId) => completedTaskIds.includes(depId))
    );
  }

  public markRunning(): void {
    this.props.status = 'RUNNING';
    this.props.startedAt = new Date();
  }

  public markCompleted(output: Record<string, any>): void {
    this.props.status = 'COMPLETED';
    this.props.output = output;
    this.props.completedAt = new Date();
  }

  public markFailed(error: string): void {
    if (this.props.retryCount < this.props.maxRetries) {
      this.props.retryCount += 1;
      this.props.status = 'PENDING';
      this.props.error = error;
    } else {
      this.props.status = 'FAILED';
      this.props.error = error;
      this.props.completedAt = new Date();
    }
  }

  public markSkipped(): void {
    this.props.status = 'SKIPPED';
    this.props.completedAt = new Date();
  }

  public static create(
    props: Omit<WorkflowTaskProps, 'status' | 'retryCount'> & {
      status?: TaskStatus;
      retryCount?: number;
    },
    id?: UniqueEntityID
  ): WorkflowTask {
    return new WorkflowTask(
      {
        ...props,
        status: props.status ?? 'PENDING',
        retryCount: props.retryCount ?? 0,
        maxRetries: props.maxRetries ?? 3,
      },
      id
    );
  }
}
