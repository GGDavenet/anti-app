import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Mancano VITE_SUPABASE_URL e/o VITE_SUPABASE_ANON_KEY. Copia .env.example in .env e inserisci i valori dal tuo progetto Supabase."
  );
}

// Un unico client, creato una sola volta: persistSession + autoRefreshToken
// sono la parte che fa restare l'accesso salvato tra una visita e l'altra.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: "anti-auth",
  },
});
