import { FormEvent, useState } from "react";
import { Bot, Send } from "lucide-react";
import { Card } from "../components/ui/Card";
import { api } from "../services/api";

interface Message {
  role: "user" | "assistant";
  text: string;
}

export function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Ask about crop selection, pest prevention, irrigation, or fertilizer planning." }
  ]);

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const text = String(form.get("message"));
    if (!text.trim()) return;
    setMessages((items) => [...items, { role: "user", text }]);
    event.currentTarget.reset();
    try {
      const { data } = await api.post("/chat", { message: text, language: "en" });
      setMessages((items) => [...items, { role: "assistant", text: data.answer }]);
    } catch {
      setMessages((items) => [...items, { role: "assistant", text: "Demo advice: scout leaves, check soil moisture, and align spraying with dry weather windows." }]);
    }
  }

  return (
    <Card className="mx-auto max-w-4xl">
      <div className="mb-5 flex items-center gap-3">
        <Bot className="text-field" />
        <h2 className="text-xl font-semibold">AI Agriculture Chatbot</h2>
      </div>
      <div className="h-[520px] space-y-3 overflow-y-auto rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
        {messages.map((message, index) => (
          <div key={index} className={message.role === "user" ? "text-right" : "text-left"}>
            <span className={`inline-block max-w-[78%] rounded-lg px-4 py-3 ${message.role === "user" ? "bg-field text-white" : "bg-white text-slate-800 shadow-sm dark:bg-slate-800 dark:text-slate-100"}`}>
              {message.text}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={send} className="mt-4 flex gap-2">
        <input name="message" placeholder="Ask for farming advice..." className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-3 dark:border-slate-700 dark:bg-slate-900" />
        <button className="rounded-lg bg-field px-4 text-white" aria-label="Send"><Send size={18} /></button>
      </form>
    </Card>
  );
}
