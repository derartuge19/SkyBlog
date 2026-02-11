import { getServerSession } from 'next-auth';

export async function getSession() {
    const { authOptions } = await import('./auth-config');
    return await getServerSession(authOptions);
}

export async function getCurrentUser() {
    const session = await getSession();
    return session?.user;
}
