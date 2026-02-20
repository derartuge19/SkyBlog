'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth';
import { writeFile } from 'fs/promises';
import { join } from 'path';

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
// The library will automatically use CLOUDINARY_URL if it's present in the environment
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dccusxayt',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

export async function createPost(formData: FormData) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            throw new Error('Unauthorized');
        }

        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const excerpt = formData.get('excerpt') as string;
        let imageUrl = formData.get('imageUrl') as string;
        const imageFile = formData.get('image') as File | null;
        const published = formData.get('published') === 'true';

        // Handle image upload with Cloudinary
        if (imageFile && imageFile.name && imageFile.size > 0) {
            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Upload to Cloudinary using a promise to handle the stream-like data
            const uploadResult = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: 'skyblog' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(buffer);
            }) as any;

            imageUrl = uploadResult.secure_url;
        }

        // Advanced Features
        const metaTitle = formData.get('metaTitle') as string;
        const metaDescription = formData.get('metaDescription') as string;
        const keywords = formData.get('keywords') as string;
        const ctaText = formData.get('ctaText') as string;
        const ctaLink = formData.get('ctaLink') as string;

        // Generate slug from title
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        const post = await (prisma.post as any).create({
            data: {
                title,
                slug,
                content,
                excerpt,
                imageUrl,
                published,
                metaTitle,
                metaDescription,
                keywords,
                ctaText,
                ctaLink,
                authorId: (user as any).id,
            },
        });

        revalidatePath('/admin/posts');
        revalidatePath('/admin/dashboard');
        revalidatePath('/');

        return post;
    } catch (err: any) {
        console.error('CREATE_POST_ERROR:', err);
        // Log to file for deep inspection
        try {
            const fs = require('fs');
            fs.writeFileSync('debug-create-error.log', JSON.stringify({
                message: err.message,
                stack: err.stack,
                formData: Array.from(formData.entries()).map(([k, v]) => ({
                    key: k,
                    type: typeof v,
                    value: (v instanceof File) ? `File: ${v.name} (${v.size} bytes)` : v
                }))
            }, null, 2));
        } catch (e) { }
        throw err;
    }
}

export async function updatePost(id: string, formData: FormData) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            throw new Error('Unauthorized');
        }

        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const excerpt = formData.get('excerpt') as string;
        let imageUrl = formData.get('imageUrl') as string;
        const imageFile = formData.get('image') as File | null;
        const published = formData.get('published') === 'true';

        // Handle image upload with Cloudinary
        if (imageFile && imageFile.name && imageFile.size > 0) {
            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Upload to Cloudinary
            const uploadResult = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: 'skyblog' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(buffer);
            }) as any;

            imageUrl = uploadResult.secure_url;
        }

        // Advanced Features
        const metaTitle = formData.get('metaTitle') as string;
        const metaDescription = formData.get('metaDescription') as string;
        const keywords = formData.get('keywords') as string;
        const ctaText = formData.get('ctaText') as string;
        const ctaLink = formData.get('ctaLink') as string;

        // Generate slug from title
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        const post = await (prisma.post as any).update({
            where: { id },
            data: {
                title,
                slug,
                content,
                excerpt,
                imageUrl,
                published,
                metaTitle,
                metaDescription,
                keywords,
                ctaText,
                ctaLink,
            },
        });

        revalidatePath('/admin/posts');
        revalidatePath('/admin/dashboard');
        revalidatePath('/');
        revalidatePath(`/blog/${slug}`);

        return post;
    } catch (err: any) {
        console.error('SERVER_ACTION_ERROR:', err);
        // Log to file for deep inspection
        try {
            const fs = require('fs');
            fs.writeFileSync('debug-update-error.log', JSON.stringify({
                message: err.message,
                stack: err.stack,
                id,
                formData: Array.from(formData.entries()).map(([k, v]) => ({
                    key: k,
                    type: typeof v,
                    value: (v instanceof File) ? `File: ${v.name} (${v.size} bytes)` : v
                }))
            }, null, 2));
        } catch (e) { }
        throw err;
    }
}

export async function deletePost(id: string) {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    await prisma.post.delete({
        where: { id },
    });

    revalidatePath('/admin/posts');
    revalidatePath('/admin/dashboard');
    revalidatePath('/');
}

export async function togglePublish(id: string) {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) throw new Error('Post not found');

    await prisma.post.update({
        where: { id },
        data: { published: !post.published },
    });

    revalidatePath('/admin/posts');
    revalidatePath('/admin/dashboard');
    revalidatePath('/');
    if (post.slug) revalidatePath(`/blog/${post.slug}`);
}


