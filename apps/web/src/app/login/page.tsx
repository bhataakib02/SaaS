"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid email or password");
            } else {
                router.push("/dashboard");
            }
        } catch (err) {
            setError("An unexpected error occurred");
        }
    };

    return (
        <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center p-4">
            {/* Floating Particles */}
            {mounted && [...Array(10)].map((_, i) => (
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
            <div className="auth-card relative z-10 w-full max-w-md p-10 rounded-[2.5rem] border border-white/5">
                <div className="text-center space-y-3 mb-10">
                    <div className="mx-auto w-16 h-16 rounded-2xl bg-strawberry/10 flex items-center justify-center text-4xl mb-6 shadow-2xl shadow-strawberry/20">🍓</div>
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-0 text-shadow-none">Welcome Back</h1>
                    <p className="text-slate-400 font-medium">Authentication for Berry Suite Elite</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-2xl text-center animate-in fade-in slide-in-from-top-2">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 !p-0 !bg-transparent !animate-none">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Corporate Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-5 py-4 rounded-2xl text-lg"
                            placeholder="name@company.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Secure Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-4 rounded-2xl text-lg"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full py-5 rounded-2xl text-xl font-bold shadow-2xl mt-4"
                    >
                        Sign In
                    </button>
                </form>

                <div className="text-center pt-8">
                    <p className="text-sm text-slate-500 font-medium">
                        Secure Enterprise Portal | <a href="mailto:support@berrysuite.com" className="text-strawberry/80 hover:text-strawberry hover:underline transition-colors">Contact Support</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
