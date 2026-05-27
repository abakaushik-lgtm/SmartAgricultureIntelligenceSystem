import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sprout } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      if (mode === "login") {
        await signIn(String(form.get("email")), String(form.get("password")));
      } else {
        await signUp({
          name: String(form.get("name")),
          email: String(form.get("email")),
          password: String(form.get("password")),
          role: "farmer",
          region: String(form.get("region"))
        });
      }
      navigate("/dashboard");
    } catch {
      setError("Authentication failed. Check credentials and API availability.");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 dark:bg-slate-950">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-field text-white"><Sprout /></span>
          <div>
            <h1 className="text-2xl font-semibold">{mode === "login" ? "Welcome back" : "Create farmer account"}</h1>
            <p className="text-sm text-slate-500">AgriNexus AI secure access</p>
          </div>
        </div>
        {mode === "signup" && (
          <>
            <input name="name" required placeholder="Full name" className="mb-3 w-full rounded-lg border border-slate-200 px-3 py-3 dark:border-slate-700 dark:bg-slate-950" />
            <input name="region" placeholder="Region" className="mb-3 w-full rounded-lg border border-slate-200 px-3 py-3 dark:border-slate-700 dark:bg-slate-950" />
          </>
        )}
        <input name="email" type="email" required placeholder="Email" className="mb-3 w-full rounded-lg border border-slate-200 px-3 py-3 dark:border-slate-700 dark:bg-slate-950" />
        <input name="password" type="password" required minLength={8} placeholder="Password" className="mb-4 w-full rounded-lg border border-slate-200 px-3 py-3 dark:border-slate-700 dark:bg-slate-950" />
        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
        <button className="w-full rounded-lg bg-field px-4 py-3 font-semibold text-white">{mode === "login" ? "Login" : "Sign up"}</button>
      </form>
    </main>
  );
}
