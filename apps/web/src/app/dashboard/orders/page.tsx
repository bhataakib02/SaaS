"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

const statusColors: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-900/60",
    SENT: "bg-orange/20 text-orange",
    APPROVED: "bg-kiwi/20 text-kiwi",
    DELIVERED: "bg-kiwi text-gray-900",
    CANCELLED: "bg-strawberry/20 text-strawberry",
};

export default function OrdersPage() {
    const { data: session } = useSession();
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005'}/orders`, {
                    headers: {
                        Authorization: `Bearer ${(session as any)?.accessToken}`,
                    },
                });
                const data = await res.json();
                setOrders(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to fetch orders", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (session) fetchOrders();
    }, [session]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end mt-8">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Purchase Orders</h1>
                    <p className="text-gray-500 mt-1">Manage your procurement workflow</p>
                </div>
                <button className="px-6 py-3 rounded-2xl bg-gradient-to-r from-strawberry to-orange text-gray-900 font-bold shadow-lg shadow-strawberry/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                    New Order +
                </button>
            </div>

            <div className="glass rounded-3xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 bg-white">
                                <th className="py-5 px-6 font-bold text-gray-900/40 uppercase tracking-wider">PO Number</th>
                                <th className="py-5 px-6 font-bold text-gray-900/40 uppercase tracking-wider">Venue</th>
                                <th className="py-5 px-6 font-bold text-gray-900/40 uppercase tracking-wider">Supplier</th>
                                <th className="py-5 px-6 font-bold text-gray-900/40 uppercase tracking-wider">Total</th>
                                <th className="py-5 px-6 font-bold text-gray-900/40 uppercase tracking-wider">Status</th>
                                <th className="py-5 px-6 font-bold text-gray-900/40 uppercase tracking-wider text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                [1, 2, 3].map((i) => (
                                    <tr key={i} className="animate-pulse border-b border-gray-100">
                                        <td colSpan={6} className="py-8 px-6">
                                            <div className="h-4 bg-gray-100 rounded w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center text-gray-900/40 font-medium">
                                        No purchase orders found. Start by creating one!
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order: any) => (
                                    <motion.tr
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        key={order.id}
                                        className="border-b border-gray-100 hover:bg-white transition-colors cursor-pointer group"
                                    >
                                        <td className="py-5 px-6 font-bold text-gray-900 group-hover:text-orange transition-colors">
                                            {order.poNumber}
                                        </td>
                                        <td className="py-5 px-6 text-gray-900/80 font-medium">
                                            {order.venue?.name}
                                        </td>
                                        <td className="py-5 px-6 text-gray-900/80 font-medium">
                                            {order.supplier?.name}
                                        </td>
                                        <td className="py-5 px-6 font-bold text-gray-900">
                                            ${Number(order.total).toLocaleString()}
                                        </td>
                                        <td className="py-5 px-6">
                                            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${statusColors[order.status]}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-5 px-6 text-gray-900/40 text-right font-medium">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
