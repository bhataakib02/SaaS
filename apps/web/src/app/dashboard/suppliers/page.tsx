"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import SupplierScorecard from "@/components/suppliers/SupplierScorecard";

export default function SuppliersPage() {
    const { data: session } = useSession();
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005'}/suppliers/performance`, {
                    headers: {
                        Authorization: `Bearer ${(session as any)?.accessToken}`,
                    },
                });
                const data = await res.json();
                setSuppliers(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to fetch suppliers", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (session) fetchSuppliers();
    }, [session]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Suppliers</h1>
                    <p className="text-gray-500 mt-1 font-medium">Manage your active vendor relationships</p>
                </div>
                <button className="px-6 py-3 rounded-2xl bg-strawberry text-white font-bold shadow-lg shadow-strawberry/20 hover:scale-[1.02] transition-all">
                    Connect Supplier +
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {isLoading ? (
                    [1, 2, 3].map(i => <div key={i} className="glass p-6 rounded-3xl h-64 animate-pulse" />)
                ) : suppliers.length === 0 ? (
                    <div className="col-span-full py-20 text-center glass rounded-3xl text-white/40">No suppliers found. 🥝</div>
                ) : (
                    suppliers.map((s) => (
                        <div key={s.id} className="space-y-4">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="glass p-6 rounded-3xl border border-gray-200 bg-white space-y-4 group cursor-pointer"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="w-12 h-12 rounded-2xl bg-strawberry/10 flex items-center justify-center text-2xl group-hover:bg-strawberry/20 transition-colors text-strawberry">🚚</div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active</span>
                                        <div className="w-2 h-2 rounded-full bg-kiwi"></div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-strawberry transition-colors">{s.name}</h3>
                                    <p className="text-gray-500 text-sm font-medium">{s.contactEmail}</p>
                                </div>
                                <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                                    <span className="text-gray-400">Terms:</span>
                                    <span className="text-gray-700">{s.paymentTerms || "N/A"}</span>
                                </div>
                            </motion.div>
                            <SupplierScorecard performance={s.performance} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

