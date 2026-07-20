import { auth } from '@/lib/auth';
import { prisma } from '@ai-bos/database';
import type { OrganizationRole } from '@ai-bos/shared';
import { redirect } from 'next/navigation';

/**
 * Get the current authenticated user or redirect to sign-in.
 * In local dev without a database, returns a mock user.
 */
export async function getCurrentUser() {
  // When no database is configured, return a mock dev user
  if (!process.env.DATABASE_URL) {
    return {
      id: 'dev-user-001',
      name: 'Dev User',
      email: 'dev@ai-bos.local',
      image: null,
    };
  }

  const session = await auth();
  if (!session?.user?.id) {
    redirect('/auth/sign-in');
  }
  return session.user as typeof session.user & { id: string };
}

/**
 * Get the current user's membership in an organization.
 * Returns null if the user is not a member.
 */
export async function getMembership(organizationId: string) {
  const user = await getCurrentUser();
  const membership = await prisma.membership.findUnique({
    where: {
      organizationId_userId: {
        organizationId,
        userId: user.id,
      },
    },
  });
  return membership;
}

/**
 * Assert the user has a membership with at least the given role.
 * Throws if unauthorized.
 */
export async function requireRole(organizationId: string, minimumRole: OrganizationRole) {
  const membership = await getMembership(organizationId);
  if (!membership) {
    throw new Error('Not a member of this organization');
  }

  const hierarchy: Record<string, number> = {
    OWNER: 5,
    ADMIN: 4,
    MANAGER: 3,
    MEMBER: 2,
    VIEWER: 1,
  };

  const userLevel = hierarchy[membership.role] ?? 0;
  const requiredLevel = hierarchy[minimumRole] ?? 0;

  if (userLevel < requiredLevel) {
    throw new Error('Insufficient permissions');
  }

  return membership;
}

/**
 * Create an audit log entry.
 */
export async function createAuditLog(params: {
  organizationId: string;
  workspaceId?: string;
  actorId: string;
  action: string;
  resource: string;
  resourceId?: string;
  metadata?: any;
}) {
  await prisma.auditLog.create({
    data: {
      organizationId: params.organizationId,
      workspaceId: params.workspaceId,
      actorId: params.actorId,
      action: params.action,
      resource: params.resource,
      resourceId: params.resourceId,
      metadata: params.metadata ?? undefined,
    },
  });
}
