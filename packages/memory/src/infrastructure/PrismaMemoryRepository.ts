import { IMemoryRepository } from '../domain/IMemoryRepository';
import { Memory } from '../domain/Memory';
import { prisma } from '@ai-bos/database';
import { UniqueEntityID } from '@ai-bos/core';

/**
 * Concrete Prisma implementation of the Memory repository.
 */
export class PrismaMemoryRepository implements IMemoryRepository {
  async save(entity: Memory): Promise<void> {
    await prisma.memory.upsert({
      where: { id: entity.id.toValue() },
      update: {
        type: entity.props.type,
        title: entity.props.title,
        content: entity.props.content,
        summary: entity.props.summary,
        tags: entity.props.tags,
        author: entity.props.author,
        confidence: entity.props.confidence,
        importance: entity.props.importance,
        updatedAt: entity.props.updatedAt,
        expiresAt: entity.props.expiresAt,
      },
      create: {
        id: entity.id.toValue(),
        organizationId: entity.props.organizationId,
        workspaceId: entity.props.workspaceId,
        type: entity.props.type,
        title: entity.props.title,
        content: entity.props.content,
        summary: entity.props.summary,
        tags: entity.props.tags,
        author: entity.props.author,
        confidence: entity.props.confidence,
        importance: entity.props.importance,
        createdAt: entity.props.createdAt,
        updatedAt: entity.props.updatedAt,
        expiresAt: entity.props.expiresAt,
      },
    });
  }

  async findById(id: string): Promise<Memory | null> {
    const raw = await prisma.memory.findUnique({ where: { id } });
    if (!raw) return null;

    return Memory.create(raw, new UniqueEntityID(raw.id));
  }

  async delete(id: string): Promise<void> {
    await prisma.memory.delete({ where: { id } });
  }

  async findByOrganizationId(organizationId: string): Promise<Memory[]> {
    const raw = await prisma.memory.findMany({ where: { organizationId } });
    return raw.map((r) => Memory.create(r, new UniqueEntityID(r.id)));
  }

  async searchByTags(tags: string[]): Promise<Memory[]> {
    const raw = await prisma.memory.findMany({
      where: {
        tags: {
          hasSome: tags,
        },
      },
    });
    return raw.map((r) => Memory.create(r, new UniqueEntityID(r.id)));
  }
}
