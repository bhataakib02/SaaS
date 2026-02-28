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
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';

            try {
                const [summaryRes, trendRes, forecastRes, alertsRes, savingsRes] = await Promise.all([
                    fetch(`${baseUrl}/analytics/spend-summary`, { headers }),
                    fetch(`${baseUrl}/analytics/spend-trend`, { headers }),
                    fetch(`${baseUrl}/ai/forecast`, { headers }),
                    fetch(`${baseUrl}/ai/alerts`, { headers }),
                    fetch(`${baseUrl}/ai/savings`, { headers })
                ]);

                const summaryData = await summaryRes.json();
                const trendData = await trendRes.json();
                const forecastData = await forecastRes.json();
                const alertsData = await alertsRes.json();
                const savingsData = await savingsRes.json();

                setSummary(summaryData);
                setTrend(Array.isArray(trendData) ? trendData : []);
                setForecast(Array.isArray(forecastData) ? forecastData : []);
                setAlerts(Array.isArray(alertsData) ? alertsData : []);
                setSavings(Array.isArray(savingsData) ? savingsData : []);
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [session]);

    const handleExport = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005'}/reports/spend/csv`, {
                headers: { Authorization: `Bearer ${(session as any)?.accessToken}` },
            });
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `spend-report-${new Date().getTime()}.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (err) {
            console.error("Export failed", err);
        }
    };

    if (!session) return null;

    return (
        <div className="space-y-8 overflow-x-hidden w-full max-w-7xl mx-auto">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                            Overview
                        </h1>
                        <p className="text-gray-500 mt-1 font-medium">Welcome back, {session?.user?.name || 'User'}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        <button
                            onClick={handleExport}
                            className="px-5 py-2.5 rounded-2xl glass border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all flex items-center gap-2 text-sm bg-white"
                        >
                            Export Spend
                        </button>
                        <NotificationCenter accessToken={(session as any)?.accessToken} />
                        <div className="glass px-4 py-2 rounded-full flex items-center gap-2 border border-gray-200 bg-white">
                            <div className="w-2 h-2 rounded-full bg-kiwi animate-pulse"></div>
                            <p className="text-gray-600 font-medium text-xs">Role: {(session?.user as any)?.role || 'Staff'}</p>
                        </div>
                    </div>
                </header>


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="glass p-6 rounded-3xl border border-gray-200 hover:border-strawberry/30 transition-colors bg-white">
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Total Spend</p>
                        <h2 className="text-3xl font-black text-gray-900 mt-1">${summary?.totalSpend?.toLocaleString() || '0'}</h2>
                        <p className="text-kiwi text-xs font-bold mt-2">↑ 12% vs last month</p>
                    </div>
                    <div className="glass p-6 rounded-3xl border border-gray-200 hover:border-orange/30 transition-colors bg-white">
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Orders Placed</p>
                        <h2 className="text-3xl font-black text-gray-900 mt-1">42</h2>
                        <p className="text-gray-400 text-xs font-bold mt-2">8 pending approval</p>
                    </div>
                    <div className="glass p-6 rounded-3xl border border-gray-200 hover:border-lemon/30 transition-colors bg-white">
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Low Stock Items</p>
                        <h2 className="text-3xl font-black text-gray-900 mt-1">{alerts.length}</h2>
                        <p className={`${alerts.length > 0 ? 'text-strawberry' : 'text-kiwi'} text-xs font-bold mt-2`}>
                            {alerts.length > 0 ? 'Action required' : 'All good'}
                        </p>
                    </div>
                    <div className="glass p-6 rounded-3xl border border-gray-200 hover:border-kiwi/30 transition-colors bg-white">
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Savings Found</p>
                        <h2 className="text-3xl font-black text-gray-900 mt-1">${savings.reduce((acc, s) => acc + s.potentialSavings, 0)}</h2>
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

                <div className="glass p-8 rounded-3xl border border-gray-200 bg-white mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
                        <button className="text-orange text-sm font-bold hover:underline">View all</button>
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all cursor-pointer">
                                <div className="w-12 h-12 rounded-xl bg-strawberry/10 flex items-center justify-center text-sm font-bold shadow-sm text-strawberry">PO</div>
                                <div className="flex-1">
                                    <p className="text-gray-900 font-bold text-sm">New Purchase Order: PO-2024-00{i}</p>
                                    <p className="text-gray-500 text-xs">Approved by Admin • 2 hours ago</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-900 font-black">$1,240.00</p>
                                    <span className="text-[10px] font-black p-1 bg-kiwi/10 text-kiwi rounded">DELIVERED</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
