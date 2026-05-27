import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CloudSun, Leaf, LineChart, Satellite } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const capabilities: Array<[string, LucideIcon]> = [
  ["Disease AI", Leaf],
  ["Yield forecast", LineChart],
  ["Weather risk", CloudSun],
  ["Satellite ready", Satellite]
];

export function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative flex min-h-screen items-center overflow-hidden px-6 py-16">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center opacity-35" />
        <div className="absolute inset-0 bg-slate-950/55" />
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="relative mx-auto w-full max-w-6xl">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex rounded-lg border border-white/20 px-3 py-1 text-sm text-green-100">AI farming intelligence for modern growers</p>
            <h1 className="text-5xl font-semibold leading-tight sm:text-7xl">AgriNexus AI</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
              Monitor crop health, detect disease, forecast yield, analyze soil, and coordinate weather-aware farm decisions from one industrial-grade platform.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-5 py-3 font-semibold text-slate-950">
                Open dashboard <ArrowRight size={18} />
              </Link>
              <Link to="/signup" className="rounded-lg border border-white/25 px-5 py-3 font-semibold">Create account</Link>
            </div>
          </div>
          <div className="mt-14 grid max-w-4xl grid-cols-2 gap-3 md:grid-cols-4">
            {capabilities.map(([label, Icon]) => (
              <div key={label} className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
                <Icon className="mb-3 text-green-300" size={24} />
                <p className="font-medium">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </main>
  );
}
