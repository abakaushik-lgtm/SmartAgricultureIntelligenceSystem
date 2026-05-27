import { motion } from "framer-motion";
import { Activity, AlertTriangle, Droplets, Leaf, Radio, Sprout } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar } from "recharts";
import { Card } from "../components/ui/Card";

const yieldData = [
  { month: "Jan", rice: 3.2, wheat: 2.6 },
  { month: "Feb", rice: 3.6, wheat: 2.8 },
  { month: "Mar", rice: 4.1, wheat: 3.1 },
  { month: "Apr", rice: 4.4, wheat: 3.4 },
  { month: "May", rice: 4.8, wheat: 3.7 },
  { month: "Jun", rice: 5.2, wheat: 3.9 }
];

const healthData = [
  { zone: "North", score: 86 },
  { zone: "East", score: 74 },
  { zone: "South", score: 91 },
  { zone: "West", score: 68 }
];

export function DashboardPage() {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Crop Health", "87%", Leaf, "Stable across 12 fields"],
          ["Soil Moisture", "54%", Droplets, "Irrigation due in 18h"],
          ["Disease Alerts", "3", AlertTriangle, "2 medium risk plots"],
          ["Live Sensors", "128", Radio, "All gateways online"]
        ].map(([label, value, Icon, note]) => (
          <motion.div key={String(label)} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{String(label)}</p>
                  <p className="mt-2 text-3xl font-semibold">{String(value)}</p>
                </div>
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-green-50 text-field dark:bg-green-950 dark:text-green-300">
                  <Icon size={22} />
                </span>
              </div>
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{String(note)}</p>
            </Card>
          </motion.div>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Yield Forecast</h2>
              <p className="text-sm text-slate-500">Time-series crop productivity outlook</p>
            </div>
            <Activity className="text-field" />
          </div>
          <div className="h-80">
            <ResponsiveContainer>
              <AreaChart data={yieldData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="rice" stroke="#16a34a" fill="#86efac" />
                <Area type="monotone" dataKey="wheat" stroke="#0f766e" fill="#99f6e4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <div className="mb-4 flex items-center gap-3">
            <Sprout className="text-field" />
            <div>
              <h2 className="text-lg font-semibold">Field Health</h2>
              <p className="text-sm text-slate-500">Zone-wise vegetation score</p>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer>
              <BarChart data={healthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="zone" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#15803d" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
