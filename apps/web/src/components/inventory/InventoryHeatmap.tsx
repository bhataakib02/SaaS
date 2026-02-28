"use client";

import { motion } from "framer-motion";

interface VenueHealth {
    id: string;
    name: string;
    criticalCount: number;
    lowCount: number;
    totalCount: number;
}

export default function InventoryHeatmap({ data }: { data: VenueHealth[] }) {
    const getHealthColor = (critical: number, total: number) => {
        const ratio = total > 0 ? critical / total : 0;
        if (ratio > 0.3) return "bg-strawberry shadow-strawberry/20";
        if (ratio > 0.1) return "bg-orange shadow-orange/20";
        return "bg-kiwi shadow-kiwi/20";
    };

    return (
        <div className="glass p-8 rounded-3xl border border-white/10">
            <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                <span className="text-3xl">🌡️</span> Stock Health Heatmap
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {data.map((venue) => {
                    const healthColor = getHealthColor(venue.criticalCount, venue.totalCount);
                    return (
                        <motion.div
                            key={venue.id}
                            whileHover={{ scale: 1.05 }}
                            className="relative group cursor-pointer"
                        >
                            <div className={`aspect-square rounded-3xl ${healthColor} shadow-xl flex flex-col items-center justify-center p-6 text-center space-y-2 transition-all duration-500`}>
                                <span className="text-xs font-black text-white/60 uppercase tracking-widest">{venue.name}</span>
                                <span className="text-4xl font-black text-white">{Math.round((venue.totalCount - venue.criticalCount) / venue.totalCount * 100 || 0)}%</span>
                                <span className="text-[10px] font-bold text-white/40 uppercase">Healthy</span>
                            </div>

                            <div className="absolute inset-0 bg-grape/90 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                                <p className="text-strawberry font-bold text-sm">{venue.criticalCount} Critical</p>
                                <p className="text-orange font-bold text-sm">{venue.lowCount} Low</p>
                                <p className="text-white/40 text-[10px] mt-2 font-black uppercase tracking-tighter">Click to view details</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 flex flex-wrap gap-8 justify-center">
                <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-kiwi shadow-lg shadow-kiwi/20"></div>
                    <span className="text-xs font-bold text-white/60 uppercase">Optimal (&gt;90%)</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-orange shadow-lg shadow-orange/20"></div>
                    <span className="text-xs font-bold text-white/60 uppercase">Warning (70-90%)</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-strawberry shadow-lg shadow-strawberry/20"></div>
                    <span className="text-xs font-bold text-white/60 uppercase">Danger (&lt;70%)</span>
                </div>
            </div>
        </div>
    );
}
