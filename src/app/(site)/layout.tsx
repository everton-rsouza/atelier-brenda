import { Suspense } from "react";
import BotaoEditar from "@/components/BotaoEditar";
import Cabecalho from "@/components/Cabecalho";
import Rodape from "@/components/Rodape";
import { getSite } from "@/lib/data";

export default async function LayoutSite({ children }: LayoutProps<"/">) {
  const site = await getSite();
  return (
    <>
      <Cabecalho nome={site.nome} />
      <main className="flex-1">{children}</main>
      <Rodape site={site} />
      {/* Só aparece para a artista logada; depende da URL, então fica num Suspense */}
      <Suspense fallback={null}>
        <BotaoEditar />
      </Suspense>
    </>
  );
}
