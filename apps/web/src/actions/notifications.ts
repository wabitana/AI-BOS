'use server';

import { prisma } from '@ai-bos/database';
import { getCurrentUser, requireRole } from '@/lib/auth-helpers';
import { revalidatePath } from 'next/cache';

/**
 * Mark a notification as read.
 */
export async function markNotificationRead(notificationId: string) {
  const user = await getCurrentUser();

  await prisma.notification.updateMany({
    where: { id: notificationId, userId: user.id },
    data: { read: true },
  });

  revalidatePath('/');
  return { success: true };
}

/**
 * Mark all notifications as read for the current user.
 */
export async function markAllNotificationsRead() {
  const user = await getCurrentUser();

  await prisma.notification.updateMany({
    where: { userId: user.id, read: false },
    data: { read: true },
  });

  revalidatePath('/');
  return { success: true };
}

/**
 * Get notifications for the current user.
 */
export async function getUserNotifications(limit = 20) {
  const user = await getCurrentUser();

  return prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

/**
 * Get unread notification count.
 */
export async function getUnreadNotificationCount() {
  const user = await getCurrentUser();

  return prisma.notification.count({
    where: { userId: user.id, read: false },
  });
}

/**
 * Get audit logs for an organization.
 */
export async function getAuditLogs(organizationId: string, page = 1, pageSize = 25) {
  await requireRole(organizationId, 'ADMIN');

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where: { organizationId },
      include: {
        actor: { select: { id: true, name: true, email: true, image: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: pageSize,
      skip: (page - 1) * pageSize,
    }),
    prisma.auditLog.count({ where: { organizationId } }),
  ]);

  return {
    logs,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}
