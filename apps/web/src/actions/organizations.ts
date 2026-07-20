'use server';

import { prisma } from '@ai-bos/database';
import { createOrganizationSchema, updateOrganizationSchema } from '@ai-bos/shared';
import { getCurrentUser, createAuditLog, requireRole } from '@/lib/auth-helpers';
import { revalidatePath } from 'next/cache';

/**
 * Create a new organization. The creator becomes the OWNER.
 */
export async function createOrganization(formData: FormData) {
  const user = await getCurrentUser();

  const parsed = createOrganizationSchema.safeParse({
    name: formData.get('name'),
    slug: formData.get('slug'),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  // Check slug uniqueness
  const existing = await prisma.organization.findUnique({
    where: { slug: parsed.data.slug },
  });

  if (existing) {
    return { error: { slug: ['This slug is already taken'] } };
  }

  const org = await prisma.organization.create({
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      memberships: {
        create: {
          userId: user.id,
          role: 'OWNER',
        },
      },
      settings: {
        create: {},
      },
    },
  });

  await createAuditLog({
    organizationId: org.id,
    actorId: user.id,
    action: 'organization.created',
    resource: 'Organization',
    resourceId: org.id,
    metadata: { name: org.name, slug: org.slug },
  });

  revalidatePath('/');
  return { data: org };
}

/**
 * Update an existing organization. Requires ADMIN role.
 */
export async function updateOrganization(formData: FormData) {
  const user = await getCurrentUser();

  const parsed = updateOrganizationSchema.safeParse({
    id: formData.get('id'),
    name: formData.get('name'),
    slug: formData.get('slug'),
    timezone: formData.get('timezone'),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await requireRole(parsed.data.id, 'ADMIN');

  // If slug is changing, check uniqueness
  if (parsed.data.slug) {
    const existing = await prisma.organization.findFirst({
      where: { slug: parsed.data.slug, NOT: { id: parsed.data.id } },
    });
    if (existing) {
      return { error: { slug: ['This slug is already taken'] } };
    }
  }

  const org = await prisma.organization.update({
    where: { id: parsed.data.id },
    data: {
      ...(parsed.data.name && { name: parsed.data.name }),
      ...(parsed.data.slug && { slug: parsed.data.slug }),
      ...(parsed.data.timezone && { timezone: parsed.data.timezone }),
    },
  });

  await createAuditLog({
    organizationId: org.id,
    actorId: user.id,
    action: 'organization.updated',
    resource: 'Organization',
    resourceId: org.id,
  });

  revalidatePath('/settings');
  return { data: org };
}

/**
 * Get organizations for the current user.
 */
export async function getUserOrganizations() {
  const user = await getCurrentUser();

  const memberships = await prisma.membership.findMany({
    where: { userId: user.id },
    include: {
      organization: {
        include: {
          _count: { select: { memberships: true, workspaces: true } },
        },
      },
    },
    orderBy: { organization: { name: 'asc' } },
  });

  return memberships.map((m) => ({
    ...m.organization,
    role: m.role,
    memberCount: m.organization._count.memberships,
    workspaceCount: m.organization._count.workspaces,
  }));
}
