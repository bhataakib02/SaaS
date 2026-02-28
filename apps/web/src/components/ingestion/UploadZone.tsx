"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface UploadZoneProps {
    onFileSelect: (file: File) => void;
    isLoading?: boolean;
}

export default function UploadZone({ onFileSelect, isLoading }: UploadZoneProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave") {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFileSelect(e.dataTransfer.files[0]);
        }
    }, [onFileSelect]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
        }
    };

    return (
        <motion.div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative group cursor-pointer border-2 border-dashed rounded-3xl p-12 transition-all duration-300 flex flex-col items-center justify-center gap-4 text-center overflow-hidden
        ${isDragging ? "border-orange bg-orange/10 scale-[1.01]" : "border-white/20 hover:border-strawberry/50 hover:bg-white/5"}
      `}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-strawberry/5 to-orange/5 opacity-0 group-hover:opacity-100 transition-opacity" />

            <motion.div
                animate={isDragging ? { y: -10, scale: 1.1 } : { y: 0, scale: 1 }}
                className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center text-4xl shadow-lg border border-white/10"
            >
                🍓
            </motion.div>

            <div className="space-y-2 z-10">
                <h3 className="text-xl font-bold text-white">Drop your price list here</h3>
                <p className="text-white/60 text-sm max-w-[250px]">
                    Upload your Excel (.xlsx) file, and let our 🤖 AI help you map the columns.
                </p>
            </div>

            <input
                type="file"
                accept=".xlsx,.csv"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
            />

            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-grape/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-20"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="w-12 h-12 border-4 border-strawberry border-t-white rounded-full"
                        />
                        <p className="text-white font-semibold">Tasting your file... 🥝</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
