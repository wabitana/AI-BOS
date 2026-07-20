'use server';

import { prisma } from '@ai-bos/database';
import { inviteMemberSchema, updateMemberRoleSchema } from '@ai-bos/shared';
import { getCurrentUser, createAuditLog, requireRole } from '@/lib/auth-helpers';
import { revalidatePath } from 'next/cache';

/**
 * Invite a user to an organization by email. Requires ADMIN role.
 * If the user exists, creates a membership. Otherwise, creates the user first.
 */
export async function inviteMember(formData: FormData) {
  const actor = await getCurrentUser();

  const parsed = inviteMemberSchema.safeParse({
    organizationId: formData.get('organizationId'),
    email: formData.get('email'),
    role: formData.get('role') || 'MEMBER',
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await requireRole(parsed.data.organizationId, 'ADMIN');

  // Find or create the user
  let user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: parsed.data.email,
        name: parsed.data.email.split('@')[0],
      },
    });
  }

  // Check if already a member
  const existing = await prisma.membership.findUnique({
    where: {
      organizationId_userId: {
        organizationId: parsed.data.organizationId,
        userId: user.id,
      },
    },
  });

  if (existing) {
    return { error: { email: ['User is already a member of this organization'] } };
  }

  const membership = await prisma.membership.create({
    data: {
      organizationId: parsed.data.organizationId,
      userId: user.id,
      role: parsed.data.role,
    },
  });

  // Create a notification for the invited user
  await prisma.notification.create({
    data: {
      userId: user.id,
      type: 'INVITE',
      title: 'You have been invited',
      message: `You have been invited to an organization.`,
      link: '/',
    },
  });

  await createAuditLog({
    organizationId: parsed.data.organizationId,
    actorId: actor.id,
    action: 'member.invited',
    resource: 'Membership',
    resourceId: membership.id,
    metadata: { email: parsed.data.email, role: parsed.data.role },
  });

  revalidatePath('/settings');
  return { data: membership };
}

/**
 * Update a member's role. Requires ADMIN role.
 * Cannot demote yourself or the last OWNER.
 */
export async function updateMemberRole(formData: FormData) {
  const actor = await getCurrentUser();

  const parsed = updateMemberRoleSchema.safeParse({
    membershipId: formData.get('membershipId'),
    role: formData.get('role'),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const membership = await prisma.membership.findUniqueOrThrow({
    where: { id: parsed.data.membershipId },
  });

  await requireRole(membership.organizationId, 'ADMIN');

  // Prevent demoting the last owner
  if (membership.role === 'OWNER' && parsed.data.role !== 'OWNER') {
    const ownerCount = await prisma.membership.count({
      where: { organizationId: membership.organizationId, role: 'OWNER' },
    });
    if (ownerCount <= 1) {
      return { error: { role: ['Cannot demote the last owner'] } };
    }
  }

  const updated = await prisma.membership.update({
    where: { id: parsed.data.membershipId },
    data: { role: parsed.data.role },
  });

  await createAuditLog({
    organizationId: membership.organizationId,
    actorId: actor.id,
    action: 'member.role_updated',
    resource: 'Membership',
    resourceId: membership.id,
    metadata: { from: membership.role, to: parsed.data.role },
  });

  revalidatePath('/settings');
  return { data: updated };
}

/**
 * Remove a member from an organization. Requires ADMIN role.
 * Cannot remove yourself or the last OWNER.
 */
export async function removeMember(membershipId: string) {
  const actor = await getCurrentUser();

  const membership = await prisma.membership.findUniqueOrThrow({
    where: { id: membershipId },
  });

  await requireRole(membership.organizationId, 'ADMIN');

  // Cannot remove yourself
  if (membership.userId === actor.id) {
    return { error: { general: ['Cannot remove yourself'] } };
  }

  // Cannot remove the last owner
  if (membership.role === 'OWNER') {
    const ownerCount = await prisma.membership.count({
      where: { organizationId: membership.organizationId, role: 'OWNER' },
    });
    if (ownerCount <= 1) {
      return { error: { general: ['Cannot remove the last owner'] } };
    }
  }

  await prisma.membership.delete({ where: { id: membershipId } });

  await createAuditLog({
    organizationId: membership.organizationId,
    actorId: actor.id,
    action: 'member.removed',
    resource: 'Membership',
    resourceId: membershipId,
    metadata: { userId: membership.userId },
  });

  revalidatePath('/settings');
  return { success: true };
}

/**
 * Get all members of an organization.
 */
export async function getOrganizationMembers(organizationId: string) {
  await requireRole(organizationId, 'VIEWER');

  return prisma.membership.findMany({
    where: { organizationId },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
    orderBy: { user: { name: 'asc' } },
  });
}
