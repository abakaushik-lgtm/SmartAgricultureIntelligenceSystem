import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, AlertTriangle, Droplets, Leaf, Radio, Sprout, Thermometer } from "lucide-react";
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
  const [telemetry, setTelemetry] = useState({
    soil_moisture: 54.2,
    temperature_c: 26.8,
    humidity: 62.0,
    alerts: ["Irrigation due in 18h"] as string[],
    wsConnected: false
  });

  useEffect(() => {
    let socket: WebSocket | null = null;
    let reconnectTimeout: any;

    function connectWS() {
      socket = new WebSocket("ws://localhost:8000/ws/monitoring");

      socket.onopen = () => {
        setTelemetry((prev) => ({ ...prev, wsConnected: true }));
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setTelemetry({
            soil_moisture: data.soil_moisture,
            temperature_c: data.temperature_c,
            humidity: data.humidity,
            alerts: data.alerts && data.alerts.length > 0 ? data.alerts : ["No immediate risks"],
            wsConnected: true
          });
        } catch (e) {
          console.warn("Failed to parse websocket telemetry data", e);
        }
      };

      socket.onclose = () => {
        setTelemetry((prev) => ({ ...prev, wsConnected: false }));
        reconnectTimeout = setTimeout(connectWS, 4000);
      };

      socket.onerror = () => {
        if (socket) socket.close();
      };
    }

    connectWS();

    return () => {
      if (socket) socket.close();
      clearTimeout(reconnectTimeout);
    };
  }, []);

  return (
    <div className="space-y-5">
      {/* Telemetry operations cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* Crop Health Card */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="relative overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Crop Health Index</p>
                <p className="mt-2 text-3xl font-bold">87%</p>
              </div>
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-green-50 text-field dark:bg-green-950 dark:text-green-300">
                <Leaf size={22} />
              </span>
            </div>
            <p className="mt-4 text-sm text-slate-500">Stable across 12 active fields</p>
          </Card>
        </motion.div>

        {/* Soil Moisture & Air Humid Card */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="relative overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Soil Moisture</p>
                <p className="mt-2 text-3xl font-bold">{telemetry.soil_moisture}%</p>
              </div>
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-teal-50 text-canopy dark:bg-teal-950 dark:text-teal-300">
                <Droplets size={22} />
              </span>
            </div>
            <p className="mt-4 text-sm text-slate-500">Air Humidity is currently {telemetry.humidity}%</p>
          </Card>
        </motion.div>

        {/* Temperature / Climate Card */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="relative overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Field Temperature</p>
                <p className="mt-2 text-3xl font-bold">{telemetry.temperature_c} °C</p>
              </div>
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-amber-50 text-sunlit dark:bg-amber-950 dark:text-amber-300">
                <Thermometer size={22} />
              </span>
            </div>
            <p className="mt-4 text-sm text-slate-500 flex items-center gap-1.5">
              <span className={`inline-block h-2 w-2 rounded-full ${telemetry.temperature_c > 30 ? "bg-red-500 animate-pulse" : "bg-green-500"}`} />
              {telemetry.temperature_c > 30 ? "High heat risk advisory" : "Comfortable climate index"}
            </p>
          </Card>
        </motion.div>

        {/* Live Gateway / Alert Card */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className={`relative overflow-hidden border ${telemetry.wsConnected ? "border-slate-200 dark:border-slate-800" : "border-amber-200 dark:border-amber-900/40 bg-amber-50/10"}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Live Telemetry Gateway</p>
                <p className="mt-2 text-3xl font-bold flex items-center gap-2">
                  {telemetry.wsConnected ? "Synced" : "Offline"}
                  <span className="relative flex h-3.5 w-3.5">
                    {telemetry.wsConnected ? (
                      <>
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500"></span>
                      </>
                    ) : (
                      <>
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
                      </>
                    )}
                  </span>
                </p>
              </div>
              <span className={`grid h-11 w-11 place-items-center rounded-lg ${telemetry.wsConnected ? "bg-green-50 text-field dark:bg-green-950" : "bg-amber-100 text-amber-600 dark:bg-amber-950/60"}`}>
                <Radio size={22} className={telemetry.wsConnected ? "animate-pulse" : ""} />
              </span>
            </div>
            <p className="mt-4 text-sm text-slate-500 truncate">
              {telemetry.wsConnected ? `Alerts: ${telemetry.alerts.join(", ")}` : "Reconnecting to live telemetry gateway..."}
            </p>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <Card className="border border-slate-200 dark:border-slate-800">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Yield Forecast</h2>
              <p className="text-sm text-slate-500">Time-series crop productivity outlook</p>
            </div>
            <Activity className="text-field" />
          </div>
          <div className="h-80">
            <ResponsiveContainer>
              <AreaChart data={yieldData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", color: "#fff" }} />
                <Area type="monotone" dataKey="rice" stroke="#16a34a" fill="#86efac" name="Rice yield (t)" />
                <Area type="monotone" dataKey="wheat" stroke="#0f766e" fill="#99f6e4" name="Wheat yield (t)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-800">
          <div className="mb-4 flex items-center gap-3">
            <Sprout className="text-field" />
            <div>
              <h2 className="text-lg font-bold">Field Health</h2>
              <p className="text-sm text-slate-500">Zone-wise vegetation score</p>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer>
              <BarChart data={healthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" />
                <XAxis dataKey="zone" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", color: "#fff" }} />
                <Bar dataKey="score" fill="#15803d" radius={[6, 6, 0, 0]} name="Health Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
