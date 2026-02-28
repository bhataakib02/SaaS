"use client";

import { useEffect, useState } from "react";

export function Particles() {
    const [particles, setParticles] = useState<Array<{ id: number; size: number; left: number; duration: number; delay: number }>>([]);

    useEffect(() => {
        const newParticles = Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            size: Math.random() * 20 + 5,
            left: Math.random() * 100,
            duration: Math.random() * 10 + 10,
            delay: Math.random() * -20,
        }));
        setParticles(newParticles);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="particle absolute"
                    style={{
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        left: `${p.left}%`,
                        animationDuration: `${p.duration}s`,
                        animationDelay: `${p.delay}s`,
                    }}
                />
            ))}
        </div>
    );
}
