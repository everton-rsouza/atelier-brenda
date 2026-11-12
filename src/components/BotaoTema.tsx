"use client";

/** Alterna entre noite (padrão) e dia, e lembra a escolha do visitante. */
export default function BotaoTema({ className = "" }: { className?: string }) {
  function alternar() {
    const raiz = document.documentElement;
    const dia = raiz.dataset.tema !== "dia";
    raiz.classList.add("trocando-tema");
    if (dia) raiz.dataset.tema = "dia";
    else delete raiz.dataset.tema;
    try {
      localStorage.setItem("tema", dia ? "dia" : "noite");
    } catch {}
    setTimeout(() => raiz.classList.remove("trocando-tema"), 700);
  }

  return (
    <button
      type="button"
      onClick={alternar}
      title="Trocar entre noite e dia"
      aria-label="Trocar entre modo noite e modo dia"
      className={`grid h-9 w-9 place-items-center rounded-full border border-linha/15 text-base text-suave transition hover:rotate-12 hover:border-ouro/60 hover:text-ouro-2 ${className}`}
    >
      {/* O ícone mostra para onde vai: de noite aparece o sol, de dia a lua */}
      <span className="so-noite" aria-hidden="true">☀</span>
      <span className="so-dia" aria-hidden="true">☾</span>
    </button>
  );
}
