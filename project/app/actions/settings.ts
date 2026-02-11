'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth';

export async function getGlobalSettings() {
    let settings = await prisma.globalSettings.findUnique({
        where: { id: 'global' },
    });

    if (!settings) {
        // Create default settings if they don't exist
        settings = await prisma.globalSettings.create({
            data: {
                id: 'global',
                siteName: 'SkyBlog',
                siteDescription: 'Insights, stories, and updates from our team.',
            },
        });
    }

    return settings;
}

export async function updateGlobalSettings(formData: FormData) {
    const user = await getCurrentUser();

    if (!user || (user as any).role !== 'ADMIN') {
        throw new Error('Unauthorized');
    }

    const siteName = formData.get('siteName') as string;
    const siteDescription = formData.get('siteDescription') as string;
    const notificationEmail = formData.get('notificationEmail') as string;
    const enableNotifications = formData.get('enableNotifications') === 'true';

    const settings = await prisma.globalSettings.upsert({
        where: { id: 'global' },
        update: {
            siteName,
            siteDescription,
            notificationEmail,
            enableNotifications,
        },
        create: {
            id: 'global',
            siteName,
            siteDescription,
            notificationEmail,
            enableNotifications,
        },
    });

    revalidatePath('/');
    revalidatePath('/admin/settings');

    return settings;
}
