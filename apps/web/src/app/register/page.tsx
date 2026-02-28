"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        companyName: "",
        name: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleOnboarding = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/onboarding`, {
                method: "POST",
                body: JSON.stringify(formData),
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();

            if (res.ok) {
                // Automatically sign in after onboarding
                await signIn("credentials", {
                    email: formData.email,
                    password: formData.password,
                    callbackUrl: "/dashboard",
                });
            } else {
                setError(data.message || "Failed to create account");
            }
        } catch (err) {
            setError("An error occurred during onboarding");
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-fruit p-4">
            <div className="glass max-w-lg w-full p-10 rounded-2xl shadow-2xl space-y-8">
                <div className="flex justify-between items-center">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl">🍓</div>
                    <div className="flex gap-2">
                        {[1, 2].map((s) => (
                            <div key={s} className={`w-8 h-1 rounded-full transition-all ${step >= s ? "bg-white" : "bg-white/20"}`} />
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-extrabold text-white">Start your journey</h1>
                    <p className="text-white/70">Launch your multi-tenant procurement portal in seconds</p>
                </div>

                {error && (
                    <div className="bg-lemon/20 border border-lemon/30 text-lemon text-sm p-4 rounded-xl">
                        {error}
                    </div>
                )}

                <form onSubmit={step === 2 ? handleOnboarding : (e) => { e.preventDefault(); setStep(2); }} className="space-y-6">
                    {step === 1 ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-white/90">Company Name</label>
                                <input
                                    name="companyName"
                                    required
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:ring-2 focus:ring-orange/50 outline-none"
                                    placeholder="e.g. Strawberry Hospitality Group"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-4 rounded-xl bg-white text-strawberry font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                Next Step
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-white/90">Full Name</label>
                                <input
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:ring-2 focus:ring-orange/50 outline-none"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-white/90">Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:ring-2 focus:ring-orange/50 outline-none"
                                    placeholder="admin@company.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-white/90">Password</label>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:ring-2 focus:ring-orange/50 outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="flex-1 py-4 rounded-xl bg-white/10 text-white font-bold text-lg hover:bg-white/20 transition-all"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] py-4 rounded-xl bg-white text-strawberry font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    Create Portal 🚀
                                </button>
                            </div>
                        </div>
                    )}
                </form>

                <p className="text-center text-white/50 text-sm">
                    Already have an account? <span onClick={() => router.push('/login')} className="text-white hover:underline cursor-pointer">Log in</span>
                </p>
            </div>
        </div>
    );
}
