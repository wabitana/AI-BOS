import { Entity, UniqueEntityID } from '@ai-bos/core';

interface AgentProps {
  name: string;
  systemPrompt: string;
  model: string;
  temperature?: number;
  workspaceId: string;
}

export class Agent extends Entity<AgentProps> {
  private constructor(props: AgentProps, id?: UniqueEntityID) {
    super(
      {
        ...props,
        temperature: props.temperature ?? 0.7,
      },
      id
    );
  }

  get name(): string {
    return this.props.name;
  }

  get systemPrompt(): string {
    return this.props.systemPrompt;
  }

  get model(): string {
    return this.props.model;
  }

  get temperature(): number {
    return this.props.temperature!;
  }

  get workspaceId(): string {
    return this.props.workspaceId;
  }

  public static create(props: AgentProps, id?: UniqueEntityID): Agent {
    return new Agent(props, id);
  }
}
