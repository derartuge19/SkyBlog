import { getPosts } from '@/app/actions/posts';
import { getGlobalSettings, getNotifications } from '@/app/actions/admin';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Bell, Heart, MessageSquare, Eye } from 'lucide-react';

export default async function AdminDashboard() {
    const [totalPosts, publishedPosts, draftPosts, notifications] = await Promise.all([
        prisma.post.count(),
        prisma.post.count({ where: { published: true } }),
        prisma.post.count({ where: { published: false } }),
        getNotifications()
    ]);

    const recentPosts = await getPosts();

    const stats = [
        {
            label: 'Total Posts',
            value: totalPosts,
            gradient: 'from-blue-600 to-cyan-500',
            shadow: 'shadow-blue-500/20',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
            ),
        },
        {
            label: 'Published',
            value: publishedPosts,
            gradient: 'from-emerald-600 to-green-500',
            shadow: 'shadow-emerald-500/20',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            label: 'Drafts',
            value: draftPosts,
            gradient: 'from-amber-600 to-orange-500',
            shadow: 'shadow-amber-500/20',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            ),
        },
    ];

    return (
        <div className="space-y-10 animate-fade-in-up pb-20">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Dashboard</h1>
                    <p className="text-slate-500 mt-2 font-medium">Welcome back! Here's an overview of your platform's pulse.</p>
                </div>
                <Link
                    href="/admin/posts/create"
                    className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                    </svg>
                    New Post
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className={`relative overflow-hidden bg-white border border-slate-100 rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 transition-all hover:-translate-y-1 hover:shadow-2xl`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                                <p className="text-5xl font-black text-slate-900 mt-3 tracking-tighter">{stat.value}</p>
                            </div>
                            <div className={`p-4 bg-gradient-to-br ${stat.gradient} rounded-[1.5rem] text-white shadow-lg`}>
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Posts & Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Recent Posts */}
                <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/60">
                    <div className="px-10 py-8 flex items-center justify-between border-b border-slate-50">
                        <h2 className="text-lg font-black text-slate-900 uppercase tracking-widest">Recent discourse</h2>
                        <Link
                            href="/admin/posts"
                            className="text-[10px] font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-[0.2em]"
                        >
                            View All →
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {recentPosts.length === 0 ? (
                            <div className="px-10 py-16 text-center text-slate-400">
                                <p className="text-xs font-black uppercase tracking-widest">No posts created yet</p>
                            </div>
                        ) : (
                            recentPosts.slice(0, 5).map((post: any) => (
                                <div key={post.id} className="px-10 py-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                    <div className="flex-1 min-w-0 mr-4">
                                        <Link href={`/admin/posts/${post.id}/edit`} className="text-base font-black text-slate-900 hover:text-blue-600 transition-colors truncate block">
                                            {post.title}
                                        </Link>
                                        <p className="text-[10px] text-slate-400 mt-1 uppercase font-black tracking-widest">
                                            {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <span className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-full ${post.published ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                                        {post.published ? 'Live' : 'Draft'}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Notifications Preview */}
                <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/60">
                    <div className="px-10 py-8 flex items-center justify-between border-b border-slate-50">
                        <h2 className="text-lg font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                            <Bell className="w-5 h-5 text-blue-600" />
                            Recent Signals
                        </h2>
                        <Link
                            href="/admin/notifications"
                            className="text-[10px] font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-[0.2em]"
                        >
                            Center →
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {notifications.length === 0 ? (
                            <div className="px-10 py-16 text-center text-slate-400">
                                <p className="text-xs font-black uppercase tracking-widest">No recent signals detected</p>
                            </div>
                        ) : (
                            notifications.slice(0, 5).map((notif) => (
                                <div key={notif.id} className="px-10 py-6 flex items-start gap-5 hover:bg-slate-50 transition-colors">
                                    <div className={`p-3 rounded-2xl bg-slate-50 shadow-sm ${notif.read ? 'opacity-40' : ''}`}>
                                        {notif.type === 'LIKE' && <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />}
                                        {notif.type === 'COMMENT' && <MessageSquare className="w-4 h-4 text-blue-600 fill-blue-600" />}
                                        {notif.type === 'VIEW' && <Eye className="w-4 h-4 text-emerald-600" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-black leading-tight ${notif.read ? 'text-slate-400' : 'text-slate-900'}`}>
                                            {notif.message}
                                        </p>
                                        <p className="text-[10px] text-slate-400 mt-2 uppercase font-black tracking-widest">
                                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