export async function incrementView(postId: string) {
    const view = await prisma.postView.create({
        data: { postId },
        include: { post: true }
    });

    // Create notification for post author every 10 views (to avoid noise)
    const viewCount = await prisma.postView.count({ where: { postId } });
    if (viewCount % 10 === 0) {
        try {
            await prisma.notification.create({
                data: {
                    type: 'VIEW',
                    message: `Signal Strength: "${view.post.title}" has reached ${viewCount} views.`,
                    userId: view.post.authorId,
                    postId: view.post.id,
                }
            });
        } catch (error) {
            console.error('Failed to create view notification:', error);
        }
    }

    return view;
}

export async function getPosts(options: {
    published?: boolean,
    category?: string,
    search?: string,
    limit?: number
} = {}) {
    const { published, category, search, limit } = options;

    const where: any = {};

    if (published !== undefined) {
        where.published = published;
    }

    if (category) {
        where.categories = {
            some: {
                slug: category
            }
        };
    }

    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } },
            { excerpt: { contains: search, mode: 'insensitive' } },
        ];
    }

    return await prisma.post.findMany({
        where,
        include: {
            author: {
                select: {
                    name: true,
                    email: true,
                    bio: true,
                } as any,
            },
            categories: true,
            _count: {
                select: {
                    comments: { where: { approved: true } },
                    views: true,
                    likes: true
                } as any
            }
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: limit,
    });
}

export async function getPostBySlug(slug: string) {
    const post = await prisma.post.findUnique({
        where: { slug },
        include: {
            author: {
                select: {
                    name: true,
                    email: true,
                    bio: true,
                },
            },
            categories: true,
            _count: {
                select: {
                    comments: { where: { approved: true } },
                    views: true,
                    likes: true
                }
            }
        } as any,
    });

    if (!post) return null;

    const user = await getCurrentUser();
    const liked = user ? await (prisma as any).like.findUnique({
        where: {
            postId_userId: {
                postId: post.id,
                userId: (user as any).id,
            },
        },
    }) : null;

    // Get related posts
    const relatedPosts = await prisma.post.findMany({
        where: {
            published: true,
            id: { not: post.id },
            categories: {
                some: {
                    id: { in: (post as any).categories?.map((c: any) => c.id) || [] }
                }
            }
        },
        take: 3,
        include: {
            categories: true,
            _count: {
                select: { views: true }
            }
        }
    });

    return {
        ...post,
        isLiked: !!liked,
        relatedPosts,
    };
}

export async function getPostById(id: string) {
    return await prisma.post.findUnique({
        where: { id },
        include: {
            author: {
                select: {
                    name: true,
                    email: true,
                    bio: true,
                },
            },
            categories: true,
            _count: {
                select: {
                    comments: { where: { approved: true } },
                    views: true,
                    likes: true
                }
            }
        } as any,
    });
}

export async function getAnalyticsData() {
    const user = await getCurrentUser();

    if (!user || (user as any).role !== 'SUPER_ADMIN') {
        // Authorization check logic could go here
    }

    const postsWithViews = await prisma.post.findMany({
        select: {
            id: true,
            title: true,
            createdAt: true,
            _count: {
                select: {
                    views: true,
                },
            },
        } as any,
        orderBy: {
            views: {
                _count: 'desc',
            },
        },
    });

    const totalViews = await prisma.postView.count();

    // Engagement stats
    const totalLikes = await (prisma as any).like.count();
    const totalComments = await prisma.comment.count({ where: { approved: true } });

    // Time periods
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    const sixtyDaysAgo = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000));

    // Views in last 30 days
    const viewsLast30Days = await prisma.postView.count({
        where: { createdAt: { gte: thirtyDaysAgo } }
    });

    // Views in 30-60 days ago
    const viewsPrev30Days = await prisma.postView.count({
        where: {
            createdAt: {
                gte: sixtyDaysAgo,
                lt: thirtyDaysAgo
            }
        }
    });

    // Detailed views trend for chart
    const viewsTrend = await prisma.postView.findMany({
        where: {
            createdAt: { gte: thirtyDaysAgo }
        },
        select: { createdAt: true }
    });

    return {
        posts: postsWithViews,
        totalViews,
        viewsLast30Days,
        viewsPrev30Days,
        totalEngagement: totalLikes + totalComments,
        viewsOverTime: viewsTrend
    };
}

export async function getCategories() {
    return await prisma.category.findMany({
        orderBy: {
            name: 'asc'
        }
    });
}
