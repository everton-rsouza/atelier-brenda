import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Sem as variáveis de ambiente o site roda em "modo demonstração". */
export const supabaseConfigurado = Boolean(url && anonKey);

/** Cliente sem sessão, usado no servidor para ler os dados públicos. */
export function clientePublico(): SupabaseClient {
  return createClient(url!, anonKey!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

let navegador: SupabaseClient | null = null;

/** Cliente do navegador, com login — usado no painel. */
export function clienteNavegador(): SupabaseClient {
  if (!navegador) navegador = createClient(url!, anonKey!);
  return navegador;
}

export const BUCKET = "imagens";
