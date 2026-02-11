'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function toggleLike(postId: string) {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error('You must be logged in to like a post');
    }

    const userId = (user as any).id;

    // Check if like exists
    const existingLike = await prisma.like.findUnique({
        where: {
            postId_userId: {
                postId,
                userId,
            },
        },
    });

    const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { slug: true, title: true, authorId: true }
    });

    if (existingLike) {
        // Unlike
        await prisma.like.delete({
            where: {
                id: existingLike.id,
            },
        });
    } else {
        // Like
        await prisma.like.create({
            data: {
                postId,
                userId,
            },
        });

        // Create notification for post author
        if (post && post.authorId !== userId) {
            try {
                await prisma.notification.create({
                    data: {
                        type: 'LIKE',
                        message: `${user.name || user.email} liked your post "${post.title}"`,
                        userId: post.authorId,
                        postId: postId,
                    }
                });
            } catch (error) {
                console.error('Failed to create notification:', error);
            }
        }
    }

    if (post?.slug) {
        revalidatePath(`/blog/${post.slug}`);
    }
    revalidatePath('/');
}

export async function getLikeStatus(postId: string) {
    const user = await getCurrentUser();

    if (!user) return { liked: false, count: 0 };

    const userId = (user as any).id;

    const [like, count] = await Promise.all([
        prisma.like.findUnique({
            where: {
                postId_userId: {
                    postId,
                    userId,
                },
            },
        }),
        prisma.like.count({
            where: { postId },
        }),
    ]);

    return {
        liked: !!like,
        count,
    };
}
