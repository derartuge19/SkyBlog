
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Get all posts to attach views to
    const posts = await prisma.post.findMany({ select: { id: true } });
    if (posts.length === 0) {
        console.log('No posts found. Cannot seed views.');
        return;
    }

    console.log(`Found ${posts.length} posts. Seeding views...`);

    const viewsToCreate = [];
    const now = new Date();

    // Generate ~500 views distributed over the last 30 days
    for (let i = 0; i < 500; i++) {
        const daysAgo = Math.floor(Math.random() * 30);
        const date = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));

        // Add some jitter to time
        date.setHours(Math.floor(Math.random() * 24));
        date.setMinutes(Math.floor(Math.random() * 60));

        const randomPost = posts[Math.floor(Math.random() * posts.length)];

        viewsToCreate.push({
            postId: randomPost.id,
            createdAt: date,
            // Add dummy IP or user agent if needed by schema (usually not for simple views)
        });
    }

    // Use createMany for performance if supported, or loop
    // SQLite doesn't support createMany in older Prisma versions, but we are using Postgres or newer Prisma?
    // Let's use loop to be safe or valid createMany
    // Actually schema mostly likely allows it.

    // Batch insert
    try {
        await prisma.postView.createMany({
            data: viewsToCreate
        });
        console.log(`Successfully added ${viewsToCreate.length} views.`);
    } catch (e) {
        console.log('createMany failed, trying loop...');
        for (const view of viewsToCreate) {
            await prisma.postView.create({ data: view });
        }
        console.log(`Successfully added ${viewsToCreate.length} views via loop.`);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
