import React, { useState } from "react";
import { supabase } from "../supabaseClient";

export default function AuthPage() {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    const { error } =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (mode === "signup") {
      setInfo(
        "Account creato. Se nel progetto Supabase è attiva la conferma email, controlla la posta prima di accedere."
      );
    }
    // In caso di login riuscito, onAuthStateChange in App.jsx aggiorna la sessione da solo.
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d0f] px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-serif text-white mb-1 text-center">
          Anti
        </h1>
        <p className="text-sm text-[#9B9B9B] text-center mb-6">
          {mode === "login" ? "Accedi al tuo account" : "Crea un account"}
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-[#18181b] border border-white/8 rounded-xl p-5 space-y-3"
        >
          <div>
            <label className="text-xs text-[#9B9B9B] mb-1 block">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md bg-[#0d0d0f] border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-white/30 transition-colors"
              placeholder="tu@esempio.com"
            />
          </div>
          <div>
            <label className="text-xs text-[#9B9B9B] mb-1 block">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md bg-[#0d0d0f] border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-white/30 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}
          {info && <p className="text-xs text-emerald-400">{info}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-white/10 hover:bg-white/15 transition-colors duration-150 text-white text-sm font-medium py-2 disabled:opacity-50"
          >
            {loading
              ? "Un attimo…"
              : mode === "login"
              ? "Accedi"
              : "Registrati"}
          </button>
        </form>

        <p className="text-xs text-[#9B9B9B] text-center mt-4">
          {mode === "login" ? "Non hai un account?" : "Hai già un account?"}{" "}
          <button
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setError(null);
              setInfo(null);
            }}
            className="text-white underline underline-offset-2"
          >
            {mode === "login" ? "Registrati" : "Accedi"}
          </button>
        </p>
      </div>
    </div>
  );
}
