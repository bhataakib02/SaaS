"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

export default function ProductsPage() {
    const { data: session } = useSession();
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/products`, {
                    headers: {
                        Authorization: `Bearer ${(session as any)?.accessToken}`,
                    },
                });
                const data = await res.json();
                setProducts(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to fetch products", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (session) fetchProducts();
    }, [session]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">Product Catalog</h1>
                    <p className="text-white/60 mt-1">Manage items across all suppliers 🍷</p>
                </div>
                <button className="px-6 py-3 rounded-2xl bg-gradient-to-r from-strawberry to-orange text-white font-bold shadow-lg">
                    Add Product +
                </button>
            </div>

            <div className="glass rounded-3xl border border-white/10 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="py-5 px-6 font-bold text-white/40 uppercase tracking-wider">Product Name</th>
                            <th className="py-5 px-6 font-bold text-white/40 uppercase tracking-wider">SKU</th>
                            <th className="py-5 px-6 font-bold text-white/40 uppercase tracking-wider">Category</th>
                            <th className="py-5 px-6 font-bold text-white/40 uppercase tracking-wider">Base Price</th>
                            <th className="py-5 px-6 font-bold text-white/40 uppercase tracking-wider">Supplier</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            [1, 2, 3].map(i => (
                                <tr key={i} className="animate-pulse border-b border-white/5">
                                    <td colSpan={5} className="py-8 px-6"><div className="h-4 bg-white/10 rounded w-full"></div></td>
                                </tr>
                            ))
                        ) : products.length === 0 ? (
                            <tr><td colSpan={5} className="py-20 text-center text-white/40">No products found. 🥝</td></tr>
                        ) : (
                            products.map((p) => (
                                <motion.tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                    <td className="py-5 px-6 font-bold text-white group-hover:text-strawberry transition-colors">{p.name}</td>
                                    <td className="py-5 px-6 text-white/40 font-mono">{p.sku}</td>
                                    <td className="py-5 px-6"><span className="px-3 py-1 bg-white/5 rounded-full text-white/60 text-xs">{p.category}</span></td>
                                    <td className="py-5 px-6 font-bold text-white">${Number(p.basePrice).toFixed(2)}</td>
                                    <td className="py-5 px-6 text-white/60">{p.supplier?.name}</td>
                                </motion.tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
