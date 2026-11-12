"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/obras", rotulo: "Obras" },
  { href: "/historia", rotulo: "História" },
  { href: "#contato", rotulo: "Contato" },
];

function Lista({ caminho }: { caminho: string | null }) {
  return (
    <ul className="flex items-center gap-5 text-sm sm:gap-8">
      {links.map((l) => {
        const ativo = !!caminho && l.href !== "#contato" && caminho.startsWith(l.href);
        return (
          <li key={l.href}>
            <Link
              href={l.href}
              className={`relative py-1 transition-colors hover:text-ouro-2 ${ativo ? "text-ouro-2" : "text-suave"}`}
            >
              {l.rotulo}
              {ativo && <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-ouro" />}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function LinksMenu() {
  return <Lista caminho={usePathname()} />;
}

export function LinksEstaticos() {
  return <Lista caminho={null} />;
}
