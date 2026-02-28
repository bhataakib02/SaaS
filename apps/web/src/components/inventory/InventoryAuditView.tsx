"use client";

import { motion } from "framer-motion";

interface AuditLogProps {
    logs: any[];
}

export default function InventoryAuditView({ logs }: AuditLogProps) {
    return (
        <div className="glass p-8 rounded-[2.5rem] border border-white/10 overflow-hidden relative">
            <h3 className="text-xl font-black text-white mb-6">Inventory Audit Trail</h3>

            <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                {logs.length === 0 && (
                    <p className="text-white/40 text-sm italic">No recent stock movements recorded.</p>
                )}

                {logs.map((log, i) => {
                    const details = log.details as any;
                    const isIncrease = details.diff > 0;

                    return (
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.05 }}
                            key={log.id}
                            className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4 hover:bg-white/[0.08] transition-all"
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${isIncrease ? 'bg-kiwi/20 text-kiwi' : 'bg-strawberry/20 text-strawberry'}`}>
                                {isIncrease ? '📈' : '📉'}
                            </div>

                            <div className="flex-1">
                                <p className="text-white text-xs font-bold uppercase tracking-wider">
                                    {details.productName}
                                </p>
                                <p className="text-white/60 text-xs mt-0.5">
                                    {details.reason} • by {log.user.name || 'Staff'}
                                </p>
                                <p className="text-white/20 text-[9px] font-bold uppercase mt-1">
                                    {new Date(log.createdAt).toLocaleString()}
                                </p>
                            </div>

                            <div className="text-right">
                                <p className={`font-black text-sm ${isIncrease ? 'text-kiwi' : 'text-strawberry'}`}>
                                    {isIncrease ? '+' : ''}{details.diff}
                                </p>
                                <p className="text-white/40 text-[10px] uppercase font-bold">Units</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
