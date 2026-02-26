import { createBrowserClient } from '@supabase/ssr'

let client: ReturnType<typeof createBrowserClient> | undefined;

export function createClient() {
  if (client) return client;

  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be defined");
  }

  client = createBrowserClient(url, key);
  
  return client;
}
