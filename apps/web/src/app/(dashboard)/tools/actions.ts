'use server';

import { prisma } from '@ai-bos/database';
import { getCurrentUser } from '@/lib/auth-helpers';

/**
 * Get tool usage logs for the current user's organization.
 */
export async function getToolUsageLogs(options?: { limit?: number; offset?: number }) {
  if (!process.env.DATABASE_URL) return { logs: [], total: 0 };

  const user = await getCurrentUser();

  const membership = await prisma.membership.findFirst({
    where: { userId: user.id },
  });

  if (!membership) return { logs: [], total: 0 };

  const limit = options?.limit ?? 50;
  const offset = options?.offset ?? 0;

  const [logs, total] = await Promise.all([
    prisma.toolUsageLog.findMany({
      where: { organizationId: membership.organizationId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    }),
    prisma.toolUsageLog.count({
      where: { organizationId: membership.organizationId },
    }),
  ]);

  return { logs, total };
}

/**
 * Get aggregated tool usage stats.
 */
export async function getToolUsageStats() {
  if (!process.env.DATABASE_URL) {
    return { totalCalls: 0, totalErrors: 0, avgLatency: 0, totalCost: 0 };
  }

  const user = await getCurrentUser();

  const membership = await prisma.membership.findFirst({
    where: { userId: user.id },
  });

  if (!membership) {
    return { totalCalls: 0, totalErrors: 0, avgLatency: 0, totalCost: 0 };
  }

  const orgId = membership.organizationId;

  const [totalCalls, totalErrors, aggregation] = await Promise.all([
    prisma.toolUsageLog.count({ where: { organizationId: orgId } }),
    prisma.toolUsageLog.count({ where: { organizationId: orgId, status: 'ERROR' } }),
    prisma.toolUsageLog.aggregate({
      where: { organizationId: orgId },
      _avg: { latencyMs: true },
      _sum: { cost: true },
    }),
  ]);

  return {
    totalCalls,
    totalErrors,
    avgLatency: Math.round(aggregation._avg.latencyMs ?? 0),
    totalCost: aggregation._sum.cost ?? 0,
  };
}
