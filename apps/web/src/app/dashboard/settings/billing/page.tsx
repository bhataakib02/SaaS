"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

const plans = [
    {
        name: "Strawberry",
        icon: "🍓",
        price: "$49",
        description: "Perfect for single-venue boutique bars.",
        features: ["1 Venue", "AI Ingestion (5/mo)", "Basic Analytics", "Email Support"],
        color: "strawberry",
        priceId: "price_strawberry_id",
    },
    {
        name: "Orange",
        icon: "🍊",
        price: "$149",
        description: "Ideal for growing hospitality groups.",
        features: ["5 Venues", "Unlimited AI Ingestion", "Advanced BI Charts", "Priority Support"],
        color: "orange",
        featured: true,
        priceId: "price_orange_id",
    },
    {
        name: "Kiwi",
        icon: "🥝",
        price: "Custom",
        description: "Enterprise-grade procurement control.",
        features: ["Unlimited Venues", "API Access", "Custom Reports", "Dedicated Account Manager"],
        color: "kiwi",
        priceId: "price_kiwi_id",
    },
];

export default function BillingPage() {
    const { data: session } = useSession();
    const [status, setStatus] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/billing/status`, {
                    headers: {
                        Authorization: `Bearer ${(session as any)?.accessToken}`,
                    },
                });
                const data = await res.json();
                setStatus(data);
            } catch (err) {
                console.error("Failed to fetch billing status", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (session) fetchStatus();
    }, [session]);

    const handleSubscribe = async (priceId: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/billing/create-checkout-session`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${(session as any)?.accessToken}`,
                },
                body: JSON.stringify({ priceId }),
            });
            const { url } = await res.json();
            if (url) window.location.href = url;
        } catch (err) {
            alert("Failed to start checkout. Please check your Stripe keys.");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">Billing & Plans</h1>
                    <p className="text-white/60 mt-1">Select the perfect plan for your business 🍓</p>
                </div>
                {status && (
                    <div className="glass px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Active Plan</p>
                            <p className="text-white font-black">{status.plan}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-kiwi flex items-center justify-center text-xl shadow-lg">🥝</div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan) => (
                    <motion.div
                        key={plan.name}
                        whileHover={{ y: -10 }}
                        className={`glass p-8 rounded-[2.5rem] border relative flex flex-col ${plan.featured ? 'border-orange ring-4 ring-orange/10 scale-105 z-10' : 'border-white/10'}`}
                    >
                        {plan.featured && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-orange rounded-full text-[10px] font-black text-white uppercase tracking-widest">
                                Most Popular
                            </div>
                        )}

                        <div className="text-4xl mb-4">{plan.icon}</div>
                        <h3 className="text-2xl font-black text-white mb-2">{plan.name}</h3>
                        <p className="text-white/40 text-sm mb-6">{plan.description}</p>

                        <div className="flex items-baseline gap-1 mb-8">
                            <span className="text-4xl font-black text-white">{plan.price}</span>
                            {plan.price !== "Custom" && <span className="text-white/40 font-bold">/month</span>}
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            {plan.features.map((feature) => (
                                <li key={feature} className="flex items-center gap-3 text-sm text-white/80 font-medium">
                                    <span className={`w-5 h-5 rounded-full flex items-center justify-center bg-${plan.color}/20 text-${plan.color} text-[10px]`}>✓</span>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => handleSubscribe(plan.priceId)}
                            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 shadow-xl ${plan.featured ? 'bg-orange text-white shadow-orange/20' : 'bg-white/5 text-white hover:bg-white/10 shadow-black/20'}`}
                        >
                            {plan.price === "Custom" ? "Contact Us" : "Get Started"}
                        </button>
                    </motion.div>
                ))}
            </div>

            <div className="glass p-8 rounded-3xl border border-white/10 bg-white/[0.02]">
                <h2 className="text-xl font-bold text-white mb-4">Billing History</h2>
                <p className="text-white/40 text-sm">No invoices found. Subscriptions will appear here once active.</p>
            </div>
        </div>
    );
}
