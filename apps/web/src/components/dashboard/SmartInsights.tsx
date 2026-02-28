"use client";

import { motion } from "framer-motion";

interface SmartInsightsProps {
    alerts: any[];
    savings: any[];
}

export default function SmartInsights({ alerts, savings }: SmartInsightsProps) {
    return (
        <div className="space-y-6">
            <div className="glass p-8 rounded-[2.5rem] border border-white/10 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10 text-6xl">🤖</div>
                <h3 className="text-xl font-black text-white mb-6">Smart Recommendations</h3>

                <div className="space-y-4">
                    {alerts.length === 0 && savings.length === 0 && (
                        <p className="text-white/40 text-sm font-medium italic">Scanning your inventory for optimizations...</p>
                    )}

                    {alerts.map((alert, i) => (
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            key={i}
                            className={`p-4 rounded-2xl flex items-center gap-4 ${alert.severity === 'CRITICAL' ? 'bg-strawberry/20 border border-strawberry/20' : 'bg-orange/20 border border-orange/20'}`}
                        >
                            <div className="text-2xl">{alert.severity === 'CRITICAL' ? '🚨' : '⚠️'}</div>
                            <div className="flex-1">
                                <p className="text-white text-xs font-bold uppercase tracking-wider">{alert.severity} • {alert.productName}</p>
                                <p className="text-white/80 text-sm font-medium mt-1">{alert.recommendation}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-white font-black text-xs">{alert.daysRemaining} days</p>
                                <p className="text-white/40 text-[10px] uppercase font-bold">Left</p>
                            </div>
                        </motion.div>
                    ))}

                    {savings.map((saving, i) => (
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: (alerts.length + i) * 0.1 }}
                            key={i}
                            className="p-4 rounded-2xl bg-kiwi/20 border border-kiwi/20 flex items-center gap-4"
                        >
                            <div className="text-2xl">💸</div>
                            <div className="flex-1">
                                <p className="text-white text-xs font-bold uppercase tracking-wider">Savings Opportunity • {saving.productName}</p>
                                <p className="text-white/80 text-sm font-medium mt-1">{saving.reason}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-kiwi font-black text-xs">Save ${saving.potentialSavings}</p>
                                <p className="text-white/40 text-[10px] uppercase font-bold">Potential</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
