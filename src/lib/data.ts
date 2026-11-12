import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { clientePublico, supabaseConfigurado } from "./supabase";
import { fotosDemo, obrasDemo, siteDemo } from "./demo";
import type { Foto, Obra, Site } from "./types";

// Leituras públicas ficam em cache e são atualizadas na hora
// quando a Brenda salva algo no painel (ver app/actions.ts).

export async function getObras(): Promise<Obra[]> {
  "use cache";
  cacheTag("obras");
  cacheLife("hours");
  if (!supabaseConfigurado) return obrasDemo;

  const { data, error } = await clientePublico()
    .from("obras")
    .select("*")
    .eq("publicado", true)
    .order("ordem", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) console.error("Erro ao buscar obras:", error.message);
  return data ?? [];
}

export async function getObra(id: string): Promise<Obra | null> {
  const obras = await getObras();
  return obras.find((o) => o.id === id) ?? null;
}

export async function getSite(): Promise<Site> {
  "use cache";
  cacheTag("site");
  cacheLife("hours");
  if (!supabaseConfigurado) return siteDemo;

  const { data, error } = await clientePublico().from("site").select("*").eq("id", 1).single();
  if (error) console.error("Erro ao buscar site:", error.message);
  return (data as Site) ?? siteDemo;
}

export async function getFotos(): Promise<Foto[]> {
  "use cache";
  cacheTag("site");
  cacheLife("hours");
  if (!supabaseConfigurado) return fotosDemo;

  const { data } = await clientePublico().from("fotos").select("*").order("ordem");
  return data ?? [];
}
