import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export default async function AdminRootPage() {
    const user = await getCurrentUser();

    if (user && ((user as any).role === 'ADMIN' || (user as any).role === 'SUPER_ADMIN')) {
        redirect('/admin/dashboard');
    }

    redirect('/admin/login');
}
