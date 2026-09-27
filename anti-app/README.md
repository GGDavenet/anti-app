# Anti

Sito AI con login persistente vero (email/password via Supabase), interfaccia ispirata a Claude.

## 1. Crea il progetto Supabase (gratuito)

1. Vai su https://supabase.com → crea un nuovo progetto.
2. In **Project Settings → API** copia `Project URL` e `anon public key`.
3. In **Authentication → Providers** verifica che "Email" sia attivo.
   (Puoi disattivare "Confirm email" in fase di test, per accedere subito dopo la registrazione.)

## 2. Configura il progetto in locale

```bash
npm install
cp .env.example .env
```

Apri `.env` e incolla `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.

```bash
npm run dev
```

Apri l'indirizzo mostrato in terminale: dovresti vedere la schermata di login di Anti.
Registrati una volta, poi chiudi e riapri il browser: **resterai loggato**, perché
`src/supabaseClient.js` salva la sessione con `persistSession: true`.

## 3. Collegare una vera AI (opzionale, per ora risponde con un errore)

`src/components/ChatPage.jsx` chiama una Supabase Edge Function chiamata `chat`, che
non esiste ancora. Per farla funzionare:

1. Scegli un provider AI (es. Anthropic, OpenAI) e prendi una API key.
2. Crea una Edge Function su Supabase (`supabase functions new chat`) che riceve i
   messaggi, chiama l'API del provider usando la chiave salvata come secret su
   Supabase (mai nel codice del sito), e restituisce `{ reply: "..." }`.
3. Fai il deploy della funzione (`supabase functions deploy chat`).

Questo passaggio è necessario perché una chiave AI non deve mai stare nel codice
che gira nel browser: chiunque potrebbe copiarla e usarla a tue spese.

## 4. Metti online il sito

Il modo più semplice è **Vercel** o **Netlify**:

1. Carica questa cartella su GitHub.
2. Su Vercel/Netlify collega il repository.
3. Nelle impostazioni del progetto imposta le stesse variabili di `.env`
   (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
4. Deploy: otterrai un indirizzo pubblico dove chiunque potrà registrarsi e
   accedere con la propria email, con l'accesso che resta salvato.

## Struttura

```
src/
  supabaseClient.js     ← connessione a Supabase (auth persistente)
  App.jsx                ← decide se mostrare login o chat
  components/
    AuthPage.jsx          ← login / registrazione
    Sidebar.jsx            ← sidebar in stile Claude, brand "Anti"
    ChatPage.jsx            ← interfaccia di chat
```
