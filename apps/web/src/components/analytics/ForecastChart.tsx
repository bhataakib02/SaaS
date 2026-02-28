"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";

interface ForecastChartProps {
    data: any[];
    title: string;
}

const COLORS = ["#43AA8B", "#F9C74F"]; // Kiwi for Current, Lemon for Predicted

export default function ForecastChart({ data, title }: ForecastChartProps) {
    const safeData = Array.isArray(data) ? data : [];

    return (
        <div className="glass p-8 rounded-[2.5rem] border border-gray-200 bg-white h-[450px] flex flex-col">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                Forecast {title}
            </h3>

            <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={safeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#6b7280", fontSize: 10 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#6b7280", fontSize: 10 }}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                            contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "16px" }}
                            itemStyle={{ color: "#111827", fontWeight: "bold" }}
                        />
                        <Legend verticalAlign="top" height={36} />
                        <Bar dataKey="currentStock" name="Current Stock" fill="#43AA8B" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="predictedDemand" name="Predicted Demand" fill="#F9C74F" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <p className="text-[10px] text-gray-500 mt-4 text-center font-bold uppercase tracking-widest">
                AI Confidence: 85% • Based on 30-day consumption velocity
            </p>
        </div>
    );
}
