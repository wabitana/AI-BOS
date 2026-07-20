import { UseCase } from '@ai-bos/core';
import { IMemoryRepository } from '../domain/IMemoryRepository';
import { Memory } from '../domain/Memory';

export interface SaveMemoryRequest {
  organizationId: string;
  type: string;
  title: string;
  content: string;
  tags?: string[];
  confidence?: number;
  importance?: number;
}

export interface SaveMemoryResponse {
  memoryId: string;
}

/**
 * Application Use Case to securely save organizational memory.
 */
export class SaveMemoryUseCase implements UseCase<SaveMemoryRequest, SaveMemoryResponse> {
  constructor(private readonly memoryRepo: IMemoryRepository) {}

  async execute(request: SaveMemoryRequest): Promise<SaveMemoryResponse> {
    const memory = Memory.create({
      organizationId: request.organizationId,
      type: request.type,
      title: request.title,
      content: request.content,
      tags: request.tags ?? [],
      confidence: request.confidence ?? 1.0,
      importance: request.importance ?? 1.0,
    });

    await this.memoryRepo.save(memory);

    return {
      memoryId: memory.id.toValue(),
    };
  }
}
