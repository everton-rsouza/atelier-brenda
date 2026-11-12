"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Session } from "@supabase/supabase-js";
import { clienteNavegador, supabaseConfigurado } from "@/lib/supabase";
import AbaObras from "@/components/painel/AbaObras";
import AbaSobre from "@/components/painel/AbaSobre";
import { campo, botaoPrincipal } from "@/components/painel/estilos";

export default function Painel() {
  if (!supabaseConfigurado) return <SemSupabase />;
  return <PainelConectado />;
}

function PainelConectado() {
  const [sessao, setSessao] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    const supabase = clienteNavegador();
    supabase.auth.getSession().then(({ data }) => setSessao(data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSessao(s));
    return () => data.subscription.unsubscribe();
  }, []);

  if (sessao === undefined) return <p className="py-40 text-center text-suave">✦</p>;
  if (!sessao) return <Login />;
  return <Mesa email={sessao.user.email ?? ""} />;
}

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [entrando, setEntrando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setEntrando(true);
    setErro("");
    const { error } = await clienteNavegador().auth.signInWithPassword({ email, password: senha });
    if (error) setErro("Email ou senha incorretos.");
    setEntrando(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <form onSubmit={entrar} className="surgir w-full max-w-sm rounded-2xl border border-white/10 bg-noite-2/80 p-8 backdrop-blur">
        <p className="text-center text-3xl text-ouro">☾</p>
        <h1 className="mt-2 text-center font-display text-4xl italic">Bem-vinda ao ateliê</h1>
        <p className="mt-2 text-center text-sm text-suave">Entre para cuidar das suas obras.</p>
        <label className="mt-8 block text-sm text-suave">
          Email
          <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={campo} />
        </label>
        <label className="mt-4 block text-sm text-suave">
          Senha
          <input type="password" required autoComplete="current-password" value={senha} onChange={(e) => setSenha(e.target.value)} className={campo} />
        </label>
        {erro && <p className="mt-4 text-sm text-red-300">{erro}</p>}
        <button disabled={entrando} className={`${botaoPrincipal} mt-6 w-full`}>
          {entrando ? "Entrando…" : "Entrar"}
        </button>
        <Link href="/" className="mt-6 block text-center text-sm text-suave hover:text-ouro-2">
          ← Voltar ao site
        </Link>
      </form>
    </div>
  );
}

function Mesa({ email }: { email: string }) {
  // Atalhos vindos do botão "Editar" do site: ?aba=sobre ou ?obra=<id>
  const [atalho] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.size) window.history.replaceState(null, "", "/painel");
    return { aba: p.get("aba"), obra: p.get("obra") };
  });
  const [aba, setAba] = useState<"obras" | "sobre">(atalho.aba === "sobre" ? "sobre" : "obras");
  const saudacao = (() => {
    const h = new Date().getHours();
    return h < 5 ? "Boa madrugada" : h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
  })();

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-8 sm:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-suave">Painel do ateliê</p>
          <h1 className="font-display text-4xl italic">{saudacao} ✦</h1>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/" target="_blank" className="text-suave hover:text-ouro-2">Ver o site ↗</Link>
          <button onClick={() => clienteNavegador().auth.signOut()} className="text-suave hover:text-ouro-2" title={email}>
            Sair
          </button>
        </div>
      </header>

      <nav className="mt-8 flex gap-2 border-b border-white/10">
        {([
          ["obras", "Obras"],
          ["sobre", "História & contato"],
        ] as const).map(([id, rotulo]) => (
          <button
            key={id}
            onClick={() => setAba(id)}
            className={`-mb-px border-b-2 px-4 py-3 text-sm transition ${
              aba === id ? "border-ouro text-tinta" : "border-transparent text-suave hover:text-tinta"
            }`}
          >
            {rotulo}
          </button>
        ))}
      </nav>

      <div className="mt-8">{aba === "obras" ? <AbaObras obraInicial={atalho.obra} /> : <AbaSobre />}</div>
    </div>
  );
}

function SemSupabase() {
  return (
    <div className="mx-auto max-w-xl px-5 py-32 text-center">
      <p className="text-4xl text-ouro">☾</p>
      <h1 className="mt-4 font-display text-4xl italic">Quase lá!</h1>
      <p className="mt-4 text-suave">
        O painel vai funcionar assim que o Supabase for configurado. Por enquanto o site mostra obras de exemplo.
        Veja o passo a passo no arquivo <code className="text-ouro-2">README.md</code>.
      </p>
      <Link href="/" className="mt-8 inline-block text-ouro hover:text-ouro-2">← Voltar ao site</Link>
    </div>
  );
}
