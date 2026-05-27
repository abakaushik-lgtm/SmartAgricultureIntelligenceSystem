import { useEffect, useState } from "react";
import { CloudRain, ThermometerSun, Search, Sparkles } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card } from "../components/ui/Card";
import { getWeatherForecast } from "../services/api";

const DEFAULT_FORECAST = [
  { day: "Mon", temp: 29, rain: 8 },
  { day: "Tue", temp: 31, rain: 12 },
  { day: "Wed", temp: 27, rain: 22 },
  { day: "Thu", temp: 28, rain: 5 },
  { day: "Fri", temp: 30, rain: 2 },
  { day: "Sat", temp: 32, rain: 0 },
  { day: "Sun", temp: 29, rain: 14 }
];

export function WeatherPage() {
  const [location, setLocation] = useState("Punjab");
  const [searchVal, setSearchVal] = useState("Punjab");
  const [forecastData, setForecastData] = useState<any[]>(DEFAULT_FORECAST);
  const [recommendations, setRecommendations] = useState<string[]>([
    "Schedule irrigation after checking rainfall probability.",
    "Avoid pesticide spraying during high wind or rain windows.",
    "Use mulching when temperature exceeds crop comfort range."
  ]);
  const [avgTemp, setAvgTemp] = useState(29.4);
  const [maxRainChance, setMaxRainChance] = useState(62);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadWeather() {
      setLoading(true);
      try {
        const response = await getWeatherForecast(location);
        if (!active) return;
        
        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const formatted = response.forecast.map((item) => {
          const dateObj = new Date(item.date);
          const dayName = isNaN(dateObj.getTime()) ? item.date : daysOfWeek[dateObj.getDay()];
          return {
            day: dayName,
            temp: item.temperature_c,
            rain: item.rainfall_mm,
            rain_prob: Math.round(item.rain_probability * 100)
          };
        });
        
        setForecastData(formatted);
        setRecommendations(response.recommendations);
        
        const totalTemp = response.forecast.reduce((acc, curr) => acc + curr.temperature_c, 0);
        setAvgTemp(Number((totalTemp / response.forecast.length).toFixed(1)));
        
        const maxProb = Math.max(...response.forecast.map(item => item.rain_probability));
        setMaxRainChance(Math.round(maxProb * 100));
      } catch (err) {
        console.warn("Failed to load live weather, falling back to mock:", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadWeather();
    return () => { active = false; };
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      setLocation(searchVal.trim());
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div>
          <h2 className="text-xl font-bold">Weather Intelligence</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Current Zone: <span className="font-semibold text-field">{location}</span></p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search location (e.g. Punjab)"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-sm focus:border-field focus:bg-white dark:border-slate-800 dark:bg-slate-900"
            />
          </div>
          <button type="submit" disabled={loading} className="rounded-lg bg-field px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60">
            {loading ? "Syncing..." : "Sync"}
          </button>
        </form>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50/20 dark:from-slate-900 dark:to-amber-950/10">
          <ThermometerSun className="mb-3 h-8 w-8 text-sunlit" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Avg Temperature</p>
          <p className="mt-2 text-3xl font-bold">{avgTemp} °C</p>
          <p className="mt-1 text-xs text-slate-400">Expected 7-day average</p>
        </Card>
        <Card className="relative overflow-hidden bg-gradient-to-br from-teal-50 to-cyan-50/20 dark:from-slate-900 dark:to-teal-950/10">
          <CloudRain className="mb-3 h-8 w-8 text-canopy" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Peak Rain Chance</p>
          <p className="mt-2 text-3xl font-bold">{maxRainChance}%</p>
          <p className="mt-1 text-xs text-slate-400">Highest daily probability</p>
        </Card>
        <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50/20 dark:from-slate-900 dark:to-green-950/10">
          <Sparkles className="mb-3 h-8 w-8 text-field" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Irrigation Advice</p>
          <p className="mt-2 text-lg font-bold">
            {maxRainChance > 60 ? "Postpone Irrigation" : maxRainChance > 30 ? "Monitor Closely" : "Irrigate Scheduled"}
          </p>
          <p className="mt-1 text-xs text-slate-400">Based on rain thresholds</p>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[2fr_1fr]">
        <Card className="border border-slate-200 dark:border-slate-800">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold">7-Day Weather Forecast Trend</h3>
            <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-950 dark:text-green-300">Live API</span>
          </div>
          <div className="h-80">
            <ResponsiveContainer>
              <LineChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", color: "#fff" }} />
                <Line type="monotone" dataKey="temp" name="Temp (°C)" stroke="#f59e0b" strokeWidth={3} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="rain" name="Rain (mm)" stroke="#0f766e" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="flex flex-col justify-between border border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="mb-4 text-lg font-bold">Agronomic Recommendations</h3>
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/55 p-3 dark:border-slate-800 dark:bg-slate-900/50">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-field/15 text-xs font-bold text-field">{index + 1}</span>
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{rec}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 border-t border-slate-100 pt-4 text-center dark:border-slate-800">
            <p className="text-xs text-slate-400">Recommendations updated dynamically via forecast algorithms.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
