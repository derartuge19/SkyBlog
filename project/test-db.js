const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Fetching posts with full query...');
        const posts = await prisma.post.findMany({
            where: { published: true },
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
            }
        });
        console.log(`Success! Found ${posts.length} published posts.`);
    } catch (error) {
        console.error('CRITICAL ERROR in getPosts query:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
