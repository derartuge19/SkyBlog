'use client';

import { useState } from 'react';
import { User as UserIcon, Shield, Bell, Settings as SettingsIcon, Save, Key, Users as UsersIcon } from 'lucide-react';
import { updateProfile, changePassword, updateGlobalSettings, updateUserRole } from '@/app/actions/admin';
import { toast } from 'sonner';

interface SettingsTabsProps {
    user: any;
    settings: any;
    allUsers?: any[];
}

export default function SettingsTabs({ user, settings, allUsers }: SettingsTabsProps) {
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);

    const tabs = [
        { id: 'profile', label: 'Profile Settings', icon: UserIcon },
        { id: 'security', label: 'Security & Access', icon: Shield },
        { id: 'global', label: 'Global Config', icon: SettingsIcon },
    ];

    if (user.role === 'SUPER_ADMIN') {
        tabs.push({ id: 'users', label: 'User Management', icon: UsersIcon });
    }

    async function handleAction(e: React.FormEvent<HTMLFormElement>, action: Function) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);

        try {
            await action(formData);
            toast.success('Settings synchronized successfully');
        } catch (error: any) {
            toast.error(error.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-3 space-y-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id
                            ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20 active:scale-95'
                            : 'text-slate-400 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-sm'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="lg:col-span-9">
                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 md:p-16 shadow-2xl shadow-slate-200/50 min-h-[600px]">

                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Architect Profile</h2>
                                <p className="text-slate-500 text-sm font-medium">Define your identity and technical expertise.</p>
                            </div>

                            <form onSubmit={(e) => handleAction(e, updateProfile)} className="space-y-8">
                                <div className="space-y-8">
                                    <div className="flex flex-col gap-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Public Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            defaultValue={user.name || ''}
                                            className="bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl px-8 py-5 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 outline-none transition-all font-black text-lg"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Technical Bio (Trust Factor)</label>
                                        <textarea
                                            name="bio"
                                            rows={5}
                                            defaultValue={user.bio || ''}
                                            placeholder="Introduce yourself to the readers..."
                                            className="bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl px-8 py-5 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 outline-none transition-all font-medium resize-none shadow-inner leading-relaxed"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center gap-3 px-12 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-slate-900/10"
                                >
                                    <Save className="w-4 h-4" />
                                    Save Profile
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Access Control</h2>
                                <p className="text-slate-500 text-sm font-medium">Manage your credentials and encryption barriers.</p>
                            </div>

                            <form onSubmit={(e) => handleAction(e, changePassword)} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="flex flex-col gap-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Password</label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            required
                                            className="bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl px-8 py-5 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">New Secret Key</label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            required
                                            className="bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl px-8 py-5 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:shadow-2xl hover:shadow-indigo-500/30 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    <Key className="w-4 h-4" />
                                    Rotate Password
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Global Settings Tab */}
                    {activeTab === 'global' && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Global Parameters</h2>
                                <p className="text-slate-500 text-sm font-medium">Configure site-wide meta-data and alerts.</p>
                            </div>

                            <form onSubmit={(e) => handleAction(e, updateGlobalSettings)} className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="flex flex-col gap-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Platform Title</label>
                                        <input
                                            type="text"
                                            name="siteName"
                                            defaultValue={settings?.siteName || ''}
                                            className="bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl px-8 py-5 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 outline-none transition-all font-black"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Alert Endpoint (Email)</label>
                                        <input
                                            type="email"
                                            name="notificationEmail"
                                            defaultValue={settings?.notificationEmail || ''}
                                            className="bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl px-8 py-5 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="md:col-span-2 flex flex-col gap-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Platform Vision (Meta Description)</label>
                                        <textarea
                                            name="siteDescription"
                                            rows={4}
                                            defaultValue={settings?.siteDescription || ''}
                                            className="bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl px-8 py-5 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 outline-none transition-all font-medium resize-none shadow-inner leading-relaxed"
                                        />
                                    </div>
                                    <div className="md:col-span-2 p-8 rounded-[2rem] bg-blue-50 border border-blue-100 flex items-center justify-between">
                                        <div>
                                            <h4 className="text-base font-black text-slate-900 uppercase tracking-wider mb-1">Signal Relay</h4>
                                            <p className="text-xs text-blue-600 font-medium">Broadcast alerts for comments & likes.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="enableNotifications"
                                                value="true"
                                                defaultChecked={settings?.enableNotifications}
                                                className="sr-only peer"
                                            />
                                            <div className="w-16 h-8 bg-slate-200 rounded-full peer peer-checked:bg-blue-600 transition-all"></div>
                                            <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full peer-checked:translate-x-8 transition-transform shadow-sm"></div>
                                        </label>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-12 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/30 active:scale-95"
                                >
                                    Synchronize Settings
                                </button>
                            </form>
                        </div>
                    )}

                    {/* User Management Tab */}
                    {activeTab === 'users' && allUsers && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Hierarchy Management</h2>
                                <p className="text-slate-500 text-sm font-medium">Oversee admin roles and access tiers.</p>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-50">
                                            <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Identity</th>
                                            <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-6">Role Tier</th>
                                            <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {allUsers.map((u) => (
                                            <tr key={u.id} className="group transition-colors hover:bg-slate-50/50">
                                                <td className="py-8">
                                                    <div className="flex flex-col">
                                                        <span className="font-black text-slate-900 text-lg">{u.name || 'Anonymous'}</span>
                                                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{u.email}</span>
                                                    </div>
                                                </td>
                                                <td className="py-8 px-6">
                                                    <div className={`inline-flex px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${u.role === 'SUPER_ADMIN' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                                                        }`}>
                                                        {u.role.replace('_', ' ')}
                                                    </div>
                                                </td>
                                                <td className="py-8 text-right">
                                                    {u.id !== user.id && (
                                                        <select
                                                            onChange={async (e) => {
                                                                try {
                                                                    await updateUserRole(u.id, e.target.value);
                                                                    toast.success('User hierarchy updated');
                                                                } catch (err: any) {
                                                                    toast.error(err.message || 'Failed to update user');
                                                                }
                                                            }}
                                                            className="bg-slate-50 text-[10px] font-black uppercase text-slate-600 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
                                                            defaultValue={u.role}
                                                        >
                                                            <option value="ADMIN">ADMIN</option>
                                                            <option value="SUPER_ADMIN">SUPER ADMIN</option>
                                                        </select>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
