"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import InventoryAuditView from "@/components/inventory/InventoryAuditView";
import InventoryHeatmap from "@/components/inventory/InventoryHeatmap";

export default function InventoryPage() {
    const { data: session } = useSession();
    const [inventory, setInventory] = useState<any[]>([]);
    const [logs, setLogs] = useState<any[]>([]);
    const [venueHealth, setVenueHealth] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'heatmap'>('grid');

    useEffect(() => {
        const fetchInventoryData = async () => {
            if (!session) return;
            try {
                const [invRes, logsRes, venuesRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005'}/inventory`, {
                        headers: { Authorization: `Bearer ${(session as any)?.accessToken}` },
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005'}/inventory/logs`, {
                        headers: { Authorization: `Bearer ${(session as any)?.accessToken}` },
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005'}/venues`, {
                        headers: { Authorization: `Bearer ${(session as any)?.accessToken}` },
                    })
                ]);

                const [invData, logsData, venuesData] = await Promise.all([
                    invRes.json(),
                    logsRes.json(),
                    venuesRes.json()
                ]);

                setInventory(Array.isArray(invData) ? invData : []);
                setLogs(Array.isArray(logsData) ? logsData : []);

                // Calculate health per venue
                if (Array.isArray(venuesData) && Array.isArray(invData)) {
                    const health = venuesData.map(v => {
                        const items = invData.filter(i => i.venueId === v.id);
                        return {
                            id: v.id,
                            name: v.name,
                            criticalCount: items.filter(i => i.quantity <= 0).length,
                            lowCount: items.filter(i => i.quantity > 0 && i.quantity <= (i.minStock || 5)).length,
                            totalCount: items.length || 1 // Avoid div by zero
                        };
                    });
                    setVenueHealth(health);
                }
            } catch (err) {
                console.error("Failed to fetch inventory data", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInventoryData();
    }, [session]);

    const handleExport = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005'}/reports/inventory/csv`, {
                headers: { Authorization: `Bearer ${(session as any)?.accessToken}` },
            });
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `inventory-report-${new Date().getTime()}.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (err) {
            console.error("Export failed", err);
        }
    };

    const getStockStatus = (quantity: number, minStock: number) => {
        if (quantity <= 0) return { label: "Out of Stock", color: "bg-strawberry text-white", bar: "bg-strawberry" };
        if (quantity <= minStock) return { label: "Low Stock", color: "bg-orange text-white", bar: "bg-orange" };
        return { label: "Healthy", color: "bg-kiwi/20 text-kiwi", bar: "bg-kiwi" };
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Inventory Intelligence</h1>
                    <p className="text-gray-500 mt-1 font-medium">Real-time tracking and health visual analytics</p>
                </div>
                <div className="flex flex-wrap gap-4">
                    <div className="glass p-1 rounded-2xl flex gap-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${viewMode === 'grid' ? 'bg-strawberry text-white' : 'text-gray-400 hover:text-gray-900'}`}
                        >
                            Grid
                        </button>
                        <button
                            onClick={() => setViewMode('heatmap')}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${viewMode === 'heatmap' ? 'bg-orange text-white' : 'text-gray-400 hover:text-gray-900'}`}
                        >
                            Heatmap
                        </button>
                    </div>
                    <button
                        onClick={handleExport}
                        className="px-6 py-2 rounded-2xl glass border border-gray-200 text-gray-700 text-[10px] font-black uppercase hover:bg-gray-50 transition-all flex items-center gap-2 bg-white"
                    >
                        Export Report
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {viewMode === 'heatmap' ? (
                    <motion.div
                        key="heatmap"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                    >
                        <InventoryHeatmap data={venueHealth} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="grid grid-cols-1 xl:grid-cols-12 gap-8"
                    >
                        <div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 content-start">
                            {isLoading ? (
                                [1, 2, 3, 4].map(i => (
                                    <div key={i} className="glass p-6 rounded-3xl h-48 animate-pulse" />
                                ))
                            ) : inventory.length === 0 ? (
                                <div className="col-span-full py-20 text-center glass rounded-3xl text-gray-400 font-bold uppercase tracking-widest bg-gray-50">
                                    No records found
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
                                                    <span className="text-gray-400 text-xs font-bold uppercase">{item.venue?.name}</span>
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900 mt-4">{item.product?.name}</h3>
                                                <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{item.product?.sku}</p>
                                            </div>

                                            <div className="mt-8 space-y-4 relative z-10">
                                                <div className="flex justify-between items-end">
                                                    <span className="text-4xl font-black text-gray-900">{item.quantity}</span>
                                                    <span className="text-gray-400 font-bold mb-1">units left</span>
                                                </div>
                                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
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

                        <div className="xl:col-span-4">
                            <InventoryAuditView logs={logs} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
