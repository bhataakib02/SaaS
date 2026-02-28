"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import SpendChart from "@/components/analytics/SpendChart";
import ForecastChart from "@/components/analytics/ForecastChart";
import SmartInsights from "@/components/dashboard/SmartInsights";
import NotificationCenter from "@/components/notifications/NotificationCenter";


export default function DashboardPage() {
    const { data: session } = useSession();
    const [summary, setSummary] = useState<any>(null);
    const [trend, setTrend] = useState<any[]>([]);
    const [forecast, setForecast] = useState<any[]>([]);
    const [alerts, setAlerts] = useState<any[]>([]);
    const [savings, setSavings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!session) return;
            const headers = { Authorization: `Bearer ${(session as any)?.accessToken}` };
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

            try {
                const [summaryRes, trendRes, forecastRes, alertsRes, savingsRes] = await Promise.all([
                    fetch(`${baseUrl}/analytics/spend-summary`, { headers }),
                    fetch(`${baseUrl}/analytics/spend-trend`, { headers }),
                    fetch(`${baseUrl}/ai/forecast`, { headers }),
                    fetch(`${baseUrl}/ai/alerts`, { headers }),
                    fetch(`${baseUrl}/ai/savings`, { headers })
                ]);

                setSummary(await summaryRes.json());
                setTrend(await trendRes.json());
                setForecast(await forecastRes.json());
                setAlerts(await alertsRes.json());
                setSavings(await savingsRes.json());
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [session]);

    if (!session) return null;

    return (
        <div className="min-h-screen bg-[var(--background)] flex">
            {/* Sidebar */}
            <aside className="w-64 glass m-4 rounded-3xl flex flex-col p-6 space-y-8 h-[calc(100vh-2rem)] sticky top-4">
                <div className="flex items-center gap-3 px-2">
                    <span className="text-3xl">🍓</span>
                    <span className="font-black text-2xl tracking-tighter text-white">FRUITIFY</span>
                </div>

                <nav className="flex-1 space-y-2">
                    {[
                        { name: 'Overview', icon: '📊', path: '/dashboard' },
                        { name: 'Orders', icon: '📦', path: '/dashboard/orders' },
                        { name: 'Inventory', icon: '🌡️', path: '/dashboard/inventory' },
                        { name: 'Products', icon: '🍷', path: '/dashboard/products' },
                        { name: 'Suppliers', icon: '🚚', path: '/dashboard/suppliers' },
                        { name: 'Ingestion', icon: '🤖', path: '/dashboard/ingestion' },
                        { name: 'Settings', icon: '⚙️', path: '/dashboard/settings/billing' },
                    ].map((item) => (
                        <Link
                            key={item.name}
                            href={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${item.name === 'Overview' ? 'bg-strawberry text-white shadow-lg shadow-strawberry/20' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                        >
                            <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
                            <span className="font-bold text-sm tracking-wide">{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <button
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-white/40 hover:bg-strawberry/10 hover:text-strawberry transition-all font-bold text-sm"
                >
                    <span>🚪</span> Logout
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 space-y-8">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                    <header className="flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-black text-white tracking-tight">
                                Overview
                            </h1>
                            <p className="text-white/60 mt-1 font-medium">Welcome back, {session?.user?.name || 'User'} 🍓</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <NotificationCenter accessToken={(session as any)?.accessToken} />
                            <div className="glass px-4 py-2 rounded-full flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-kiwi animate-pulse"></div>
                                <p className="text-white/60 font-medium">Role: {(session?.user as any)?.role || 'Staff'}</p>
                            </div>
                        </div>
                    </header>


                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="glass p-6 rounded-3xl border border-white/10 hover:border-strawberry/30 transition-colors">
                            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Total Spend</p>
                            <h2 className="text-3xl font-black text-white mt-1">${summary?.totalSpend?.toLocaleString() || '0'}</h2>
                            <p className="text-kiwi text-xs font-bold mt-2">↑ 12% vs last month</p>
                        </div>
                        <div className="glass p-6 rounded-3xl border border-white/10 hover:border-orange/30 transition-colors">
                            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Orders Placed</p>
                            <h2 className="text-3xl font-black text-white mt-1">42</h2>
                            <p className="text-white/20 text-xs font-bold mt-2">8 pending approval</p>
                        </div>
                        <div className="glass p-6 rounded-3xl border border-white/10 hover:border-lemon/30 transition-colors">
                            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Low Stock Items</p>
                            <h2 className="text-3xl font-black text-white mt-1">{alerts.length}</h2>
                            <p className={`${alerts.length > 0 ? 'text-strawberry' : 'text-kiwi'} text-xs font-bold mt-2`}>
                                {alerts.length > 0 ? 'Action required' : 'All good'}
                            </p>
                        </div>
                        <div className="glass p-6 rounded-3xl border border-white/10 hover:border-kiwi/30 transition-colors">
                            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Savings Found</p>
                            <h2 className="text-3xl font-black text-white mt-1">${savings.reduce((acc, s) => acc + s.potentialSavings, 0)}</h2>
                            <p className="text-kiwi text-xs font-bold mt-2">AI Optimization active</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <SpendChart
                                data={trend}
                                type="line"
                                title="Spend Trend (30 Days)"
                            />
                        </div>
                        <SmartInsights alerts={alerts} savings={savings} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <SpendChart
                            data={summary?.spendByCategory || []}
                            type="bar"
                            title="Spend by Category"
                        />
                        <ForecastChart
                            data={forecast}
                            title="AI Demand Forecast"
                        />
                    </div>

                    <div className="glass p-8 rounded-3xl border border-white/10">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
                            <button className="text-orange text-sm font-bold hover:underline">View all</button>
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all cursor-pointer">
                                    <div className="w-12 h-12 rounded-xl bg-strawberry/20 flex items-center justify-center text-xl">🍓</div>
                                    <div className="flex-1">
                                        <p className="text-white font-bold text-sm">New Purchase Order: PO-2024-00{i}</p>
                                        <p className="text-white/40 text-xs">Approved by Admin • 2 hours ago</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white font-black">$1,240.00</p>
                                        <span className="text-[10px] font-black p-1 bg-kiwi/20 text-kiwi rounded">DELIVERED</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
