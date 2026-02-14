const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('Testing guest comment creation...');

    // 1. Get a post to comment on
    const post = await prisma.post.findFirst();
    if (!post) {
        console.error('No posts found. Cannot test comment.');
        return;
    }
    console.log(`Found post: ${post.title} (${post.id})`);

    // 2. Create a guest comment
    const guestName = 'Test Guest JS';
    const guestEmail = 'guest_js@example.com';
    const content = 'This is a test guest comment from the JS verification script.';

    try {
        const comment = await prisma.comment.create({
            data: {
                content,
                postId: post.id,
                authorName: guestName,
                authorEmail: guestEmail,
                // userId is optional now
            },
        });
        console.log('Successfully created guest comment:', comment);
    } catch (error) {
        console.error('Error creating guest comment:', error);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
