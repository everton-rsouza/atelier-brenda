"use client";

import { useEffect, useRef, useState } from "react";
import { clienteNavegador } from "@/lib/supabase";
import { apagarImagem, celebrar, enviarImagem, publicarMudancas } from "@/lib/painel";
import type { Foto, Site } from "@/lib/types";
import SeletorImagem from "./SeletorImagem";
import { botaoPrincipal, botaoSecundario, campo } from "./estilos";

export default function AbaSobre() {
  const [site, setSite] = useState<Site | null>(null);
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [novaFotoPerfil, setNovaFotoPerfil] = useState<File | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [enviandoFotos, setEnviandoFotos] = useState(false);
  const [aviso, setAviso] = useState("");
  const inputFotos = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const supabase = clienteNavegador();
    supabase.from("site").select("*").eq("id", 1).single().then(({ data }) => setSite(data as Site));
    supabase.from("fotos").select("*").order("ordem").then(({ data }) => setFotos(data ?? []));
  }, []);

  function mostrarAviso(t: string) {
    setAviso(t);
    setTimeout(() => setAviso(""), 3500);
  }

  async function salvar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const texto = (k: string) => String(f.get(k) ?? "").trim() || null;
    setSalvando(true);
    try {
      let foto_url = site?.foto_url ?? null;
      if (novaFotoPerfil) foto_url = await enviarImagem(novaFotoPerfil, "atelier");
      const dados = {
        nome: texto("nome") ?? "Brenda Brito",
        frase: texto("frase"),
        historia: texto("historia"),
        email: texto("email"),
        instagram: texto("instagram"),
        whatsapp: texto("whatsapp"),
        foto_url,
      };
      const { error } = await clienteNavegador().from("site").update(dados).eq("id", 1);
      if (error) throw new Error(error.message);
      if (novaFotoPerfil && site?.foto_url) await apagarImagem(site.foto_url);
      setSite({ ...site!, ...dados });
      setNovaFotoPerfil(null);
      await publicarMudancas();
      celebrar();
      mostrarAviso("Tudo salvo ✦");
    } catch (err) {
      mostrarAviso(err instanceof Error ? err.message : "Algo deu errado.");
    }
    setSalvando(false);
  }

  async function adicionarFotos(lista: FileList | null) {
    if (!lista?.length) return;
    setEnviandoFotos(true);
    const supabase = clienteNavegador();
    let ordem = fotos.length;
    for (const arq of Array.from(lista)) {
      try {
        const url = await enviarImagem(arq, "atelier");
        const { data } = await supabase.from("fotos").insert({ url, ordem: ++ordem }).select().single();
        if (data) setFotos((l) => [...l, data as Foto]);
      } catch (err) {
        mostrarAviso(err instanceof Error ? err.message : "Falha ao enviar foto.");
      }
    }
    setEnviandoFotos(false);
    await publicarMudancas();
    celebrar();
  }

  async function legendar(foto: Foto, legenda: string) {
    if ((foto.legenda ?? "") === legenda) return;
    setFotos((l) => l.map((x) => (x.id === foto.id ? { ...x, legenda } : x)));
    await clienteNavegador().from("fotos").update({ legenda: legenda || null }).eq("id", foto.id);
    await publicarMudancas();
  }

  async function removerFoto(foto: Foto) {
    setFotos((l) => l.filter((x) => x.id !== foto.id));
    await clienteNavegador().from("fotos").delete().eq("id", foto.id);
    await apagarImagem(foto.url);
    await publicarMudancas();
  }

  if (!site) return <p className="text-suave">Carregando…</p>;

  return (
    <div className="space-y-16">
      {aviso && (
        <p className="surgir rounded-lg border border-ouro/30 bg-ouro/10 px-4 py-3 text-sm text-ouro-2">{aviso}</p>
      )}

      <form onSubmit={salvar} className="grid gap-8 md:grid-cols-[2fr_3fr]">
        <div className="mx-auto w-full max-w-xs">
          <SeletorImagem atual={site.foto_url} aoEscolher={setNovaFotoPerfil} rotulo="Sua foto" redonda />
        </div>
        <div className="space-y-4">
          <label className="block text-sm text-suave">
            Nome artístico
            <input name="nome" defaultValue={site.nome} className={campo} />
          </label>
          <label className="block text-sm text-suave">
            Frase da página inicial
            <input name="frase" defaultValue={site.frase ?? ""} placeholder="Pinturas, silêncio e céus estrelados." className={campo} />
          </label>
          <label className="block text-sm text-suave">
            Sua história
            <textarea
              name="historia"
              rows={10}
              defaultValue={site.historia ?? ""}
              placeholder="Conte como tudo começou… (deixe uma linha em branco entre os parágrafos)"
              className={campo}
            />
          </label>

          <p className="pt-4 font-display text-2xl italic">Contato</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block text-sm text-suave">
              Email
              <input name="email" type="email" defaultValue={site.email ?? ""} className={campo} />
            </label>
            <label className="block text-sm text-suave">
              Instagram
              <input name="instagram" defaultValue={site.instagram ?? ""} placeholder="@atelierbrenda" className={campo} />
            </label>
            <label className="block text-sm text-suave">
              WhatsApp
              <input name="whatsapp" inputMode="tel" defaultValue={site.whatsapp ?? ""} placeholder="(11) 99999-9999" className={campo} />
            </label>
          </div>
          <button disabled={salvando} className={`${botaoPrincipal} mt-2`}>
            {salvando ? "Salvando…" : "Salvar"}
          </button>
        </div>
      </form>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl italic">Fotos do ateliê</h2>
            <p className="text-sm text-suave">Aparecem na página História. Você pode escolher várias de uma vez.</p>
          </div>
          <button onClick={() => inputFotos.current?.click()} disabled={enviandoFotos} className={botaoSecundario}>
            {enviandoFotos ? "Enviando…" : "+ Adicionar fotos"}
          </button>
          <input ref={inputFotos} type="file" accept="image/*" multiple hidden onChange={(e) => adicionarFotos(e.target.files)} />
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {fotos.map((f) => (
            <div key={f.id} className="group relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.url} alt="" className="aspect-square w-full rounded-lg object-cover" />
              <button
                onClick={() => removerFoto(f)}
                className="absolute right-2 top-2 rounded-full bg-noite/80 px-2 py-0.5 text-xs transition hover:text-erro sm:opacity-0 sm:group-hover:opacity-100"
                aria-label="Remover foto"
              >
                ✕
              </button>
              <input
                defaultValue={f.legenda ?? ""}
                placeholder="Legenda (opcional)"
                onBlur={(e) => legendar(f, e.target.value.trim())}
                className="mt-2 w-full bg-transparent text-sm text-suave outline-none placeholder:text-suave/40 focus:text-tinta"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
