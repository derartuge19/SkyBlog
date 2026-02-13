import { getNotifications, markNotificationAsRead } from '@/app/actions/admin';
import { Bell, Check, MessageSquare, Heart, Eye, Clock } from 'lucide-react';
import { revalidatePath } from 'next/cache';

export default async function NotificationsPage() {
    const notifications = await getNotifications();

    type NotificationItem = typeof notifications[number];

    const getIcon = (type: string) => {
        switch (type) {
            case 'COMMENT': return <MessageSquare className="w-5 h-5 text-blue-400" />;
            case 'LIKE': return <Heart className="w-5 h-5 text-rose-400" />;
            case 'VIEW': return <Eye className="w-5 h-5 text-emerald-400" />;
            default: return <Bell className="w-5 h-5 text-slate-400" />;
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-fade-in-up pb-20">
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Signal Relay</h1>
                <p className="text-slate-500 mt-2 font-medium">Monitor incoming interaction signals across the platform.</p>
            </div>

            <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50">
                <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                        <Bell className="w-5 h-5 text-blue-600" />
                        Inbound Notifications
                    </h3>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {notifications.length} Signals Captured
                    </span>
                </div>

                <div className="divide-y divide-slate-50">
                    {notifications.length === 0 ? (
                        <div className="p-24 text-center space-y-6">
                            <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto shadow-inner">
                                <Bell className="w-8 h-8 text-slate-200" />
                            </div>
                            <p className="text-xs font-black uppercase tracking-widest text-slate-400">No signals detected at this time</p>
                        </div>
                    ) : (
                        notifications.map((notif: NotificationItem) => (
                            <div
                                key={notif.id}
                                className={`p-8 flex items-start gap-6 transition-all hover:bg-slate-50 ${notif.read ? 'opacity-60' : 'bg-blue-50/30 border-l-4 border-l-blue-600'}`}
                            >
                                <div className={`p-4 rounded-2xl ${notif.read ? 'bg-slate-100' : 'bg-white'} shadow-sm border border-slate-100`}>
                                    {getIcon(notif.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-4 mb-3">
                                        <p className={`text-base font-black leading-tight ${notif.read ? 'text-slate-500' : 'text-slate-900'}`}>
                                            {notif.message}
                                        </p>
                                        {!notif.read && (
                                            <form action={async () => {
                                                'use server';
                                                await markNotificationAsRead(notif.id);
                                            }}>
                                                <button className="p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                                                    <Check className="w-4 h-4" />
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="w-3 h-3" />
                                            {new Date(notif.createdAt).toLocaleDateString()}
                                        </span>
                                        <span>•</span>
                                        <span className={`${notif.read ? 'text-slate-300' : 'text-blue-600'}`}>
                                            {notif.read ? 'Processed' : 'Awaiting Review'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
