"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from "recharts";

interface SpendChartProps {
    data: any[];
    type: "bar" | "line";
    title: string;
}

const FRUIT_COLORS = ["#E63946", "#F77F00", "#F9C74F", "#43AA8B", "#5A189A"];

export default function SpendChart({ data, type, title }: SpendChartProps) {
    return (
        <div className="glass p-8 rounded-3xl border border-white/10 h-[400px] flex flex-col">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                {type === "line" ? "📈" : "📊"} {title}
            </h3>

            <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    {type === "bar" ? (
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#ffffff40", fontSize: 12 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#ffffff40", fontSize: 12 }}
                                tickFormatter={(v) => `$${v}`}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #ffffff10", borderRadius: "16px" }}
                                itemStyle={{ color: "#fff", fontWeight: "bold" }}
                            />
                            <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                                {data.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={FRUIT_COLORS[index % FRUIT_COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    ) : (
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#ffffff40", fontSize: 12 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#ffffff40", fontSize: 12 }}
                                tickFormatter={(v) => `$${v}`}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #ffffff10", borderRadius: "16px" }}
                                itemStyle={{ color: "#fff", fontWeight: "bold" }}
                            />
                            <Line
                                type="monotone"
                                dataKey="amount"
                                stroke="#E63946"
                                strokeWidth={4}
                                dot={{ fill: "#E63946", strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 8, fill: "#F77F00" }}
                            />
                        </LineChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
}
