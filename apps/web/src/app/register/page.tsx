"use client";

import { useState, useEffect } from "react";
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
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleOnboarding = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:3005` : 'http://localhost:3005');
            const res = await fetch(`${apiUrl}/auth/onboarding`, {
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
        <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center p-4">
            {/* Floating Particles */}
            {mounted && [...Array(12)].map((_, i) => (
                <div
                    key={i}
                    className="particle"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        width: `${Math.random() * 10 + 5}px`,
                        height: `${Math.random() * 10 + 5}px`,
                        animationDelay: `${Math.random() * 10}s`,
                        animationDuration: `${Math.random() * 15 + 10}s`
                    } as any}
                />
            ))}
            <div className="auth-card relative z-10 max-w-lg w-full p-12 rounded-[2.5rem] border border-white/5">
                <div className="flex justify-between items-center mb-10">
                    <div className="w-14 h-14 rounded-2xl bg-strawberry/10 flex items-center justify-center text-3xl shadow-2xl shadow-strawberry/20">🍓</div>
                    <div className="flex gap-3">
                        {[1, 2].map((s) => (
                            <div key={s} className={`w-10 h-1.5 rounded-full transition-all duration-500 ${step >= s ? "bg-strawberry shadow-[0_0_10px_var(--strawberry)]" : "bg-slate-800"}`} />
                        ))}
                    </div>
                </div>

                <div className="space-y-4 mb-10">
                    <h1 className="text-4xl font-bold text-white mb-0 text-shadow-none">Join the Network</h1>
                    <p className="text-slate-400 font-medium text-lg leading-relaxed">Launch your multi-tenant procurement portal on the elite Berry infrastructure.</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-2xl mb-8 animate-in fade-in slide-in-from-top-2">
                        {error}
                    </div>
                )}

                <form onSubmit={step === 2 ? handleOnboarding : (e) => { e.preventDefault(); setStep(2); }} className="space-y-8 !p-0 !bg-transparent !animate-none">
                    {step === 1 ? (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Enterprise Entity Name</label>
                                <input
                                    name="companyName"
                                    required
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 rounded-2xl text-lg"
                                    placeholder="e.g. Strawberry Hospitality Group"
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary w-full py-5 rounded-2xl text-xl font-bold shadow-2xl"
                            >
                                Continue Implementation
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Administrator Full Name</label>
                                <input
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 rounded-2xl text-lg"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Corporate Email Address</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 rounded-2xl text-lg"
                                    placeholder="admin@company.com"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Security Credentials</label>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 rounded-2xl text-lg"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="flex-1 btn btn-glass py-5 rounded-2xl text-lg font-bold"
                                >
                                    Review
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] btn btn-primary py-5 rounded-2xl text-xl font-bold shadow-2xl"
                                >
                                    Deploy Portal 🚀
                                </button>
                            </div>
                        </div>
                    )}
                </form>

                <p className="text-center text-slate-500 font-medium text-sm mt-12">
                    Member of the network? <span onClick={() => router.push('/login')} className="text-strawberry/80 hover:text-strawberry hover:underline cursor-pointer transition-colors">Authenticate Here</span>
                </p>
            </div>
        </div>
    );
}
