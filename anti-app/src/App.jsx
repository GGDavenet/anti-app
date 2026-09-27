import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import AuthPage from "./components/AuthPage.jsx";
import ChatPage from "./components/ChatPage.jsx";

export default function App() {
  const [session, setSession] = useState(undefined); // undefined = ancora in caricamento

  useEffect(() => {
    // Al primo caricamento, rilegge la sessione salvata (se c'è) dal browser.
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Si aggiorna da solo quando l'utente fa login/logout o il token viene rinnovato.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0d0f] text-[#9B9B9B] text-sm">
        Caricamento…
      </div>
    );
  }

  return session ? (
    <ChatPage session={session} />
  ) : (
    <AuthPage />
  );
}
