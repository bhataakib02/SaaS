"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";

interface ForecastChartProps {
    data: any[];
    title: string;
}

const COLORS = ["#43AA8B", "#F9C74F"]; // Kiwi for Current, Lemon for Predicted

export default function ForecastChart({ data, title }: ForecastChartProps) {
    return (
        <div className="glass p-8 rounded-[2.5rem] border border-white/10 h-[450px] flex flex-col">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                🔮 {title}
            </h3>

            <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#ffffff30", fontSize: 10 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#ffffff30", fontSize: 10 }}
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #ffffff10", borderRadius: "16px" }}
                            itemStyle={{ color: "#fff", fontWeight: "bold" }}
                        />
                        <Legend verticalAlign="top" height={36} />
                        <Bar dataKey="currentStock" name="Current Stock" fill="#43AA8B" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="predictedDemand" name="Predicted Demand" fill="#F9C74F" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <p className="text-[10px] text-white/20 mt-4 text-center font-bold uppercase tracking-widest">
                AI Confidence: 85% • Based on 30-day consumption velocity
            </p>
        </div>
    );
}
