import { AggregateRoot, UniqueEntityID } from '@ai-bos/core';

export interface MemoryProps {
  organizationId: string;
  workspaceId?: string | null;
  type: string;
  title: string;
  content: string;
  summary?: string | null;
  tags: string[];
  author?: string | null;
  confidence: number | null;
  importance: number | null;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date | null;
}

/**
 * Domain Entity representing an Organizational Memory.
 */
export class Memory extends AggregateRoot<MemoryProps> {
  private constructor(props: MemoryProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(
    props: Omit<MemoryProps, 'createdAt' | 'updatedAt'> & {
      createdAt?: Date;
      updatedAt?: Date;
    },
    id?: UniqueEntityID
  ): Memory {
    return new Memory(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id
    );
  }

  // Domain logic examples
  public isExpired(): boolean {
    if (!this.props.expiresAt) return false;
    return this.props.expiresAt.getTime() < Date.now();
  }

  public updateContent(content: string, summary?: string): void {
    this.props.content = content;
    if (summary) this.props.summary = summary;
    this.props.updatedAt = new Date();
  }
}
