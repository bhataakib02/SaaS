"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

const plans = [
    {
        id: "starter_price_id", // Replace with real Stripe Price ID
        name: "Starter",
        price: "$49",
        description: "Perfect for single-venue boutique operations.",
        features: ["Up to 100 products", "1 Venue", "AI Basic Ingestion", "CSV Export"],
        color: "bg-kiwi/10 border-kiwi/30 text-kiwi",
        button: "bg-kiwi text-white"
    },
    {
        id: "pro_price_id",
        name: "Professional",
        price: "$149",
        description: "Scale your multi-venue hospitality group.",
        features: ["Unlimited products", "Up to 5 Venues", "AI Advanced Forecasting", "Heatmap Analytics"],
        color: "bg-orange/10 border-orange/30 text-orange",
        button: "bg-orange text-white",
        popular: true
    },
    {
        id: "enterprise_price_id",
        name: "Enterprise",
        price: "Custom",
        description: "Global scale for institutional procurement.",
        features: ["Unlimited Venues", "Dedicated Support", "Custom AI Models", "Full API Access"],
        color: "bg-strawberry/10 border-strawberry/30 text-strawberry",
        button: "bg-strawberry text-white"
    }
];

export default function PricingPage() {
    const { data: session } = useSession();
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

    const handleSubscribe = async (priceId: string) => {
        if (!session) {
            window.location.href = "/auth/login";
            return;
        }

        setLoadingPlan(priceId);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/billing/checkout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${(session as any)?.accessToken}`,
                },
                body: JSON.stringify({ priceId }),
            });

            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error("Failed to create checkout session");
            }
        } catch (err) {
            console.error("Subscription failed", err);
            alert("Checkout failed. Please try again.");
        } finally {
            setLoadingPlan(null);
        }
    };

    return (
        <div className="min-h-screen py-20 px-6 animate-in fade-in duration-700">
            <div className="max-w-7xl mx-auto text-center space-y-4 mb-20">
                <h1 className="text-6xl font-black text-white tracking-tighter">Choose Your Plan 🍓</h1>
                <p className="text-xl text-white/40 max-w-2xl mx-auto">
                    Transform your procurement with AI-driven intelligence and institutional-grade security.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {plans.map((plan) => (
                    <motion.div
                        whileHover={{ y: -10 }}
                        key={plan.name}
                        className={`glass p-10 rounded-[40px] border relative flex flex-col justify-between ${plan.color}`}
                    >
                        {plan.popular && (
                            <div className="absolute -top-4 left-10 px-4 py-1 bg-white text-strawberry text-[10px] font-black uppercase rounded-full shadow-lg">
                                Most Popular
                            </div>
                        )}

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-2xl font-black text-white">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mt-2">
                                    <span className="text-5xl font-black text-white">{plan.price}</span>
                                    {plan.price !== "Custom" && <span className="text-white/40 font-bold">/mo</span>}
                                </div>
                                <p className="text-white/60 mt-4 font-medium">{plan.description}</p>
                            </div>

                            <ul className="space-y-4 pt-8 border-t border-white/5">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3 text-sm font-bold text-white/80">
                                        <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">✅</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button
                            disabled={loadingPlan === plan.id}
                            onClick={() => handleSubscribe(plan.id)}
                            className={`w-full mt-10 py-5 rounded-2xl font-black text-lg transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98] ${plan.button} ${loadingPlan === plan.id ? 'opacity-50' : ''}`}
                        >
                            {loadingPlan === plan.id ? "Redirecting..." : plan.price === "Custom" ? "Contact Sales" : "Get Started Now 🚀"}
                        </button>
                    </motion.div>
                ))}
            </div>

            <div className="mt-20 text-center">
                <p className="text-white/20 text-xs font-black uppercase tracking-widest">Secure Payments via Stripe 💳</p>
            </div>
        </div>
    );
}
