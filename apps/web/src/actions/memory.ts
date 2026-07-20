'use server';

import { prisma } from '@ai-bos/database';
import { getCurrentUser, requireRole } from '@/lib/auth-helpers';
import { revalidatePath } from 'next/cache';
import { InMemoryVectorStore } from '@ai-bos/memory';

export async function getMemories(organizationId: string, workspaceId?: string) {
  await getCurrentUser();
  await requireRole(organizationId, 'MEMBER');

  const whereClause: any = { organizationId };
  if (workspaceId) {
    whereClause.workspaceId = workspaceId;
  }

  return prisma.memory.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
  });
}

export async function createMemory(
  organizationId: string, 
  workspaceId: string | undefined, 
  data: { title: string; content: string; type: string; tags: string[] }
) {
  const user = await getCurrentUser();
  await requireRole(organizationId, 'MEMBER');

  const memory = await prisma.memory.create({
    data: {
      organizationId,
      workspaceId,
      title: data.title,
      content: data.content,
      type: data.type,
      tags: data.tags,
      author: user.id,
    },
  });

  // Also simulate indexing into our VectorStore
  const vectorStore = new InMemoryVectorStore(prisma);
  await vectorStore.saveEmbedding(memory.id, memory.title + ' ' + memory.content);

  revalidatePath(`/organization/${organizationId}/memory`);
  return memory;
}

export async function getConversations(organizationId: string, workspaceId?: string) {
  await getCurrentUser();
  await requireRole(organizationId, 'MEMBER');

  const whereClause: any = { organizationId };
  if (workspaceId) {
    whereClause.workspaceId = workspaceId;
  }

  return prisma.conversation.findMany({
    where: whereClause,
    orderBy: { updatedAt: 'desc' },
    include: {
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1, // just to show the latest message in the UI
      }
    }
  });
}
