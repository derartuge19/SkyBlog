'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

export async function updateProfile(formData: FormData) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const name = formData.get('name') as string;
    const bio = formData.get('bio') as string;

    await (prisma.user as any).update({
        where: { id: (user as any).id },
        data: { name, bio }
    });

    revalidatePath('/admin/settings');
    revalidatePath('/admin');
}

export async function changePassword(formData: FormData) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;

    // Get fresh user with password
    const dbUser = await prisma.user.findUnique({
        where: { id: (user as any).id }
    });

    if (!dbUser) throw new Error('User not found');

    const isMatch = await bcrypt.compare(currentPassword, dbUser.password);
    if (!isMatch) throw new Error('Current password does not match');

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { id: dbUser.id },
        data: { password: hashedPassword }
    });

    return { success: true };
}

export async function getUsers() {
    const user = await getCurrentUser();
    if (!user || (user as any).role !== 'SUPER_ADMIN') {
        throw new Error('Unauthorized. Super Admin only.');
    }

    return await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true
        },
        orderBy: { createdAt: 'desc' }
    });
}

export async function updateUserRole(userId: string, role: string) {
    const user = await getCurrentUser();
    if (!user || (user as any).role !== 'SUPER_ADMIN') {
        throw new Error('Unauthorized. Super Admin only.');
    }

    await (prisma.user as any).update({
        where: { id: userId },
        data: { role }
    });

    revalidatePath('/admin/settings');
}

export async function updateGlobalSettings(formData: FormData) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const siteName = formData.get('siteName') as string;
    const siteDescription = formData.get('siteDescription') as string;
    const notificationEmail = formData.get('notificationEmail') as string;
    const enableNotifications = formData.get('enableNotifications') === 'true';

    await prisma.globalSettings.upsert({
        where: { id: 'global' },
        update: {
            siteName,
            siteDescription,
            notificationEmail,
            enableNotifications
        },
        create: {
            siteName,
            siteDescription,
            notificationEmail,
            enableNotifications
        }
    });

    revalidatePath('/admin/settings');
}

export async function getGlobalSettings() {
    return await prisma.globalSettings.findUnique({
        where: { id: 'global' }
    });
}

export async function getNotifications() {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    return await prisma.notification.findMany({
        where: { userId: (user as any).id },
        orderBy: { createdAt: 'desc' },
        take: 50
    });
}

export async function markNotificationAsRead(notificationId: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    await prisma.notification.update({
        where: { id: notificationId },
        data: { read: true }
    });

    revalidatePath('/admin/notifications');
}

export async function getUnreadNotificationsCount() {
    const user = await getCurrentUser();
    if (!user) return 0;

    return await prisma.notification.count({
        where: {
            userId: (user as any).id,
            read: false
        }
    });
}

export async function getRecentNotifications(limit = 5) {
    const user = await getCurrentUser();
    if (!user) return [];

    return await prisma.notification.findMany({
        where: { userId: (user as any).id },
        orderBy: { createdAt: 'desc' },
        take: limit
    });
}
