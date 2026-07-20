import { Entity } from './Entity';

/**
 * Standard Repository interface for managing persistence of Aggregate Roots.
 */
export interface Repository<T extends Entity<any>> {
  save(entity: T): Promise<void>;
  findById(id: string): Promise<T | null>;
  delete(id: string): Promise<void>;
}
