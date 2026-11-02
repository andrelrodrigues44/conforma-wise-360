import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarCheck,
  GraduationCap,
  LibraryBig,
  MessageCircle,
  ShieldCheck,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import { WHATSAPP_URL } from "@/components/site/contact";
import { Logo } from "@/components/site/Logo";
import {
  formatarPreco,
  periodo,
  rotuloModalidade,
  urlInscricao,
  useTurmasAbertas,
} from "@/lib/turmas-abertas";

const SITE_URL = "https://www.conforma360.com.br/links";
const title = "André Rodrigues | Links";
const description =
  "Guias, cursos, diagnóstico e plataforma Conforma360. Norma explicada com o item na tela.";

// Links do perfil do Instagram. Cada destino leva a origem "instagram-bio" para medir os cliques.
const HOTMART = "https://go.hotmart.com";
const ORIGEM = "instagram-bio";
const EAD_URL = `https://conforma360.isesmt.com/blog/products?utm_source=instagram&utm_medium=bio&utm_campaign=links`;

type Item = {
  href: string;
  titulo: string;
  detalhe: string;
  icone: LucideIcon;
  externo?: boolean;
};

const itens: Item[] = [
  {
    href: "/#loja",
    titulo: "Guias e planilhas",
    detalhe: "E-books e planilha de Excel de SST e meio ambiente, a partir de R$ 27",
    icone: LibraryBig,
  },
  {
    href: EAD_URL,
    titulo: "Cursos online com certificado",
    detalhe: "Matrícula na hora, certificado com QR Code",
    icone: GraduationCap,
    externo: true,
  },
  {
    href: `${HOTMART}/V108295784G?dp=1&src=${ORIGEM}`,
    titulo: "Diagnóstico Express",
    detalhe: "Análise dos seus documentos, relatório com plano de ação e reunião por vídeo. R$ 297",
    icone: Stethoscope,
    externo: true,
  },
  {
    href: "/",
    titulo: "Conhecer a plataforma Conforma360",
    detalhe: "Inspeções, auditorias, documentos e conformidade legal em um só lugar",
    icone: ShieldCheck,
  },
  {
    href: WHATSAPP_URL,
    titulo: "Falar comigo no WhatsApp",
    detalhe: "Dúvidas, consultoria ou demonstração",
    icone: MessageCircle,
    externo: true,
  },
];

function Botao({ item }: { item: Item }) {
  const Icone = item.icone;
  return (
    <a
      href={item.href}
      {...(item.externo ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      className="group flex items-center gap-4 rounded-2xl border border-border bg-card px-5 py-4 shadow-sm transition hover:border-primary hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icone className="h-5 w-5" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-bold leading-snug text-graphite">{item.titulo}</span>
        <span className="mt-0.5 block text-sm leading-snug text-muted-foreground">
          {item.detalhe}
        </span>
      </span>
      <ArrowRight
        className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary"
        aria-hidden
      />
    </a>
  );
}

export const Route = createFileRoute("/links")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
  }),
  component: LinksPage,
});

function LinksPage() {
  const turma = useTurmasAbertas()[0];

  return (
    <main className="min-h-screen bg-background px-5 py-10">
      <div className="mx-auto flex max-w-md flex-col items-center">
        <Logo />
        <h1 className="mt-8 text-2xl font-extrabold tracking-tight text-graphite">
          André Rodrigues
        </h1>
        <p className="mt-1 text-center text-sm font-medium text-muted-foreground">
          Engenheiro de Meio Ambiente e SST
        </p>
        <p className="mt-3 text-center text-base text-graphite">
          Norma explicada em 40 segundos, com o item na tela.
        </p>

        <div className="mt-8 grid w-full gap-3">
          {turma && (
            <a
              href={urlInscricao(turma, ORIGEM)}
              className="flex items-center gap-4 rounded-2xl bg-primary px-5 py-4 text-primary-foreground shadow-md transition hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
                <CalendarCheck className="h-5 w-5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold uppercase tracking-wider opacity-90">
                  Inscrições abertas
                </span>
                <span className="block text-base font-bold leading-snug">
                  {turma.training_name}
                </span>
                <span className="mt-0.5 block text-sm leading-snug opacity-95">
                  {periodo(turma)} · {rotuloModalidade(turma)} · {formatarPreco(turma.price_cents)}
                </span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </a>
          )}
          {itens.map((item) => (
            <Botao key={item.titulo} item={item} />
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Conteúdo educativo. Confira sempre o texto oficial da norma.
        </p>
      </div>
    </main>
  );
}
