import { Entity } from './Entity';

/**
 * AggregateRoot is a special kind of Entity that serves as the root of an Aggregate.
 * In a fully event-driven system, it also holds and dispatches Domain Events.
 */
export abstract class AggregateRoot<T> extends Entity<T> {
  private _domainEvents: any[] = [];

  get domainEvents(): any[] {
    return this._domainEvents;
  }

  protected addDomainEvent(domainEvent: any): void {
    this._domainEvents.push(domainEvent);
  }

  public clearEvents(): void {
    this._domainEvents.splice(0, this._domainEvents.length);
  }
}
