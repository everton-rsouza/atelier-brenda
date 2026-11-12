"use server";

import { updateTag } from "next/cache";
import { clientePublico, supabaseConfigurado } from "@/lib/supabase";

/**
 * Chamado pelo painel depois de salvar algo: confere se quem chamou está
 * realmente logado e atualiza o site público na hora.
 */
export async function atualizarSite(token: string) {
  if (!supabaseConfigurado) return { ok: false };

  const { data, error } = await clientePublico().auth.getUser(token);
  if (error || !data.user) return { ok: false };

  updateTag("obras");
  updateTag("site");
  return { ok: true };
}
