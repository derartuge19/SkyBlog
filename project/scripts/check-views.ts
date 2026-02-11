
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const totalViews = await prisma.postView.count();
    console.log(`Total PostViews: ${totalViews}`);

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));

    const recentViews = await prisma.postView.count({
        where: { createdAt: { gte: thirtyDaysAgo } }
    });
    console.log(`Views in last 30 days: ${recentViews}`);

    if (recentViews > 0) {
        const sample = await prisma.postView.findFirst({
            where: { createdAt: { gte: thirtyDaysAgo } },
            select: { createdAt: true }
        });
        console.log(`Sample recent view date: ${sample?.createdAt}`);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });

export { };
