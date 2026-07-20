import { Repository } from '@ai-bos/core';
import { Memory } from './Memory';

/**
 * Interface for Memory persistence.
 * Implementations can be Prisma, Mock, etc.
 */
export interface IMemoryRepository extends Repository<Memory> {
  findByOrganizationId(organizationId: string): Promise<Memory[]>;
  searchByTags(tags: string[]): Promise<Memory[]>;
}
