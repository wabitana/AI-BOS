import { describe, it, expect, beforeEach } from 'vitest';
import { SaveMemoryUseCase } from './SaveMemoryUseCase';
import { InMemoryMemoryRepository } from '../infrastructure/InMemoryMemoryRepository';

describe('SaveMemoryUseCase', () => {
  let repo: InMemoryMemoryRepository;
  let useCase: SaveMemoryUseCase;

  beforeEach(() => {
    repo = new InMemoryMemoryRepository();
    useCase = new SaveMemoryUseCase(repo);
  });

  it('should save a memory and return its ID', async () => {
    const response = await useCase.execute({
      organizationId: 'org-123',
      type: 'DOCUMENT',
      title: 'Company Mission',
      content: 'To build AI workforces.',
    });

    expect(response.memoryId).toBeDefined();

    const savedMemory = await repo.findById(response.memoryId);
    expect(savedMemory).not.toBeNull();
    expect(savedMemory?.props.title).toBe('Company Mission');
    expect(savedMemory?.props.organizationId).toBe('org-123');
  });
});
