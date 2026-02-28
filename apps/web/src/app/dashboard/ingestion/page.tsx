"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import UploadZone from "@/components/ingestion/UploadZone";

export default function IngestionPage() {
    const { data: session } = useSession();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<any>(null);
    const [error, setError] = useState("");

    const handleFileSelect = async (file: File) => {
        setIsAnalyzing(true);
        setError("");
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/ingestion/analyze`, {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${(session as any)?.accessToken}`,
                },
            });

            if (!res.ok) throw new Error("Failed to analyze file");
            const data = await res.json();
            setAnalysis(data);
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">AI Price Ingestion</h1>
                    <p className="text-white/60 mt-1">Import new products and updates in seconds 🍓</p>
                </div>
            </div>

            {error && (
                <div className="p-4 rounded-2xl bg-strawberry/20 border border-strawberry/30 text-strawberry font-medium">
                    {error}
                </div>
            )}

            {!analysis ? (
                <div className="max-w-2xl mx-auto py-12">
                    <UploadZone onFileSelect={handleFileSelect} isLoading={isAnalyzing} />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="glass p-8 rounded-3xl border border-white/10">
                            <h2 className="text-xl font-bold text-white mb-4">Mapping Review 🤖</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {Object.entries(analysis.suggestions).map(([key, value]: [any, any]) => (
                                    <div key={key} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                        <label className="block text-xs font-bold text-white/40 uppercase mb-1">{key}</label>
                                        <p className="text-white font-semibold">{value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass p-8 rounded-3xl border border-white/10 overflow-hidden">
                            <h2 className="text-xl font-bold text-white mb-4">Data Preview 🥝</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-white/10">
                                            {analysis.headers.map((h: string) => (
                                                <th key={h} className="pb-4 px-4 font-bold text-white/40">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {analysis.preview.map((row: any, i: number) => (
                                            <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                {analysis.headers.map((h: string) => (
                                                    <td key={h} className="py-4 px-4 text-white/80">{row[h]}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="glass p-8 rounded-3xl border border-white/10 bg-kiwi/10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-kiwi flex items-center justify-center text-2xl shadow-lg">🥝</div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Summary</h3>
                                    <p className="text-white/60 text-sm">{analysis.rowCount} products detected</p>
                                </div>
                            </div>

                            <button
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-strawberry to-orange text-white font-bold text-lg shadow-xl shadow-strawberry/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                onClick={() => alert("Coming soon!")}
                            >
                                Injest Data 🚀
                            </button>
                            <button
                                onClick={() => setAnalysis(null)}
                                className="w-full mt-4 py-4 rounded-2xl bg-white/5 text-white/60 font-bold hover:bg-white/10 transition-all"
                            >
                                Start Over
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
