'use server';

import { prisma } from '@ai-bos/database';
import { createTeamSchema, updateTeamSchema, addTeamMemberSchema } from '@ai-bos/shared';
import { getCurrentUser, createAuditLog, requireRole } from '@/lib/auth-helpers';
import { revalidatePath } from 'next/cache';

/**
 * Create a new team. Requires MANAGER role.
 */
export async function createTeam(formData: FormData) {
  const user = await getCurrentUser();

  const parsed = createTeamSchema.safeParse({
    organizationId: formData.get('organizationId'),
    name: formData.get('name'),
    description: formData.get('description'),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await requireRole(parsed.data.organizationId, 'MANAGER');

  const team = await prisma.team.create({
    data: {
      organizationId: parsed.data.organizationId,
      name: parsed.data.name,
      description: parsed.data.description,
      members: {
        create: {
          userId: user.id,
          role: 'TEAM_ADMIN',
        },
      },
    },
  });

  await createAuditLog({
    organizationId: parsed.data.organizationId,
    actorId: user.id,
    action: 'team.created',
    resource: 'Team',
    resourceId: team.id,
    metadata: { name: team.name },
  });

  revalidatePath('/settings');
  return { data: team };
}

/**
 * Add a member to a team. Requires MANAGER role.
 */
export async function addTeamMember(formData: FormData) {
  const user = await getCurrentUser();

  const parsed = addTeamMemberSchema.safeParse({
    teamId: formData.get('teamId'),
    userId: formData.get('userId'),
    role: formData.get('role') || 'MEMBER',
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const team = await prisma.team.findUniqueOrThrow({
    where: { id: parsed.data.teamId },
  });

  await requireRole(team.organizationId, 'MANAGER');

  // Check the target user is a member of the org
  const targetMembership = await prisma.membership.findUnique({
    where: {
      organizationId_userId: {
        organizationId: team.organizationId,
        userId: parsed.data.userId,
      },
    },
  });

  if (!targetMembership) {
    return { error: { userId: ['User is not a member of this organization'] } };
  }

  const member = await prisma.teamMember.create({
    data: {
      teamId: parsed.data.teamId,
      userId: parsed.data.userId,
      role: parsed.data.role,
    },
  });

  await createAuditLog({
    organizationId: team.organizationId,
    actorId: user.id,
    action: 'team.member_added',
    resource: 'TeamMember',
    resourceId: member.id,
    metadata: { teamId: team.id, userId: parsed.data.userId },
  });

  revalidatePath('/settings');
  return { data: member };
}

/**
 * Remove a member from a team. Requires MANAGER role.
 */
export async function removeTeamMember(teamId: string, userId: string) {
  const user = await getCurrentUser();

  const team = await prisma.team.findUniqueOrThrow({
    where: { id: teamId },
  });

  await requireRole(team.organizationId, 'MANAGER');

  await prisma.teamMember.delete({
    where: {
      teamId_userId: {
        teamId,
        userId,
      },
    },
  });

  await createAuditLog({
    organizationId: team.organizationId,
    actorId: user.id,
    action: 'team.member_removed',
    resource: 'TeamMember',
    metadata: { teamId, userId },
  });

  revalidatePath('/settings');
  return { success: true };
}

/**
 * Get teams for an organization.
 */
export async function getOrganizationTeams(organizationId: string) {
  await requireRole(organizationId, 'VIEWER');

  return prisma.team.findMany({
    where: { organizationId },
    include: {
      _count: { select: { members: true } },
    },
    orderBy: { name: 'asc' },
  });
}
