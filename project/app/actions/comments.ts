'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function createComment(postId: string, content: string, authorName?: string, authorEmail?: string) {
    const user = await getCurrentUser();

    if (!user && (!authorName || !authorEmail)) {
        throw new Error('You must be signed in or provide name and email to comment');
    }

    const comment = await prisma.comment.create({
        data: {
            content,
            postId,
            userId: user ? (user as any).id : undefined,
            authorName: user ? undefined : authorName,
            authorEmail: user ? undefined : authorEmail,
            approved: false, // Always false by default for moderation
        },
        include: {
            post: true,
            user: true,
        }
    });

    // Create notification for post author
    try {
        await prisma.notification.create({
            data: {
                type: 'COMMENT',
                message: `New comment on "${comment.post.title}" by ${user ? (comment.user?.name || comment.user?.email) : authorName}`,
                userId: comment.post.authorId,
                postId: comment.post.id,
            }
        });
    } catch (error) {
        console.error('Failed to create notification:', error);
    }

    const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { slug: true }
    });

    if (post?.slug) {
        revalidatePath(`/blog/${post.slug}`);
    }

    return comment;
}

export async function getPostComments(postId: string) {
    return await prisma.comment.findMany({
        where: {
            postId,
            approved: true,
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
}

export async function getPendingComments() {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    return await prisma.comment.findMany({
        where: {
            approved: false,
        },
        include: {
            post: true,
            user: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
}

export async function approveComment(id: string) {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    const comment = await prisma.comment.update({
        where: { id },
        data: { approved: true },
        include: { post: true }
    });

    revalidatePath('/admin/comments');
    revalidatePath(`/blog/${comment.post.slug}`);
}

export async function deleteComment(id: string) {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    const comment = await prisma.comment.delete({
        where: { id },
        include: { post: true }
    });

    revalidatePath('/admin/comments');
    revalidatePath(`/blog/${comment.post.slug}`);
}

export async function getAllCommentsForAdmin() {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    return await prisma.comment.findMany({
        include: {
            post: true,
            user: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
}
