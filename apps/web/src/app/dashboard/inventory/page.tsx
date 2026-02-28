"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import InventoryAuditView from "@/components/inventory/InventoryAuditView";

export default function InventoryPage() {
    const { data: session } = useSession();
    const [inventory, setInventory] = useState<any[]>([]);
    const [logs, setLogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchInventoryData = async () => {
            try {
                const [invRes, logsRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/inventory`, {
                        headers: { Authorization: `Bearer ${(session as any)?.accessToken}` },
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/inventory/logs`, {
                        headers: { Authorization: `Bearer ${(session as any)?.accessToken}` },
                    })
                ]);

                const [invData, logsData] = await Promise.all([invRes.json(), logsRes.json()]);
                setInventory(Array.isArray(invData) ? invData : []);
                setLogs(Array.isArray(logsData) ? logsData : []);
            } catch (err) {
                console.error("Failed to fetch inventory data", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (session) fetchInventoryData();
    }, [session]);

    const getStockStatus = (quantity: number, minStock: number) => {
        if (quantity <= 0) return { label: "Out of Stock", color: "bg-strawberry text-white", bar: "bg-strawberry" };
        if (quantity <= minStock) return { label: "Low Stock", color: "bg-orange text-white", bar: "bg-orange" };
        return { label: "Healthy", color: "bg-kiwi/20 text-kiwi", bar: "bg-kiwi" };
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">Stock Heatmap</h1>
                    <p className="text-white/60 mt-1">Real-time inventory levels across venues 🌡️</p>
                </div>
                <div className="flex gap-4">
                    <div className="glass px-4 py-2 rounded-2xl flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-strawberry"></span>
                        <span className="text-xs font-bold text-white/60 uppercase">Critical</span>
                    </div>
                    <div className="glass px-4 py-2 rounded-2xl flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-orange"></span>
                        <span className="text-xs font-bold text-white/60 uppercase">Low</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Main Inventory Grid */}
                <div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 content-start">
                    {isLoading ? (
                        [1, 2, 3, 4].map(i => (
                            <div key={i} className="glass p-6 rounded-3xl h-48 animate-pulse" />
                        ))
                    ) : inventory.length === 0 ? (
                        <div className="col-span-full py-20 text-center glass rounded-3xl text-white/40">
                            No inventory records found. 🥝
                        </div>
                    ) : (
                        inventory.map((item) => {
                            const status = getStockStatus(item.quantity, item.minStock || 5);
                            return (
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    key={item.id}
                                    className="glass p-6 rounded-3xl border border-white/10 flex flex-col justify-between group overflow-hidden relative"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <span className="text-6xl font-black">🍷</span>
                                    </div>

                                    <div className="space-y-1 relative z-10">
                                        <div className="flex justify-between items-start">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${status.color}`}>
                                                {status.label}
                                            </span>
                                            <span className="text-white/40 text-xs font-bold uppercase">{item.venue?.name}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mt-4">{item.product?.name}</h3>
                                        <p className="text-white/40 text-xs font-medium uppercase tracking-wider">{item.product?.sku}</p>
                                    </div>

                                    <div className="mt-8 space-y-4 relative z-10">
                                        <div className="flex justify-between items-end">
                                            <span className="text-4xl font-black text-white">{item.quantity}</span>
                                            <span className="text-white/40 font-bold mb-1">units left</span>
                                        </div>
                                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.min((item.quantity / 50) * 100, 100)}%` }}
                                                className={`h-full ${status.bar}`}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>

                {/* Audit Trail Sidebar */}
                <div className="xl:col-span-4">
                    <InventoryAuditView logs={logs} />
                </div>
            </div>
        </div>
    );
}

