'use server';

import { prisma } from '@ai-bos/database';
import { createWorkspaceSchema, updateWorkspaceSchema } from '@ai-bos/shared';
import { getCurrentUser, createAuditLog, requireRole } from '@/lib/auth-helpers';
import { revalidatePath } from 'next/cache';

/**
 * Create a new workspace within an organization. Requires MANAGER role.
 */
export async function createWorkspace(formData: FormData) {
  const user = await getCurrentUser();

  const parsed = createWorkspaceSchema.safeParse({
    organizationId: formData.get('organizationId'),
    name: formData.get('name'),
    description: formData.get('description'),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await requireRole(parsed.data.organizationId, 'MANAGER');

  const workspace = await prisma.workspace.create({
    data: {
      organizationId: parsed.data.organizationId,
      name: parsed.data.name,
      description: parsed.data.description,
      settings: {
        create: {},
      },
    },
  });

  await createAuditLog({
    organizationId: parsed.data.organizationId,
    workspaceId: workspace.id,
    actorId: user.id,
    action: 'workspace.created',
    resource: 'Workspace',
    resourceId: workspace.id,
    metadata: { name: workspace.name },
  });

  revalidatePath('/settings');
  return { data: workspace };
}

/**
 * Update workspace details. Requires MANAGER role.
 */
export async function updateWorkspace(formData: FormData) {
  const user = await getCurrentUser();

  const parsed = updateWorkspaceSchema.safeParse({
    id: formData.get('id'),
    name: formData.get('name'),
    description: formData.get('description'),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const workspace = await prisma.workspace.findUniqueOrThrow({
    where: { id: parsed.data.id },
  });

  await requireRole(workspace.organizationId, 'MANAGER');

  const updated = await prisma.workspace.update({
    where: { id: parsed.data.id },
    data: {
      ...(parsed.data.name && { name: parsed.data.name }),
      ...(parsed.data.description !== undefined && { description: parsed.data.description }),
    },
  });

  await createAuditLog({
    organizationId: workspace.organizationId,
    workspaceId: workspace.id,
    actorId: user.id,
    action: 'workspace.updated',
    resource: 'Workspace',
    resourceId: workspace.id,
  });

  revalidatePath('/settings');
  return { data: updated };
}

/**
 * Get workspaces for an organization.
 */
export async function getOrganizationWorkspaces(organizationId: string) {
  await requireRole(organizationId, 'VIEWER');

  return prisma.workspace.findMany({
    where: { organizationId },
    orderBy: { name: 'asc' },
  });
}
