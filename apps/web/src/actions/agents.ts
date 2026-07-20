'use server';

import { prisma } from '@ai-bos/database';
import { getCurrentUser, requireRole } from '@/lib/auth-helpers';
import { revalidatePath } from 'next/cache';

export async function getAgents(organizationId: string, workspaceId?: string) {
  await getCurrentUser();
  await requireRole(organizationId, 'MEMBER');

  const whereClause: any = { organizationId };
  if (workspaceId) {
    whereClause.workspaceId = workspaceId;
  }

  return prisma.agent.findMany({
    where: whereClause,
    include: {
      versions: {
        orderBy: { version: 'desc' },
        take: 1,
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getAgent(id: string, organizationId: string) {
  await getCurrentUser();
  await requireRole(organizationId, 'MEMBER');

  return prisma.agent.findUnique({
    where: { id, organizationId },
    include: {
      versions: {
        orderBy: { version: 'desc' },
      },
      executions: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      }
    },
  });
}

export async function createAgent(organizationId: string, workspaceId: string | undefined, data: { name: string; description?: string; systemPrompt?: string }) {
  const user = await getCurrentUser();
  await requireRole(organizationId, 'MANAGER');

  const agent = await prisma.agent.create({
    data: {
      organizationId,
      workspaceId,
      name: data.name,
      description: data.description,
      type: 'CUSTOM',
      status: 'ACTIVE',
      versions: {
        create: {
          version: 1,
          systemPrompt: data.systemPrompt || '',
          tools: [],
          config: {},
        }
      }
    },
  });

  await prisma.auditLog.create({
    data: {
      organizationId,
      workspaceId,
      actorId: user.id,
      action: 'agent.created',
      resource: 'Agent',
      resourceId: agent.id,
      metadata: { name: agent.name },
    },
  });

  revalidatePath(`/organization/${organizationId}/agents`);
  return agent;
}

export async function updateAgentVersion(
  agentId: string, 
  organizationId: string, 
  data: { systemPrompt: string; tools: string[]; config: any }
) {
  const user = await getCurrentUser();
  await requireRole(organizationId, 'MANAGER');

  // Find the agent to get the latest version number
  const agent = await prisma.agent.findUnique({
    where: { id: agentId, organizationId },
    include: {
      versions: {
        orderBy: { version: 'desc' },
        take: 1,
      }
    }
  });

  if (!agent) throw new Error('Agent not found');

  const nextVersion = agent.versions.length > 0 ? agent.versions[0].version + 1 : 1;

  const newVersion = await prisma.agentVersion.create({
    data: {
      agentId: agent.id,
      version: nextVersion,
      systemPrompt: data.systemPrompt,
      tools: data.tools,
      config: data.config,
    }
  });

  await prisma.auditLog.create({
    data: {
      organizationId,
      workspaceId: agent.workspaceId,
      actorId: user.id,
      action: 'agent.version.created',
      resource: 'Agent',
      resourceId: agent.id,
      metadata: { version: newVersion.version },
    },
  });

  revalidatePath(`/organization/${organizationId}/agents/${agent.id}`);
  return newVersion;
}
