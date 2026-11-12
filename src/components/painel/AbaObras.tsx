"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { clienteNavegador } from "@/lib/supabase";
import { apagarImagem, celebrar, publicarMudancas } from "@/lib/painel";
import type { Obra } from "@/lib/types";
import FormObra from "./FormObra";
import { botaoPrincipal } from "./estilos";

export default function AbaObras({ obraInicial }: { obraInicial?: string | null }) {
  const [obras, setObras] = useState<Obra[] | null>(null);
  const [editando, setEditando] = useState<Obra | "nova" | null>(null);
  const abriuInicial = useRef(false);
  const [confirmarExclusao, setConfirmarExclusao] = useState<string | null>(null);
  const [aviso, setAviso] = useState("");
  const arrastando = useRef<number | null>(null);

  const carregar = useCallback(async () => {
    const { data, error } = await clienteNavegador()
      .from("obras")
      .select("*")
      .order("ordem")
      .order("created_at", { ascending: false });
    if (error) setAviso(`Erro ao carregar: ${error.message}`);
    setObras(data ?? []);
    // Veio do botão "Editar esta obra" no site: abre a obra direto
    if (obraInicial && !abriuInicial.current) {
      abriuInicial.current = true;
      const alvo = data?.find((o) => o.id === obraInicial);
      if (alvo) setEditando(alvo);
    }
  }, [obraInicial]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    carregar();
  }, [carregar]);

  function mostrarAviso(t: string) {
    setAviso(t);
    setTimeout(() => setAviso(""), 3500);
  }

  async function alternar(obra: Obra, campo: "destaque" | "publicado") {
    const valor = !obra[campo];
    setObras((l) => l!.map((o) => (o.id === obra.id ? { ...o, [campo]: valor } : o)));
    await clienteNavegador().from("obras").update({ [campo]: valor }).eq("id", obra.id);
    await publicarMudancas();
  }

  async function excluir(obra: Obra) {
    setConfirmarExclusao(null);
    setObras((l) => l!.filter((o) => o.id !== obra.id));
    await clienteNavegador().from("obras").delete().eq("id", obra.id);
    await apagarImagem(obra.imagem_url);
    await publicarMudancas();
    mostrarAviso(`“${obra.titulo}” foi removida.`);
  }

  async function salvarOrdem(lista: Obra[]) {
    const atualizada = lista.map((o, i) => ({ ...o, ordem: i + 1 }));
    setObras(atualizada);
    const supabase = clienteNavegador();
    await Promise.all(atualizada.map((o) => supabase.from("obras").update({ ordem: o.ordem }).eq("id", o.id)));
    await publicarMudancas();
  }

  function mover(de: number, para: number) {
    if (!obras || para < 0 || para >= obras.length || de === para) return;
    const lista = [...obras];
    const [item] = lista.splice(de, 1);
    lista.splice(para, 0, item);
    salvarOrdem(lista);
  }

  if (editando) {
    return (
      <FormObra
        obra={editando === "nova" ? null : editando}
        proximaOrdem={(obras?.length ?? 0) + 1}
        aoCancelar={() => setEditando(null)}
        aoSalvar={async (nova) => {
          setEditando(null);
          await carregar();
          celebrar();
          mostrarAviso(nova ? "Obra publicada! ✦" : "Alterações salvas ✦");
        }}
      />
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-suave">
          {obras === null ? "Carregando…" : `${obras.length} ${obras.length === 1 ? "obra" : "obras"} no ateliê`}
        </p>
        <button onClick={() => setEditando("nova")} className={botaoPrincipal}>
          + Nova obra
        </button>
      </div>

      {aviso && (
        <p className="surgir mt-6 rounded-lg border border-ouro/30 bg-ouro/10 px-4 py-3 text-sm text-ouro-2">{aviso}</p>
      )}

      {obras?.length === 0 && (
        <button
          onClick={() => setEditando("nova")}
          className="mt-8 flex w-full flex-col items-center rounded-2xl border-2 border-dashed border-linha/15 py-20 text-suave transition hover:border-ouro/50 hover:text-ouro-2"
        >
          <span className="text-4xl">✦</span>
          <span className="mt-3">Comece postando a primeira obra</span>
        </button>
      )}

      {obras && obras.length > 1 && (
        <p className="mt-6 text-xs text-suave/70">Dica: arraste as obras (ou use as setas) para mudar a ordem no site.</p>
      )}

      <ul className="mt-4 space-y-3">
        {obras?.map((o, i) => (
          <li
            key={o.id}
            draggable
            onDragStart={() => (arrastando.current = i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (arrastando.current !== null) mover(arrastando.current, i);
              arrastando.current = null;
            }}
            className={`flex items-center gap-3 rounded-xl border border-linha/10 bg-noite-2/70 p-3 backdrop-blur transition hover:border-linha/20 sm:gap-4 ${
              o.publicado ? "" : "opacity-60"
            }`}
          >
            <div className="flex flex-col text-suave">
              <button onClick={() => mover(i, i - 1)} disabled={i === 0} className="px-1 hover:text-ouro disabled:opacity-20" aria-label="Subir">▲</button>
              <button onClick={() => mover(i, i + 1)} disabled={i === obras.length - 1} className="px-1 hover:text-ouro disabled:opacity-20" aria-label="Descer">▼</button>
            </div>
            <div className="h-16 w-14 shrink-0 cursor-grab overflow-hidden rounded-md bg-noite-3">
              {o.imagem_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={o.imagem_url} alt="" className="h-full w-full object-cover" />
              )}
            </div>
            <button onClick={() => setEditando(o)} className="min-w-0 flex-1 text-left">
              <p className="truncate font-display text-xl">{o.titulo}</p>
              <p className="truncate text-xs text-suave">
                {[o.tecnica, o.serie, o.ano].filter(Boolean).join(" · ") || "Sem detalhes"}
                {!o.publicado && " · rascunho"}
              </p>
            </button>
            <button
              onClick={() => alternar(o, "destaque")}
              title={o.destaque ? "Em destaque na página inicial" : "Colocar em destaque"}
              className={`text-xl transition ${o.destaque ? "text-ouro drop-shadow-[0_0_6px_rgba(243,197,82,.8)]" : "text-linha/20 hover:text-ouro/70"}`}
            >
              ★
            </button>
            <button
              onClick={() => alternar(o, "publicado")}
              title={o.publicado ? "Visível no site — clique para esconder" : "Escondida — clique para publicar"}
              className="text-lg text-suave hover:text-tinta"
            >
              {o.publicado ? "◉" : "○"}
            </button>
            {confirmarExclusao === o.id ? (
              <span className="flex items-center gap-2 text-xs">
                <button onClick={() => excluir(o)} className="rounded-full bg-red-400/90 px-3 py-1 text-sobre-ouro">Excluir</button>
                <button onClick={() => setConfirmarExclusao(null)} className="text-suave">Não</button>
              </span>
            ) : (
              <button onClick={() => setConfirmarExclusao(o.id)} className="text-suave hover:text-erro" aria-label="Excluir obra">
                ✕
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
