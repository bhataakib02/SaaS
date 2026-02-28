import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col items-center justify-center p-8">
      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${Math.random() * 15 + 10}s`
          } as any}
        />
      ))}
      <main className="container relative z-10 w-full max-w-4xl space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <div className="inline-block px-4 py-1 rounded-full bg-strawberry/10 text-strawberry text-sm font-semibold tracking-wide border border-strawberry/20">
            Fruit Procurement v1.0
          </div>
          <h1 className="text-6xl font-extrabold tracking-tight text-foreground">
            Procurement & Inventory <br />
            <span className="bg-clip-text text-transparent bg-gradient-fruit">
              Sweetly Optimized.
            </span>
          </h1>
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto">
            The enterprise-grade SaaS for the hospitality industry. Manage suppliers, track inventory, and automate procurement with a unique fruit-inspired interface.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/register">
              <button className="gradient-btn px-8 py-4 rounded-2xl text-white font-bold text-lg shadow-lg cursor-pointer">
                Get Started
              </button>
            </Link>
            <Link href="/login">
              <button className="glass px-8 py-4 rounded-2xl font-bold text-lg hover:bg-strawberry/5 transition-colors cursor-pointer">
                Request Demo
              </button>
            </Link>
          </div>
        </section>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass p-8 rounded-2xl space-y-4 hover:scale-[1.02] transition-transform cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-strawberry/20 flex items-center justify-center text-strawberry text-2xl">🍓</div>
            <h3 className="text-xl font-bold">Fast Ingestion</h3>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Accepts Excel, CSV, and PDF. AI-powered column mapping for seamless data entry.
            </p>
          </div>
          <div className="glass p-8 rounded-2xl space-y-4 hover:scale-[1.02] transition-transform cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-orange/20 flex items-center justify-center text-orange text-2xl">🍊</div>
            <h3 className="text-xl font-bold">Real-time Stock</h3>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Monitor inventory across multiple venues with real-time tracking and low-stock alerts.
            </p>
          </div>
          <div className="glass p-8 rounded-2xl space-y-4 hover:scale-[1.02] transition-transform cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-kiwi/20 flex items-center justify-center text-kiwi text-2xl">🥝</div>
            <h3 className="text-xl font-bold">Smart Analytics</h3>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Deep insights into spend, inventory valuation, and predictive restocking trends.
            </p>
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center justify-center gap-6 pt-12 opacity-50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-kiwi animate-pulse"></div>
            <span className="text-xs font-mono uppercase tracking-widest">Multi-tenant Ready</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-lemon animate-pulse"></div>
            <span className="text-xs font-mono uppercase tracking-widest">AI Mapping Core</span>
          </div>
        </div>
      </main>
    </div>
  );
}
