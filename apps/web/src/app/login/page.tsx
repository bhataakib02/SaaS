"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

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
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-fruit p-4">
            <div className="glass max-w-md w-full p-8 rounded-2xl shadow-2xl space-y-8">
                <div className="text-center space-y-2">
                    <div className="inline-block p-3 rounded-xl bg-white/20 text-3xl mb-2">🍓</div>
                    <h1 className="text-3xl font-extrabold text-white">Welcome Back</h1>
                    <p className="text-white/70">Sign in to your fruit procurement portal</p>
                </div>

                {error && (
                    <div className="bg-lemon/20 border border-lemon/30 text-lemon text-sm p-4 rounded-xl text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-white/90 ml-1">Email address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange/50 transition-all"
                            placeholder="name@company.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-white/90 ml-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange/50 transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 rounded-xl bg-white text-strawberry font-bold text-lg hover:bg-opacity-90 transform active:scale-[0.98] transition-all shadow-xl"
                    >
                        Sign In
                    </button>
                </form>

                <div className="text-center pt-4">
                    <p className="text-sm text-white/60">
                        Don't have an account? <span className="text-white hover:underline cursor-pointer">Contact Admin</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
