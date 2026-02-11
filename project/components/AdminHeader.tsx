'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Bell, Check, ExternalLink, Info, AlertTriangle, X } from 'lucide-react';
import { getUnreadNotificationsCount, getRecentNotifications, markNotificationAsRead } from '@/app/actions/admin';

export default function AdminHeader() {
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    const fetchData = async () => {
        try {
            const [count, recent] = await Promise.all([
                getUnreadNotificationsCount(),
                getRecentNotifications(5)
            ]);
            setUnreadCount(count);
            setNotifications(recent);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    useEffect(() => {
        fetchData();
        // Polling for new notifications every 60 seconds
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        try {
            await markNotificationAsRead(id);
            await fetchData();
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'ALERT': return <AlertTriangle className="w-4 h-4 text-rose-500" />;
            default: return <Info className="w-4 h-4 text-blue-500" />;
        }
    };

    return (
        <header className="sticky top-0 right-0 z-30 flex items-center justify-end px-8 py-4 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
            <div className="relative" ref={popoverRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative p-2.5 rounded-2xl bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 group"
                >
                    <Bell className="w-6 h-6" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 border-2 border-white text-[8px] font-black text-white items-center justify-center">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        </span>
                    )}
                </button>

                {isOpen && (
                    <div className="absolute right-0 mt-4 w-96 bg-white border border-slate-100 rounded-[2rem] shadow-2xl shadow-slate-200/50 overflow-hidden animate-fade-in-up">
                        <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Recent Activity</h3>
                            <Link
                                href="/admin/notifications"
                                className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1"
                                onClick={() => setIsOpen(false)}
                            >
                                View All <ExternalLink className="w-3 h-3" />
                            </Link>
                        </div>

                        <div className="max-h-[24rem] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="px-6 py-12 text-center">
                                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Bell className="w-6 h-6 text-slate-200" />
                                    </div>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">All caught up</p>
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <Link
                                        key={notification.id}
                                        href="/admin/notifications"
                                        className={`block px-6 py-4 hover:bg-slate-50 transition-all border-b border-slate-50 last:border-0 group ${!notification.read ? 'bg-blue-50/20' : ''}`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <div className="flex gap-4">
                                            <div className={`mt-0.5 w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${!notification.read ? 'bg-white shadow-sm' : 'bg-slate-50'}`}>
                                                {getIcon(notification.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className={`text-sm tracking-tight truncate ${!notification.read ? 'font-black text-slate-900' : 'font-medium text-slate-600'}`}>
                                                        {notification.title}
                                                    </p>
                                                    {!notification.read && (
                                                        <button
                                                            onClick={(e) => handleMarkAsRead(notification.id, e)}
                                                            className="p-1 hover:bg-white rounded-lg text-slate-300 hover:text-emerald-500 transition-all opacity-0 group-hover:opacity-100"
                                                            title="Mark as read"
                                                        >
                                                            <Check className="w-3 h-3" />
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-400 mt-1 line-clamp-1">{notification.message}</p>
                                                <p className="text-[10px] text-slate-400 mt-2 font-black uppercase tracking-widest">
                                                    {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>

                        {notifications.length > 0 && (
                            <Link
                                href="/admin/notifications"
                                className="block py-4 bg-slate-50/50 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 hover:bg-slate-50 transition-all"
                                onClick={() => setIsOpen(false)}
                            >
                                Management Command Center
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}
