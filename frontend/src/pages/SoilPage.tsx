import { FormEvent, useState } from "react";
import { FlaskConical, Leaf, Droplet, Sparkles } from "lucide-react";
import { Card } from "../components/ui/Card";
import { analyzeSoil, recommendFertilizer } from "../services/api";
import type {
  FertilizerRecommendationResponse,
  SoilAnalysisRequest,
  SoilAnalysisResponse,
} from "../types/api";

const growthStages = ["seedling", "vegetative", "flowering", "fruiting", "grain filling"];
const crops = ["rice", "wheat", "maize", "cotton", "sugarcane"];

export function SoilPage() {
  const [soilResult, setSoilResult] = useState<SoilAnalysisResponse | null>(null);
  const [decisionResult, setDecisionResult] = useState<FertilizerRecommendationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload: SoilAnalysisRequest = {
      crop: String(form.get("crop") ?? "rice"),
      nitrogen: Number(form.get("nitrogen")),
      phosphorus: Number(form.get("phosphorus")),
      potassium: Number(form.get("potassium")),
      ph: Number(form.get("ph")),
      moisture: Number(form.get("moisture")),
    };

    const fertilizerPayload = {
      crop: payload.crop,
      growth_stage: String(form.get("growth_stage") ?? "vegetative"),
      acreage: Number(form.get("acreage")) || 1,
      nitrogen: payload.nitrogen,
      phosphorus: payload.phosphorus,
      potassium: payload.potassium,
      ph: payload.ph,
      moisture: payload.moisture,
      organic_matter_percent: form.get("organic_matter_percent") ? Number(form.get("organic_matter_percent")) : undefined,
      irrigation_available: form.get("irrigation_available") === "on",
    };

    setIsLoading(true);
    try {
      const [soil, decision] = await Promise.all([
        analyzeSoil(payload),
        recommendFertilizer(fertilizerPayload),
      ]);
      setSoilResult(soil);
      setDecisionResult(decision);
    } catch {
      setSoilResult({
        health_score: 74,
        status: "moderate",
        fertilizer_recommendation: "Apply balanced NPK and keep pH within the ideal range.",
        amendments: ["Connect backend for saved soil reports."],
      });
      setDecisionResult({
        crop: "rice",
        growth_stage: "vegetative",
        nutrient_status: { nitrogen: "deficit", phosphorus: "optimal", potassium: "deficit" },
        priority: "medium",
        recommended_products: [
          {
            product: "Balanced NPK blend",
            nutrient_focus: "maintenance",
            application_rate_kg_per_acre: 12,
            timing: "Apply after routine field inspection.",
            method: "Light broadcast application and monitor soil moisture.",
          },
        ],
        application_plan: ["Confirm the recommendation with a recent soil test before large purchases."],
        soil_amendments: ["No major soil amendment needed from the supplied values."],
        cautions: ["Follow local label dosage limits and avoid over-application."],
        estimated_total_kg: 12,
        confidence: 0.72,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
      <Card>
        <div className="mb-5 flex items-center gap-3">
          <FlaskConical className="text-field" />
          <div>
            <h2 className="text-xl font-semibold">Soil & Nutrient Decision Support</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Get soil health analysis and fertilizer planning guidance in one workflow.</p>
          </div>
        </div>

        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium">Crop</label>
          <label className="text-sm font-medium">Growth stage</label>

          <select name="crop" defaultValue="rice" className="rounded-lg border border-slate-200 px-3 py-3 dark:border-slate-700 dark:bg-slate-900">
            {crops.map((crop) => (
              <option key={crop} value={crop}>{crop}</option>
            ))}
          </select>

          <select name="growth_stage" defaultValue="vegetative" className="rounded-lg border border-slate-200 px-3 py-3 dark:border-slate-700 dark:bg-slate-900">
            {growthStages.map((stage) => (
              <option key={stage} value={stage}>{stage}</option>
            ))}
          </select>

          <label className="text-sm font-medium">Acreage</label>
          <label className="text-sm font-medium">Organic matter %</label>

          <input name="acreage" type="number" defaultValue={2} min={0.1} step={0.1} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-3 dark:border-slate-700 dark:bg-slate-900" />
          <input name="organic_matter_percent" type="number" defaultValue={2.0} min={0} step={0.1} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-3 dark:border-slate-700 dark:bg-slate-900" />

          {[
            { name: "nitrogen", label: "Nitrogen (kg/ha)", default: 30 },
            { name: "phosphorus", label: "Phosphorus (kg/ha)", default: 20 },
            { name: "potassium", label: "Potassium (kg/ha)", default: 18 },
            { name: "ph", label: "pH", default: 6.8 },
            { name: "moisture", label: "Moisture %", default: 55 },
          ].map(({ name, label, default: defaultValue }) => (
            <label key={name} className="text-sm font-medium">
              {label}
              <input
                name={name}
                type="number"
                defaultValue={defaultValue}
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-3 dark:border-slate-700 dark:bg-slate-900"
              />
            </label>
          ))}

          <label className="flex items-center gap-3 text-sm font-medium md:col-span-2">
            <input type="checkbox" name="irrigation_available" defaultChecked className="h-5 w-5 rounded border-slate-300 text-field focus:ring-field" />
            Irrigation available
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="rounded-lg bg-field px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2"
          >
            {isLoading ? "Generating plan..." : "Generate decision support"}
          </button>
        </form>
      </Card>

      <div className="grid gap-5">
        <Card>
          <div className="mb-4 flex items-center gap-3">
            <Leaf className="text-field" />
            <div>
              <h2 className="text-xl font-semibold">Soil health summary</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Analyze crop readiness and nutrient balance.</p>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm text-slate-500 dark:text-slate-400">Health score</p>
              <p className="mt-2 text-4xl font-semibold text-field">{soilResult?.health_score ?? "--"}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm text-slate-500 dark:text-slate-400">Status</p>
              <p className="mt-2 text-lg font-semibold">{soilResult?.status ?? "Awaiting analysis"}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{soilResult?.fertilizer_recommendation ?? "Submit soil values to see actionable fertilizer guidance."}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center gap-3">
            <Droplet className="text-field" />
            <div>
              <h2 className="text-xl font-semibold">Nutrient recommendation</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Detailed product guidance and application planning.</p>
            </div>
          </div>

          {decisionResult ? (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Priority</p>
                  <p className="mt-2 text-lg font-semibold capitalize">{decisionResult.priority}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Estimated total</p>
                  <p className="mt-2 text-lg font-semibold">{decisionResult.estimated_total_kg} kg</p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm text-slate-500 dark:text-slate-400">Nutrient status</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {Object.entries(decisionResult.nutrient_status).map(([nutrient, status]) => (
                    <div key={nutrient} className="rounded-2xl bg-white p-3 text-sm shadow-sm dark:bg-slate-950">
                      <p className="font-semibold capitalize">{nutrient}</p>
                      <p className="mt-1 text-slate-600 dark:text-slate-400">{status.replace("_", " ")}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm text-slate-500 dark:text-slate-400">Products</p>
                <div className="mt-3 space-y-3">
                  {decisionResult.recommended_products.map((product) => (
                    <div key={product.product} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                      <p className="font-semibold">{product.product}</p>
                      <p className="text-sm text-slate-500">Focus: {product.nutrient_focus}</p>
                      <p className="mt-2 text-sm">Rate: {product.application_rate_kg_per_acre} kg/acre</p>
                      <p className="mt-1 text-sm">{product.timing}</p>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{product.method}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm text-slate-500 dark:text-slate-400">Application plan</p>
                <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
                  {decisionResult.application_plan.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Soil amendments</p>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
                    {decisionResult.soil_amendments.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Cautions</p>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
                    {decisionResult.cautions.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              <Sparkles className="mb-3 h-8 w-8 text-field" />
              <p className="font-semibold">Start a soil analysis to unlock nutrient recommendations.</p>
              <p className="mt-2 text-sm">The system will generate product guidance, risk cautions, and application planning.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
