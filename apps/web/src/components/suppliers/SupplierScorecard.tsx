"use client";

import { motion } from "framer-motion";

interface SupplierScorecardProps {
    performance: any;
}

export default function SupplierScorecard({ performance }: SupplierScorecardProps) {
    if (!performance || performance.grade === 'N/A') return null;

    const starCount = Math.round(performance.rating);

    return (
        <div className="glass p-6 rounded-3xl border border-white/10 hover:border-orange/30 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-4xl group-hover:opacity-10 transition-opacity">⭐</div>

            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Supplier Grade</p>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={`text-3xl font-black ${performance.grade === 'A' ? 'text-kiwi' : performance.grade === 'B' ? 'text-orange' : 'text-strawberry'}`}>
                            {performance.grade}
                        </span>
                        <div className="flex text-lemon">
                            {[...Array(5)].map((_, i) => (
                                <span key={i} className={i < starCount ? "opacity-100" : "opacity-20"}>⭐</span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Reliability</p>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded mt-1 inline-block ${performance.reliability === 'HIGH' ? 'bg-kiwi/20 text-kiwi' : 'bg-orange/20 text-orange'}`}>
                        {performance.reliability}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-white/40 text-[9px] font-bold uppercase">Avg Lead Time</p>
                    <p className="text-white font-black text-sm">{performance.avgLeadTime}</p>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-white/40 text-[9px] font-bold uppercase">Deliveries</p>
                    <p className="text-white font-black text-sm">Active</p>
                </div>
            </div>

            <div className="p-4 rounded-2xl bg-kiwi/10 border border-kiwi/20">
                <p className="text-kiwi text-[11px] font-bold italic line-clamp-2">
                    " {performance.insights} "
                </p>
            </div>
        </div>
    );
}
