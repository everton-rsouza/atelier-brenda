import type { Metadata } from "next";
import Galeria from "@/components/Galeria";
import { getObras } from "@/lib/data";

export const metadata: Metadata = { title: "Obras" };

export default async function Obras() {
  const obras = await getObras();
  return (
    <section className="mx-auto max-w-6xl px-5 pt-16 sm:px-8">
      <p className="text-xs uppercase tracking-[0.4em] text-suave">Galeria</p>
      <h1 className="mb-12 mt-3 font-display text-5xl italic sm:text-6xl">Obras</h1>
      <Galeria obras={obras} />
    </section>
  );
}
