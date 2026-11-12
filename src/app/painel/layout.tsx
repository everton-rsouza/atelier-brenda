import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Painel",
  robots: { index: false, follow: false },
};

export default function LayoutPainel({ children }: LayoutProps<"/painel">) {
  return <main className="flex-1">{children}</main>;
}
