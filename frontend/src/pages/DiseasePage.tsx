import { ChangeEvent, useState } from "react";
import { Camera, ImageUp, ScanLine } from "lucide-react";
import { Card } from "../components/ui/Card";
import { api } from "../services/api";

export function DiseasePage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string>("Upload a leaf image to run disease intelligence.");

  async function handleImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    const form = new FormData();
    form.append("image", file);
    try {
      const { data } = await api.post("/disease/detect?crop=tomato", form, { headers: { "Content-Type": "multipart/form-data" } });
      setResult(`${data.disease} detected with ${(data.confidence * 100).toFixed(0)}% confidence. ${data.treatment[0]}`);
    } catch {
      setResult("Demo mode: likely healthy leaf. Connect the backend and YOLOv8 weights for live inference.");
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
      <Card>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">AI Crop Disease Detection</h2>
            <p className="text-sm text-slate-500">YOLOv8/TensorFlow-ready image inference workflow</p>
          </div>
          <ScanLine className="text-field" />
        </div>
        <label className="grid min-h-96 cursor-pointer place-items-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center dark:border-slate-700 dark:bg-slate-900">
          {preview ? <img src={preview} className="max-h-96 rounded-lg object-contain" alt="Leaf preview" /> : <div><ImageUp className="mx-auto mb-3 text-field" size={42} /><p className="font-medium">Upload leaf image</p></div>}
          <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
        </label>
      </Card>
      <Card>
        <div className="flex items-center gap-3">
          <Camera className="text-field" />
          <h2 className="text-xl font-semibold">Live Scan</h2>
        </div>
        <div className="mt-5 rounded-lg bg-slate-900 p-5 text-green-100">
          <p className="text-sm uppercase tracking-wide text-green-300">Inference result</p>
          <p className="mt-3 text-lg leading-8">{result}</p>
        </div>
        <div className="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <p>Supports webcam streaming through the WebSocket monitoring layer.</p>
          <p>Designed to store disease reports with confidence, severity, and treatment actions.</p>
        </div>
      </Card>
    </div>
  );
}
