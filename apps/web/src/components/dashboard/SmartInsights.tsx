"use client";

import { motion } from "framer-motion";

interface SmartInsightsProps {
    alerts: any[];
    savings: any[];
}

export default function SmartInsights({ alerts, savings }: SmartInsightsProps) {
    return (
        <div className="space-y-6">
            <div className="glass p-8 rounded-[2.5rem] border border-gray-200 bg-white overflow-hidden relative">
                <h3 className="text-xl font-black text-gray-900 mb-6">Smart Recommendations</h3>

                <div className="space-y-4">
                    {alerts.length === 0 && savings.length === 0 && (
                        <p className="text-gray-500 text-sm font-medium italic">Scanning your inventory for optimizations...</p>
                    )}

                    {alerts.map((alert, i) => (
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            key={i}
                            className={`p-4 rounded-2xl flex items-center gap-4 border ${alert.severity === 'CRITICAL' ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'}`}
                        >
                            <div className={`font-bold text-sm ${alert.severity === 'CRITICAL' ? 'text-red-700' : 'text-orange-700'}`}>
                                {alert.severity === 'CRITICAL' ? 'Critical' : 'Warning'}
                            </div>
                            <div className="flex-1">
                                <p className="text-gray-900 text-xs font-bold uppercase tracking-wider">{alert.severity} • {alert.productName}</p>
                                <p className="text-gray-700 text-sm font-medium mt-1">{alert.recommendation}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-gray-900 font-black text-xs">{alert.daysRemaining} days</p>
                                <p className="text-gray-500 text-[10px] uppercase font-bold">Left</p>
                            </div>
                        </motion.div>
                    ))}

                    {savings.map((saving, i) => (
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: (alerts.length + i) * 0.1 }}
                            key={i}
                            className="p-4 rounded-2xl bg-green-50 border border-green-200 flex items-center gap-4"
                        >
                            <div className="font-bold text-green-700 text-sm">Save</div>
                            <div className="flex-1">
                                <p className="text-gray-900 text-xs font-bold uppercase tracking-wider">Savings Opportunity • {saving.productName}</p>
                                <p className="text-gray-700 text-sm font-medium mt-1">{saving.reason}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-kiwi font-black text-xs">Save ${saving.potentialSavings}</p>
                                <p className="text-gray-500 text-[10px] uppercase font-bold">Potential</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
