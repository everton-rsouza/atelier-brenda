"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Estrela = { x: number; y: number; r: number; fase: number; vel: number; prof: number; dourada: boolean };

/**
 * Céu de fundo: estrelas que piscam, se mexem com o mouse (ou com a inclinação
 * do celular), redemoinhos discretos à la Van Gogh e uma estrela cadente que,
 * se clicada, leva a uma obra surpresa.
 */
export default function CeuEstrelado({ obraIds }: { obraIds: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const [cadente, setCadente] = useState<{ id: number; top: number; left: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const calmo = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let estrelas: Estrela[] = [];
    let w = 0, h = 0, raf = 0;
    const alvo = { x: 0, y: 0 };
    const atual = { x: 0, y: 0 };

    function criar() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const total = Math.round((w * h) / 4200);
      estrelas = Array.from({ length: total }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() ** 3 * 1.8 + 0.3,
        fase: Math.random() * Math.PI * 2,
        vel: 0.4 + Math.random() * 1.2,
        prof: 0.2 + Math.random() * 0.8,
        dourada: Math.random() < 0.08,
      }));
    }

    function redemoinho(cx: number, cy: number, raio: number, t: number, cor: string) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t);
      ctx.strokeStyle = cor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let a = 0; a < Math.PI * 6; a += 0.08) {
        const rr = (a / (Math.PI * 6)) * raio;
        const px = Math.cos(a) * rr;
        const py = Math.sin(a) * rr * 0.75;
        if (a === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.restore();
    }

    function desenhar(ms: number) {
      const t = ms / 1000;
      atual.x += (alvo.x - atual.x) * 0.04;
      atual.y += (alvo.y - atual.y) * 0.04;
      ctx.clearRect(0, 0, w, h);

      // Redemoinhos bem sutis no céu
      redemoinho(w * 0.78 + atual.x * 10, h * 0.22 + atual.y * 10, Math.min(w, h) * 0.22, t * 0.05, "rgba(120,150,230,0.07)");
      redemoinho(w * 0.18 + atual.x * 6, h * 0.62 + atual.y * 6, Math.min(w, h) * 0.16, -t * 0.04, "rgba(243,197,82,0.05)");

      for (const e of estrelas) {
        const brilho = 0.45 + 0.55 * Math.sin(t * e.vel + e.fase) ** 2;
        const x = e.x + atual.x * 28 * e.prof;
        const y = e.y + atual.y * 28 * e.prof;
        ctx.globalAlpha = brilho * (0.35 + e.prof * 0.65);
        ctx.fillStyle = e.dourada ? "#f7dc8c" : "#e9ecff";
        ctx.beginPath();
        ctx.arc(x, y, e.r, 0, Math.PI * 2);
        ctx.fill();
        if (e.dourada && e.r > 1) {
          // halo das estrelas maiores, como na Noite Estrelada
          ctx.globalAlpha = brilho * 0.18;
          ctx.beginPath();
          ctx.arc(x, y, e.r * 5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      if (!calmo) raf = requestAnimationFrame(desenhar);
    }

    function mouse(ev: PointerEvent) {
      alvo.x = ev.clientX / w - 0.5;
      alvo.y = ev.clientY / h - 0.5;
    }
    function inclinar(ev: DeviceOrientationEvent) {
      if (ev.gamma == null || ev.beta == null) return;
      alvo.x = Math.max(-0.5, Math.min(0.5, ev.gamma / 60));
      alvo.y = Math.max(-0.5, Math.min(0.5, (ev.beta - 40) / 60));
    }

    criar();
    raf = requestAnimationFrame(desenhar);
    window.addEventListener("resize", criar);
    window.addEventListener("pointermove", mouse);
    window.addEventListener("deviceorientation", inclinar);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", criar);
      window.removeEventListener("pointermove", mouse);
      window.removeEventListener("deviceorientation", inclinar);
    };
  }, []);

  // Estrela cadente aparece de tempos em tempos
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: ReturnType<typeof setTimeout>;
    const agendar = () => {
      timer = setTimeout(() => {
        setCadente({ id: Date.now(), top: 5 + Math.random() * 30, left: 55 + Math.random() * 40 });
        agendar();
      }, 9000 + Math.random() * 14000);
    };
    timer = setTimeout(() => {
      setCadente({ id: Date.now(), top: 12, left: 80 });
      agendar();
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  function pegarEstrela() {
    if (obraIds.length === 0) return;
    const id = obraIds[Math.floor(Math.random() * obraIds.length)];
    setCadente(null);
    router.push(`/obras/${id}`);
  }

  return (
    <>
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 -z-10" />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20"
        style={{
          background:
            "radial-gradient(ellipse at 75% 0%, #1b2a66 0%, transparent 55%), radial-gradient(ellipse at 0% 100%, #132048 0%, transparent 50%), #0a0f24",
        }}
      />
      {cadente && (
        <button
          key={cadente.id}
          type="button"
          onClick={pegarEstrela}
          onAnimationEnd={() => setCadente(null)}
          title="Pegue a estrela cadente para ver uma obra surpresa ✨"
          aria-label="Estrela cadente: ver uma obra surpresa"
          className="fixed z-40 h-6 w-40 cursor-pointer"
          style={{ top: `${cadente.top}%`, left: `${cadente.left}%`, animation: "cadente 2.6s ease-in forwards" }}
        >
          <span className="absolute left-0 top-1/2 block h-[2px] w-full -translate-y-1/2 rounded-full bg-gradient-to-r from-ouro-2 via-ouro-2/60 to-transparent" />
          <span className="absolute left-0 top-1/2 block h-2 w-2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_12px_4px_rgba(247,220,140,0.9)]" />
        </button>
      )}
    </>
  );
}
