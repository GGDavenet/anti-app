import React, { useState, useRef, useEffect } from "react";
import Sidebar from "./Sidebar.jsx";
import { supabase } from "../supabaseClient";

export default function ChatPage({ session }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    const userMsg = { role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setSending(true);

    try {
      const reply = await getAIResponse([...messages, userMsg]);
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Non sono riuscito a contattare l'AI. Controlla la funzione getAIResponse in src/components/ChatPage.jsx.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex h-screen bg-[#0d0d0f]">
      <Sidebar userEmail={session.user.email} />

      <main className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto px-6 py-8">
          {messages.length === 0 && (
            <div className="h-full flex items-center justify-center text-[#6b6b6f] text-sm">
              Scrivi un messaggio per iniziare a parlare con Anti.
            </div>
          )}
          <div className="max-w-2xl mx-auto space-y-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`text-sm leading-relaxed ${
                  m.role === "user" ? "text-white" : "text-[#D8D8D8]"
                }`}
              >
                <span className="text-[11px] uppercase tracking-wide text-[#6b6b6f] block mb-1">
                  {m.role === "user" ? "Tu" : "Anti"}
                </span>
                {m.content}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </div>

        <form
          onSubmit={handleSend}
          className="border-t border-white/5 px-6 py-4"
        >
          <div className="max-w-2xl mx-auto flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Scrivi ad Anti…"
              className="flex-1 rounded-lg bg-[#18181b] border border-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-white/30 transition-colors"
            />
            <button
              type="submit"
              disabled={sending}
              className="rounded-lg bg-white/10 hover:bg-white/15 transition-colors duration-150 text-white text-sm font-medium px-4 py-2.5 disabled:opacity-50"
            >
              {sending ? "…" : "Invia"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

// Punto in cui collegare l'AI vera. Per non esporre la chiave dell'API
// nel browser, il modo corretto è chiamare una Supabase Edge Function
// (o un altro piccolo server) che tiene la chiave al sicuro e a sua volta
// chiama il provider AI che scegli. Qui sotto un esempio di chiamata
// a una Edge Function chiamata "chat" — va creata separatamente su Supabase.
async function getAIResponse(history) {
  const { data, error } = await supabase.functions.invoke("chat", {
    body: { messages: history },
  });

  if (error) throw error;
  return data.reply;
}
