'use server';

import { prisma } from '@ai-bos/database';
import { getCurrentUser } from '@/lib/auth-helpers';
import { encrypt } from '@ai-bos/tools';
import { revalidatePath } from 'next/cache';

// --- Server Actions ---

// --- Server Actions ---

interface SaveProviderKeyInput {
  providerName: string;
  apiKey: string;
}

/**
 * Save (or update) an API key for a provider in the user's organization.
 */
export async function saveProviderKey(input: SaveProviderKeyInput) {
  if (!process.env.DATABASE_URL) {
    return { error: 'No database configured for local development.' };
  }

  const user = await getCurrentUser();

  const membership = await prisma.membership.findFirst({
    where: { userId: user.id },
    include: { organization: true },
  });

  if (!membership) {
    return { error: 'No organization found.' };
  }

  const encryptedKey = encrypt(input.apiKey);

  await prisma.providerConnection.upsert({
    where: {
      organizationId_workspaceId_providerName: {
        organizationId: membership.organizationId,
        workspaceId: null as unknown as string, // org-level
        providerName: input.providerName,
      },
    },
    update: {
      encryptedKey,
      status: 'ACTIVE',
    },
    create: {
      organizationId: membership.organizationId,
      providerName: input.providerName,
      encryptedKey,
      status: 'ACTIVE',
    },
  });

  revalidatePath('/settings/providers');
  return { success: true };
}

/**
 * Delete a provider connection by ID.
 */
export async function deleteProviderKey(id: string) {
  if (!process.env.DATABASE_URL) {
    return { error: 'No database configured for local development.' };
  }

  const user = await getCurrentUser();

  // Verify the user owns this connection via membership
  const connection = await prisma.providerConnection.findUnique({
    where: { id },
    include: { organization: { include: { memberships: true } } },
  });

  if (!connection) {
    return { error: 'Connection not found.' };
  }

  const isMember = connection.organization.memberships.some(
    (m) => m.userId === user.id && ['OWNER', 'ADMIN'].includes(m.role)
  );

  if (!isMember) {
    return { error: 'Insufficient permissions.' };
  }

  await prisma.providerConnection.delete({ where: { id } });

  revalidatePath('/settings/providers');
  return { success: true };
}

/**
 * Fetch all provider connections for the current user's organization.
 * Returns summaries only (no decrypted keys).
 */
export async function getProviderConnections() {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  const user = await getCurrentUser();

  const membership = await prisma.membership.findFirst({
    where: { userId: user.id },
  });

  if (!membership) {
    return [];
  }

  const connections = await prisma.providerConnection.findMany({
    where: { organizationId: membership.organizationId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      providerName: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return connections;
}
