import { randomUUID } from 'crypto';

/**
 * Encapsulates a unique identifier for Entities and Aggregate Roots.
 */
export class UniqueEntityID {
  private readonly value: string;

  constructor(id?: string) {
    this.value = id ? id : randomUUID();
  }

  public equals(id?: UniqueEntityID): boolean {
    if (id === null || id === undefined) {
      return false;
    }
    if (!(id instanceof this.constructor)) {
      return false;
    }
    return id.toValue() === this.value;
  }

  public toValue(): string {
    return this.value;
  }
}
