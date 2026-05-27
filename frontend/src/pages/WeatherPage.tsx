import { CloudRain, ThermometerSun } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card } from "../components/ui/Card";

const data = [
  { day: "Mon", temp: 29, rain: 8 },
  { day: "Tue", temp: 31, rain: 12 },
  { day: "Wed", temp: 27, rain: 22 },
  { day: "Thu", temp: 28, rain: 5 },
  { day: "Fri", temp: 30, rain: 2 },
  { day: "Sat", temp: 32, rain: 0 },
  { day: "Sun", temp: 29, rain: 14 }
];

export function WeatherPage() {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <Card><ThermometerSun className="mb-3 text-sunlit" /><p className="text-sm text-slate-500">Avg temperature</p><p className="text-3xl font-semibold">29.4 C</p></Card>
        <Card><CloudRain className="mb-3 text-canopy" /><p className="text-sm text-slate-500">Rain chance</p><p className="text-3xl font-semibold">62%</p></Card>
        <Card><CloudRain className="mb-3 text-field" /><p className="text-sm text-slate-500">Irrigation advice</p><p className="text-xl font-semibold">Delay 12 hours</p></Card>
      </div>
      <Card>
        <h2 className="mb-4 text-xl font-semibold">7-Day Weather Intelligence</h2>
        <div className="h-96">
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={3} />
              <Line type="monotone" dataKey="rain" stroke="#0f766e" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
