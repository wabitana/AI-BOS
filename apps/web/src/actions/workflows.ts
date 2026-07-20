'use server';

import { prisma } from '@ai-bos/database';
import { getCurrentUser, requireRole } from '@/lib/auth-helpers';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const createWorkflowSchema = z.object({
  organizationId: z.string().uuid(),
  workspaceId: z.string().uuid().optional(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

export async function createWorkflow(data: z.infer<typeof createWorkflowSchema>) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  const { organizationId, workspaceId, name, description } = createWorkflowSchema.parse(data);

  // Require at least MANAGER role to create workflows
  await requireRole(organizationId, 'MANAGER');

  const workflow = await prisma.workflow.create({
    data: {
      organizationId,
      workspaceId,
      name,
      description,
      status: 'DRAFT',
    },
  });

  await prisma.auditLog.create({
    data: {
      organizationId,
      workspaceId,
      actorId: user.id,
      action: 'workflow.created',
      resource: 'Workflow',
      resourceId: workflow.id,
      metadata: { name },
    },
  });

  revalidatePath('/workflows');
  return { workflow };
}

const saveWorkflowVersionSchema = z.object({
  workflowId: z.string().uuid(),
  organizationId: z.string().uuid(),
  nodes: z.any(),
  edges: z.any(),
});

export async function saveWorkflowVersion(data: z.infer<typeof saveWorkflowVersionSchema>) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  const { workflowId, organizationId, nodes, edges } = saveWorkflowVersionSchema.parse(data);
  await requireRole(organizationId, 'MANAGER');

  // Determine next version number
  const latestVersion = await prisma.workflowVersion.findFirst({
    where: { workflowId },
    orderBy: { version: 'desc' },
  });

  const nextVersionNum = latestVersion ? latestVersion.version + 1 : 1;

  const version = await prisma.workflowVersion.create({
    data: {
      workflowId,
      version: nextVersionNum,
      nodes,
      edges,
    },
  });

  await prisma.auditLog.create({
    data: {
      organizationId,
      actorId: user.id,
      action: 'workflow_version.saved',
      resource: 'WorkflowVersion',
      resourceId: version.id,
      metadata: { workflowId, version: nextVersionNum },
    },
  });

  return { version };
}
