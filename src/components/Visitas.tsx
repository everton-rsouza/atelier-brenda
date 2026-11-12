"use client";

import { Analytics } from "@vercel/analytics/next";

/** Contador de visitas da Vercel — ignora o painel, para contar só visitantes. */
export default function Visitas() {
  return (
    <Analytics
      beforeSend={(evento) => (new URL(evento.url).pathname.startsWith("/painel") ? null : evento)}
    />
  );
}
