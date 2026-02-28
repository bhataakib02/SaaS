"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NotificationCenterProps {
    accessToken: string;
}

export default function NotificationCenter({ accessToken }: NotificationCenterProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/notifications`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                const data = await res.json();
                setNotifications(data);
                setUnreadCount(data.filter((n: any) => !(n.details as any)?.read).length);
            } catch (err) {
                console.error("Failed to fetch notifications", err);
            }
        };

        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, [accessToken]);

    const markAsRead = async (id: string) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/notifications/${id}/read`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, details: { ...(n.details as any), read: true } } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error("Failed to mark notification as read", err);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
            >
                <span className="text-xl">🔔</span>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-strawberry text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[var(--background)]">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-4 w-80 glass rounded-[2rem] border border-white/10 shadow-2xl z-50 overflow-hidden"
                        >
                            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                                <h3 className="font-black text-white uppercase tracking-wider text-xs">Notifications</h3>
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{notifications.length} Total</span>
                            </div>

                            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <p className="text-white/20 text-sm font-medium italic">No notifications yet 🍓</p>
                                    </div>
                                ) : (
                                    notifications.map((n) => {
                                        const details = n.details as any;
                                        return (
                                            <div
                                                key={n.id}
                                                onClick={() => markAsRead(n.id)}
                                                className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group ${!details.read ? 'bg-white/[0.02]' : ''}`}
                                            >
                                                <div className="flex gap-4">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${details.severity === 'CRITICAL' ? 'bg-strawberry/20' : 'bg-orange/20'}`}>
                                                        {details.severity === 'CRITICAL' ? '🚨' : '⚠️'}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className={`text-sm font-bold ${!details.read ? 'text-white' : 'text-white/40'}`}>{details.title}</p>
                                                        <p className="text-xs text-white/60 mt-0.5 line-clamp-2">{details.message}</p>
                                                        <p className="text-[10px] text-white/20 mt-2 font-bold uppercase">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                    </div>
                                                    {!details.read && (
                                                        <div className="w-2 h-2 rounded-full bg-strawberry mt-1"></div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            <div className="p-4 bg-white/5 text-center">
                                <button className="text-[10px] font-black uppercase text-orange hover:underline tracking-widest">View All Activity</button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
