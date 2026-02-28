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
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005'}/products`, {
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
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Product Catalog</h1>
                    <p className="text-gray-500 mt-1 font-medium">Manage items across all suppliers</p>
                </div>
                <button className="px-6 py-3 rounded-2xl bg-strawberry text-white font-bold shadow-lg shadow-strawberry/20 hover:scale-[1.02] transition-all">
                    Add Product +
                </button>
            </div>

            <div className="glass rounded-3xl border border-gray-200 overflow-hidden bg-white">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50">
                            <th className="py-5 px-6 font-bold text-gray-400 uppercase tracking-wider">Product Name</th>
                            <th className="py-5 px-6 font-bold text-gray-400 uppercase tracking-wider">SKU</th>
                            <th className="py-5 px-6 font-bold text-gray-400 uppercase tracking-wider">Category</th>
                            <th className="py-5 px-6 font-bold text-gray-400 uppercase tracking-wider">Base Price</th>
                            <th className="py-5 px-6 font-bold text-gray-400 uppercase tracking-wider">Supplier</th>
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
                                <motion.tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                                    <td className="py-5 px-6 font-bold text-gray-900 group-hover:text-strawberry transition-colors">{p.name}</td>
                                    <td className="py-5 px-6 text-gray-400 font-mono">{p.sku}</td>
                                    <td className="py-5 px-6"><span className="px-3 py-1 bg-gray-100 rounded-full text-gray-600 text-xs">{p.category}</span></td>
                                    <td className="py-5 px-6 font-bold text-gray-900">${Number(p.basePrice).toFixed(2)}</td>
                                    <td className="py-5 px-6 text-gray-500">{p.supplier?.name}</td>
                                </motion.tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
