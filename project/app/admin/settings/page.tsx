import { getCurrentUser } from '@/lib/auth';
import { getGlobalSettings, getUsers } from '@/app/actions/admin';
import SettingsTabs from './SettingsTabs';
import { redirect } from 'next/navigation';

export default async function SettingsPage() {
    const user = await getCurrentUser();

    if (!user) redirect('/skyadmin/login');

    const [settings, allUsers] = await Promise.all([
        getGlobalSettings(),
        (user as any).role === 'SUPER_ADMIN' ? getUsers() : Promise.resolve([])
    ]);

    return (
        <div className="max-w-7xl mx-auto space-y-10 py-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">System Matrix</h1>
                    <p className="text-slate-400 mt-2 font-medium tracking-wide">Orchestrate platform parameters and structural integrity.</p>
                </div>
                <div className="hidden md:flex items-center gap-2 px-6 py-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Core Systems Operational</span>
                </div>
            </div>

            <div className="px-4">
                <SettingsTabs user={user} settings={settings} allUsers={allUsers} />
            </div>
        </div>
    );
}
