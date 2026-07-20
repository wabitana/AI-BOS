import { z } from 'zod';

// ─── Organization Schemas ────────────────────────────────
export const createOrganizationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(50)
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
});

export const updateOrganizationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(100).optional(),
  slug: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  timezone: z.string().optional(),
});

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;

// ─── Workspace Schemas ───────────────────────────────────
export const createWorkspaceSchema = z.object({
  organizationId: z.string().uuid(),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  description: z.string().max(500).optional(),
});

export const updateWorkspaceSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(100).optional(),
  description: z.string().max(500).optional(),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;

// ─── Team Schemas ────────────────────────────────────────
export const createTeamSchema = z.object({
  organizationId: z.string().uuid(),
  name: z.string().min(2, 'Team name must be at least 2 characters').max(100),
  description: z.string().max(500).optional(),
});

export const updateTeamSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(100).optional(),
  description: z.string().max(500).optional(),
});

export const addTeamMemberSchema = z.object({
  teamId: z.string().uuid(),
  userId: z.string().uuid(),
  role: z.enum(['TEAM_ADMIN', 'MEMBER']).default('MEMBER'),
});

export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type UpdateTeamInput = z.infer<typeof updateTeamSchema>;
export type AddTeamMemberInput = z.infer<typeof addTeamMemberSchema>;

// ─── Membership / Invite Schemas ─────────────────────────
export const ORGANIZATION_ROLES = ['OWNER', 'ADMIN', 'MANAGER', 'MEMBER', 'VIEWER'] as const;
export type OrganizationRole = (typeof ORGANIZATION_ROLES)[number];

export const inviteMemberSchema = z.object({
  organizationId: z.string().uuid(),
  email: z.string().email('Invalid email address'),
  role: z.enum(ORGANIZATION_ROLES).default('MEMBER'),
});

export const updateMemberRoleSchema = z.object({
  membershipId: z.string().uuid(),
  role: z.enum(ORGANIZATION_ROLES),
});

export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;

// ─── Settings Schemas ────────────────────────────────────
export const updateOrgSettingsSchema = z.object({
  organizationId: z.string().uuid(),
  billingEmail: z.string().email().optional(),
  branding: z.record(z.unknown()).optional(),
  features: z.record(z.boolean()).optional(),
});

export const updateWorkspaceSettingsSchema = z.object({
  workspaceId: z.string().uuid(),
  defaults: z.record(z.unknown()).optional(),
  integrations: z.record(z.unknown()).optional(),
});

export type UpdateOrgSettingsInput = z.infer<typeof updateOrgSettingsSchema>;
export type UpdateWorkspaceSettingsInput = z.infer<typeof updateWorkspaceSettingsSchema>;
