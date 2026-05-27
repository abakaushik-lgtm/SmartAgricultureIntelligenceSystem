import { Database, Gauge, Users } from "lucide-react";
import { Card } from "../components/ui/Card";

export function AdminPage() {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <Card><Users className="mb-3 text-field" /><p className="text-sm text-slate-500">Users</p><p className="text-3xl font-semibold">1,248</p></Card>
        <Card><Database className="mb-3 text-canopy" /><p className="text-sm text-slate-500">Datasets</p><p className="text-3xl font-semibold">18</p></Card>
        <Card><Gauge className="mb-3 text-sunlit" /><p className="text-sm text-slate-500">Model mAP50</p><p className="text-3xl font-semibold">86%</p></Card>
      </div>
      <Card>
        <h2 className="text-xl font-semibold">System Logs</h2>
        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
          {["Disease model warmed", "Redis cache hit ratio 91%", "Weather sync completed", "Sensor gateway heartbeat received"].map((log) => (
            <div key={log} className="border-b border-slate-200 px-4 py-3 text-sm last:border-b-0 dark:border-slate-800">{log}</div>
          ))}
        </div>
      </Card>
    </div>
  );
}
