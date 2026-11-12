"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clienteNavegador, supabaseConfigurado } from "@/lib/supabase";

/**
 * Botão flutuante que só aparece quando a artista está logada.
 * Leva direto para editar o que está na tela.
 */
export default function BotaoEditar() {
  const caminho = usePathname();
  const [logada, setLogada] = useState(false);

  useEffect(() => {
    if (!supabaseConfigurado) return;
    const supabase = clienteNavegador();
    supabase.auth.getSession().then(({ data }) => setLogada(!!data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setLogada(!!s));
    return () => data.subscription.unsubscribe();
  }, []);

  if (!logada) return null;

  const obra = caminho.match(/^\/obras\/([^/]+)$/)?.[1];
  const destino = obra
    ? { href: `/painel?obra=${obra}`, rotulo: "Editar esta obra" }
    : caminho.startsWith("/historia")
      ? { href: "/painel?aba=sobre", rotulo: "Editar história" }
      : { href: "/painel", rotulo: "Ir ao painel" };

  return (
    <Link
      href={destino.href}
      className="surgir fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-ouro/40 bg-noite-2/90 py-2.5 pl-4 pr-5 text-sm text-ouro-2 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur transition hover:bg-ouro hover:text-sobre-ouro"
      style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <span aria-hidden="true">✎</span>
      {destino.rotulo}
    </Link>
  );
}
