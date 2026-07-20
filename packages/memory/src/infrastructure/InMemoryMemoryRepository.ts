import { IMemoryRepository } from '../domain/IMemoryRepository';
import { Memory } from '../domain/Memory';

/**
 * In-memory repository for unit testing and local development.
 */
export class InMemoryMemoryRepository implements IMemoryRepository {
  private items: Memory[] = [];

  async save(entity: Memory): Promise<void> {
    const existsIndex = this.items.findIndex((i) => i.id.equals(entity.id));
    if (existsIndex >= 0) {
      this.items[existsIndex] = entity;
    } else {
      this.items.push(entity);
    }
  }

  async findById(id: string): Promise<Memory | null> {
    const memory = this.items.find((i) => i.id.toValue() === id);
    return memory ?? null;
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((i) => i.id.toValue() !== id);
  }

  async findByOrganizationId(organizationId: string): Promise<Memory[]> {
    return this.items.filter((i) => i.props.organizationId === organizationId);
  }

  async searchByTags(tags: string[]): Promise<Memory[]> {
    return this.items.filter((i) => tags.some((tag) => i.props.tags.includes(tag)));
  }
}
