import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-[var(--background)] flex">
            {/* Sidebar Placeholder */}
            <aside className="w-64 glass m-4 rounded-2xl flex flex-col p-6 space-y-8">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">🍓</span>
                    <span className="font-bold text-xl tracking-tight">Fruitify</span>
                </div>

                <nav className="flex-1 space-y-2">
                    {['Dashboard', 'Suppliers', 'Catalog', 'Inventory', 'Orders'].map((item) => (
                        <div key={item} className={`px-4 py-3 rounded-xl cursor-pointer transition-all ${item === 'Dashboard' ? 'bg-strawberry/10 text-strawberry font-bold border border-strawberry/20' : 'hover:bg-strawberry/5 opacity-60'}`}>
                            {item}
                        </div>
                    ))}
                </nav>

                <form action={async () => {
                    "use server";
                    await signOut();
                }}>
                    <button className="w-full p-4 rounded-xl hover:bg-strawberry/5 text-left text-sm opacity-60">
                        Logout
                    </button>
                </form>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 space-y-8">
                <header className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Good morning, {session.user?.name || 'Manager'}</h1>
                        <p className="text-foreground/50">Welcome to your procurement overview</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="glass px-4 py-2 rounded-full flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-kiwi animate-pulse"></div>
                            <p className="text-white/60 font-medium">Role: {(session?.user as any)?.role || 'Staff'}</p>
                        </div>
                    </div>
                </header>

                <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Spend', val: '$12,450', trend: '+12%', color: 'strawberry' },
                        { label: 'Active Orders', val: '8', trend: '2 pending', color: 'orange' },
                        { label: 'In-stock Items', val: '1,204', trend: '98%', color: 'kiwi' },
                        { label: 'Alerts', val: '3', trend: 'Low stock', color: 'lemon' },
                    ].map((stat) => (
                        <div key={stat.label} className="glass p-6 rounded-2xl relative overflow-hidden group">
                            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full bg-${stat.color}/10 group-hover:scale-110 transition-transform`}></div>
                            <p className="text-sm text-foreground/50 font-medium">{stat.label}</p>
                            <p className="text-2xl font-bold mt-1">{stat.val}</p>
                            <div className={`text-xs mt-2 font-bold text-${stat.color}`}>{stat.trend}</div>
                        </div>
                    ))}
                </section>

                <section className="glass rounded-2xl p-8 h-96 flex items-center justify-center border-dashed border-2 border-foreground/10">
                    <div className="text-center space-y-4">
                        <div className="text-4xl">📈</div>
                        <p className="text-foreground/40 font-medium">Dashboard Analytics Chart (Fruit Palette)</p>
                        <div className="flex gap-2 justify-center">
                            <div className="w-8 h-2 rounded-full bg-strawberry"></div>
                            <div className="w-8 h-2 rounded-full bg-orange"></div>
                            <div className="w-8 h-2 rounded-full bg-kiwi"></div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
