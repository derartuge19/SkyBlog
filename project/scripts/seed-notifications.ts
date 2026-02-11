
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // 1. Get the admin user (we know credentials were demo admin)
    const adminEmail = 'admin@skyblog.com';
    const user = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (!user) {
        console.log(`User ${adminEmail} not found. Cannot seed notifications.`);
        return;
    }

    console.log(`Found user: ${user.email} (${user.id})`);

    // 2. Check current unread count
    const count = await prisma.notification.count({
        where: {
            userId: user.id,
            read: false
        }
    });

    console.log(`Current unread notifications: ${count}`);

    // 3. If count is 0, create some unread notifications
    if (count === 0) {
        console.log('Seeding unread notifications...');
        await prisma.notification.create({
            data: {
                userId: user.id,
                type: 'INFO',
                message: 'Welcome to your new dashboard!',
                read: false,
                createdAt: new Date()
            }
        });
        await prisma.notification.create({
            data: {
                userId: user.id,
                type: 'ALERT',
                message: 'System update scheduled for tonight.',
                read: false,
                createdAt: new Date(Date.now() - 1000 * 60 * 60) // 1 hour ago
            }
        });
        console.log('Created 2 unread notifications.');
    } else {
        console.log('Unread notifications already exist.');
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });

export { };
