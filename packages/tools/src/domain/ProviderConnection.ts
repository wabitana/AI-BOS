import { Entity, UniqueEntityID } from '@ai-bos/core';

interface ProviderConnectionProps {
  organizationId: string;
  workspaceId?: string | null;
  providerName: string;
  encryptedKey: string;
  status: 'ACTIVE' | 'INVALID';
  createdAt?: Date;
  updatedAt?: Date;
}

export class ProviderConnection extends Entity<ProviderConnectionProps> {
  private constructor(props: ProviderConnectionProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get organizationId(): string {
    return this.props.organizationId;
  }

  get workspaceId(): string | null | undefined {
    return this.props.workspaceId;
  }

  get providerName(): string {
    return this.props.providerName;
  }

  get encryptedKey(): string {
    return this.props.encryptedKey;
  }

  get status(): 'ACTIVE' | 'INVALID' {
    return this.props.status;
  }

  public invalidate(): void {
    this.props.status = 'INVALID';
  }

  public updateKey(newEncryptedKey: string): void {
    this.props.encryptedKey = newEncryptedKey;
    this.props.status = 'ACTIVE';
  }

  public static create(props: ProviderConnectionProps, id?: UniqueEntityID): ProviderConnection {
    return new ProviderConnection({
      ...props,
      status: props.status ?? 'ACTIVE',
      createdAt: props.createdAt ?? new Date(),
    }, id);
  }
}
