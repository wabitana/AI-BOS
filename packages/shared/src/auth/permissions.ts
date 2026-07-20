import type { OrganizationRole } from '../validation/schemas';

/**
 * Permission definitions for the RBAC system.
 * Maps each role to an ordered set of allowed actions.
 *
 * Roles are hierarchical: OWNER > ADMIN > MANAGER > MEMBER > VIEWER
 */
const ROLE_PERMISSIONS: Record<OrganizationRole, readonly string[]> = {
  OWNER: [
    'org:delete',
    'org:transfer',
    'org:billing',
    'org:manage',
    'org:settings',
    'member:manage',
    'member:invite',
    'team:manage',
    'workspace:manage',
    'workspace:create',
    'workspace:delete',
    'workflow:manage',
    'agent:manage',
    'tool:manage',
    'audit:read',
    'content:manage',
    'content:read',
  ],
  ADMIN: [
    'org:manage',
    'org:settings',
    'member:manage',
    'member:invite',
    'team:manage',
    'workspace:manage',
    'workspace:create',
    'workspace:delete',
    'workflow:manage',
    'agent:manage',
    'tool:manage',
    'audit:read',
    'content:manage',
    'content:read',
  ],
  MANAGER: [
    'member:invite',
    'team:manage',
    'workspace:manage',
    'workspace:create',
    'workflow:manage',
    'agent:manage',
    'tool:manage',
    'audit:read',
    'content:manage',
    'content:read',
  ],
  MEMBER: [
    'workflow:manage',
    'agent:manage',
    'tool:manage',
    'content:manage',
    'content:read',
  ],
  VIEWER: [
    'content:read',
  ],
} as const;

/**
 * Check if a role has a specific permission.
 */
export function hasPermission(role: OrganizationRole, permission: string): boolean {
  const perms = ROLE_PERMISSIONS[role];
  return perms.includes(permission);
}

/**
 * Get all permissions for a role.
 */
export function getPermissions(role: OrganizationRole): readonly string[] {
  return ROLE_PERMISSIONS[role];
}

/**
 * Check if roleA is at least as privileged as roleB.
 */
const ROLE_HIERARCHY: Record<OrganizationRole, number> = {
  OWNER: 5,
  ADMIN: 4,
  MANAGER: 3,
  MEMBER: 2,
  VIEWER: 1,
};

export function isRoleAtLeast(role: OrganizationRole, minimumRole: OrganizationRole): boolean {
  return ROLE_HIERARCHY[role] >= ROLE_HIERARCHY[minimumRole];
}
