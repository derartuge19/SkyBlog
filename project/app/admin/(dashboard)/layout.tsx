import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import AdminSidebar from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/admin/login?callbackUrl=/admin/dashboard');
    }

    if ((user as any).role !== 'ADMIN' && (user as any).role !== 'SUPER_ADMIN') {
        redirect('/');
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <AdminSidebar
                userEmail={user.email || ''}
                userName={(user as any).name}
            />
            <div className="flex-1 flex flex-col min-h-screen transition-all duration-300">
                <AdminHeader />
                <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
