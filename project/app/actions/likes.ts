'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

export async function toggleLike(postId: string) {
    try {
        const user = await getCurrentUser();
        const headerList = headers();
        // Get IP address for anonymous tracking
        const ipAddress = headerList.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

        const userId = (user as any)?.id;

        // Validate post exists
        const post = await prisma.post.findUnique({
            where: { id: postId },
            select: { slug: true, title: true, authorId: true }
        });

        if (!post) {
            throw new Error('Post not found');
        }

        // Check if like exists - try by userId first, then ipAddress if not logged in
        let existingLike;
        if (userId) {
            existingLike = await prisma.like.findFirst({
                where: {
                    postId,
                    userId,
                },
            });
        } else {
            existingLike = await prisma.like.findFirst({
                where: {
                    postId,
                    ipAddress,
                    // @ts-ignore
                    userId: { equals: null }, // Explicit null check for strict types
                },
            });
        }

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
                    userId: userId || null,
                    // @ts-ignore - ipAddress exists in schema and DB, but client types may be lagging
                    ipAddress: userId ? null : ipAddress,
                },
            });

            // Create notification for post author (only if logged in or if we want to notify for anon)
            if (post.authorId && post.authorId !== userId) {
                try {
                    const identifier = user?.name || user?.email || 'A visitor';
                    await prisma.notification.create({
                        data: {
                            type: 'LIKE',
                            message: `${identifier} liked your post "${post.title}"`,
                            userId: post.authorId,
                            postId: postId,
                        }
                    });
                } catch (error) {
                    console.error('Failed to create notification:', error);
                }
            }
        }

        if (post.slug) {
            revalidatePath(`/blog/${post.slug}`);
        }
        revalidatePath('/');
    } catch (error: any) {
        console.error('TOGGLE_LIKE_ERROR:', error);
        throw new Error(error.message || 'Failed to toggle like');
    }
}

export async function getLikeStatus(postId: string) {
    try {
        const user = await getCurrentUser();
        const headerList = headers();
        const ipAddress = headerList.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

        const userId = (user as any)?.id;

        let like;
        if (userId) {
            like = await prisma.like.findFirst({
                where: {
                    postId,
                    userId,
                },
            });
        } else {
            like = await prisma.like.findFirst({
                where: {
                    postId,
                    ipAddress,
                    // @ts-ignore
                    userId: null,
                },
            });
        }

        const count = await prisma.like.count({
            where: { postId },
        });

        return {
            liked: !!like,
            count,
        };
    } catch (error) {
        console.error('GET_LIKE_STATUS_ERROR:', error);
        return { liked: false, count: 0 };
    }
}
