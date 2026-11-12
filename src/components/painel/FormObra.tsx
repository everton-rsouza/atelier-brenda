"use client";

import { useState } from "react";
import { clienteNavegador } from "@/lib/supabase";
import { apagarImagem, enviarImagem, publicarMudancas } from "@/lib/painel";
import type { Obra } from "@/lib/types";
import SeletorImagem from "./SeletorImagem";
import { botaoPrincipal, botaoSecundario, campo } from "./estilos";

export default function FormObra({
  obra,
  proximaOrdem,
  aoCancelar,
  aoSalvar,
}: {
  obra: Obra | null;
  proximaOrdem: number;
  aoCancelar: () => void;
  aoSalvar: (nova: boolean) => void;
}) {
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  async function salvar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const texto = (k: string) => String(f.get(k) ?? "").trim() || null;

    if (!obra && !arquivo) {
      setErro("Escolha a foto da obra.");
      return;
    }
    setSalvando(true);
    setErro("");
    try {
      let imagem_url = obra?.imagem_url ?? null;
      if (arquivo) imagem_url = await enviarImagem(arquivo, "obras");

      const dados = {
        titulo: texto("titulo") ?? "Sem título",
        descricao: texto("descricao"),
        tecnica: texto("tecnica"),
        serie: texto("serie"),
        ano: texto("ano") ? Number(texto("ano")) : null,
        dimensoes: texto("dimensoes"),
        destaque: f.get("destaque") === "on",
        publicado: f.get("publicado") === "on",
        imagem_url,
      };

      const supabase = clienteNavegador();
      const { error } = obra
        ? await supabase.from("obras").update(dados).eq("id", obra.id)
        : await supabase.from("obras").insert({ ...dados, ordem: proximaOrdem });
      if (error) throw new Error(error.message);

      if (arquivo && obra?.imagem_url) await apagarImagem(obra.imagem_url);
      await publicarMudancas();
      aoSalvar(!obra);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Algo deu errado. Tente de novo.");
      setSalvando(false);
    }
  }

  return (
    <form onSubmit={salvar} className="surgir grid gap-8 md:grid-cols-[2fr_3fr]">
      <SeletorImagem atual={obra?.imagem_url ?? null} aoEscolher={setArquivo} rotulo="Foto da obra" />

      <div className="space-y-4">
        <h2 className="font-display text-3xl italic">{obra ? "Editar obra" : "Nova obra"}</h2>
        <label className="block text-sm text-suave">
          Título *
          <input name="titulo" required defaultValue={obra?.titulo} placeholder="Ex.: Lua sobre o campo" className={campo} />
        </label>
        <label className="block text-sm text-suave">
          Sobre a obra
          <textarea name="descricao" rows={4} defaultValue={obra?.descricao ?? ""} placeholder="O que inspirou, o que ela significa…" className={campo} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-suave">
            Técnica
            <input name="tecnica" list="tecnicas" defaultValue={obra?.tecnica ?? ""} placeholder="Óleo sobre tela" className={campo} />
          </label>
          <label className="block text-sm text-suave">
            Série / categoria
            <input name="serie" defaultValue={obra?.serie ?? ""} placeholder="Noturnos" className={campo} />
          </label>
          <label className="block text-sm text-suave">
            Ano
            <input name="ano" type="number" inputMode="numeric" min={1900} max={2100} defaultValue={obra?.ano ?? new Date().getFullYear()} className={campo} />
          </label>
          <label className="block text-sm text-suave">
            Dimensões
            <input name="dimensoes" defaultValue={obra?.dimensoes ?? ""} placeholder="40 × 60 cm" className={campo} />
          </label>
        </div>
        <datalist id="tecnicas">
          {["Óleo sobre tela", "Acrílica sobre tela", "Aquarela", "Guache", "Nanquim", "Grafite", "Pastel", "Técnica mista", "Arte digital", "Colagem", "Escultura", "Cerâmica"].map((t) => (
            <option key={t} value={t} />
          ))}
        </datalist>

        <div className="flex flex-wrap gap-6 pt-2 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="publicado" defaultChecked={obra?.publicado ?? true} className="h-4 w-4 accent-ouro" />
            Visível no site
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="destaque" defaultChecked={obra?.destaque ?? false} className="h-4 w-4 accent-ouro" />
            ★ Destaque na página inicial
          </label>
        </div>

        {erro && <p className="text-sm text-erro">{erro}</p>}

        <div className="flex flex-wrap gap-3 pt-4">
          <button disabled={salvando} className={botaoPrincipal}>
            {salvando ? "Salvando…" : obra ? "Salvar alterações" : "Publicar obra ✦"}
          </button>
          <button type="button" onClick={aoCancelar} disabled={salvando} className={botaoSecundario}>
            Cancelar
          </button>
        </div>
      </div>
    </form>
  );
}
