"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const navItems = [
        { name: 'Overview', path: '/dashboard' },
        { name: 'Orders', path: '/dashboard/orders' },
        { name: 'Inventory', path: '/dashboard/inventory' },
        { name: 'Products', path: '/dashboard/products' },
        { name: 'Suppliers', path: '/dashboard/suppliers' },
        { name: 'Ingestion', path: '/dashboard/ingestion' },
        { name: 'Settings', path: '/dashboard/settings/billing' },
    ];

    return (
        <div className="min-h-screen bg-[var(--light)] flex flex-col relative w-full">
            {/* Top Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass m-4 rounded-3xl flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <span className="font-black text-2xl tracking-tighter text-gray-900">FRUITIFY</span>
                </div>

                <div className="hidden lg:flex items-center gap-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path || (item.path !== '/dashboard' && pathname?.startsWith(item.path));
                        return (
                            <Link
                                key={item.name}
                                href={item.path}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl transition-all duration-300 group ${isActive ? 'bg-strawberry text-white shadow-lg shadow-strawberry/20' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
                            >
                                <span className={`font-bold text-base tracking-wide`}>{item.name}</span>
                            </Link>
                        );
                    })}
                </div>

                <button
                    onClick={() => signOut()}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-gray-500 hover:bg-strawberry/10 hover:text-strawberry transition-all font-bold text-base"
                >
                    Logout
                </button>
            </nav>

            {/* Main Content wrapper */}
            <main className="flex-1 px-4 md:px-8 pt-60 pb-12 space-y-8 overflow-x-hidden w-full max-w-7xl mx-auto">
                {children}
            </main>
        </div>
    );
}
