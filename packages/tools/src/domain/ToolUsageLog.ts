import { Entity, UniqueEntityID } from '@ai-bos/core';

interface ToolUsageLogProps {
  organizationId: string;
  workspaceId?: string | null;
  agentId?: string | null;
  toolName: string;
  latencyMs: number;
  status: 'SUCCESS' | 'ERROR';
  error?: string | null;
  tokensUsed: number;
  cost: number;
  createdAt?: Date;
}

export class ToolUsageLog extends Entity<ToolUsageLogProps> {
  private constructor(props: ToolUsageLogProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get organizationId(): string {
    return this.props.organizationId;
  }

  get workspaceId(): string | null | undefined {
    return this.props.workspaceId;
  }
  
  get agentId(): string | null | undefined {
    return this.props.agentId;
  }

  get toolName(): string {
    return this.props.toolName;
  }

  get latencyMs(): number {
    return this.props.latencyMs;
  }

  get status(): 'SUCCESS' | 'ERROR' {
    return this.props.status;
  }

  get error(): string | null | undefined {
    return this.props.error;
  }

  get tokensUsed(): number {
    return this.props.tokensUsed;
  }

  get cost(): number {
    return this.props.cost;
  }

  public static create(props: ToolUsageLogProps, id?: UniqueEntityID): ToolUsageLog {
    return new ToolUsageLog({
      ...props,
      latencyMs: props.latencyMs ?? 0,
      tokensUsed: props.tokensUsed ?? 0,
      cost: props.cost ?? 0.0,
      createdAt: props.createdAt ?? new Date(),
    }, id);
  }
}
