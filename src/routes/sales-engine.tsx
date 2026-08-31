import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle2,
  Clock3,
  Flame,
  KanbanSquare,
  Mail,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/sales-engine")({
  head: () => ({
    meta: [
      { title: "Sales Engine | Conforma360" },
      {
        name: "description",
        content:
          "Centro comercial da Conforma360 para leads, scoring, follow-up, consultoria e plataforma.",
      },
    ],
  }),
  component: SalesEnginePage,
});

const stages: Array<[string, string, string, LucideIcon]> = [
  ["Novos", "18", "Entrada e origem dos leads", Users],
  ["Qualificação", "11", "Contexto e necessidade", Target],
  ["Diagnóstico", "7", "Consultoria técnica", ShieldCheck],
  ["Demonstração", "5", "Plataforma Conforma360", Sparkles],
  ["Proposta", "3", "Oportunidades comerciais", BarChart3],
];

const actions = [
  ["HOT", "3 leads", "Contato comercial em até 48h", "text-destructive"],
  ["WARM", "8 leads", "Qualificação e nutrição", "text-primary"],
  ["REVISAR", "6 conteúdos", "Aguardando aprovação", "text-amber-600"],
];

function SalesEnginePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28">
        <section className="px-5 pb-14 lg:px-8 lg:pb-18">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-bold tracking-[0.15em] text-primary">
                  <Bot className="h-4 w-4" /> CONFORMA360 SALES ENGINE
                </span>
                <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-graphite sm:text-6xl">
                  Marketing que não termina no post. Termina na oportunidade.
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
                  Um centro comercial para transformar conteúdo em leads, leads em conversas e conversas
                  em diagnósticos, demonstrações e vendas — para Consultoria, Plataforma ou ambas.
                </p>
              </div>
              <Button size="lg" className="h-12 shrink-0 px-7">
                <Sparkles className="mr-2 h-4 w-4" /> Executar ciclo IA
              </Button>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-4">
              {([
                ["24", "Leads ativos", Users],
                ["3", "Hot leads", Flame],
                ["8", "Follow-ups pendentes", MessageSquareText],
                ["2", "Oportunidades de venda", BarChart3],
              ] as Array<[string, string, LucideIcon]>).map(([value, label, Icon]) => (
                <div key={String(label)} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                  <Icon className="h-5 w-5 text-primary" />
                  <p className="mt-4 text-3xl font-extrabold text-graphite">{value as string}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{label as string}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-surface px-5 py-14 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-end justify-between gap-5">
              <div>
                <span className="text-xs font-bold tracking-[0.2em] text-primary">PIPELINE</span>
                <h2 className="mt-3 text-3xl font-extrabold text-graphite">Funil comercial</h2>
              </div>
              <KanbanSquare className="hidden h-7 w-7 text-primary sm:block" />
            </div>
            <div className="mt-8 grid gap-3 md:grid-cols-5">
              {stages.map(([name, count, desc, Icon], index) => (
                <div key={String(name)} className="relative rounded-2xl border border-border bg-card p-5 shadow-soft">
                  <div className="flex items-center justify-between">
                    <Icon className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-extrabold text-graphite">{count as string}</span>
                  </div>
                  <h3 className="mt-5 font-bold text-graphite">{name as string}</h3>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{desc as string}</p>
                  {index < stages.length - 1 ? (
                    <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 text-primary lg:block" />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-14 lg:px-8 lg:py-18">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.1fr_.9fr]">
            <div className="rounded-3xl border border-border bg-card p-7 shadow-soft">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Flame className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-[0.15em] text-primary">LEAD SCORING</p>
                  <h2 className="text-2xl font-extrabold text-graphite">A IA prioriza quem merece atenção primeiro</h2>
                </div>
              </div>
              <div className="mt-7 grid gap-3">
                {[
                  ["Cargo decisor", "+20", "Diretor, gerente, coordenador ou responsável pela área"],
                  ["Mineração / indústria", "+20", "Segmentos prioritários da estratégia comercial"],
                  ["Múltiplas unidades", "+15", "Maior complexidade e potencial de plataforma"],
                  ["Interesse explícito", "+25", "Demonstração, plataforma ou software"],
                  ["Diagnóstico / consultoria", "+20", "Intenção comercial de serviço técnico"],
                ].map(([label, points, desc]) => (
                  <div key={label} className="flex items-center justify-between gap-4 rounded-xl border border-border p-4">
                    <div>
                      <p className="text-sm font-bold text-graphite">{label}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-sm font-extrabold text-primary">{points}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-primary/20 bg-card p-7 shadow-soft">
              <p className="text-xs font-bold tracking-[0.15em] text-primary">PRÓXIMAS AÇÕES</p>
              <h2 className="mt-2 text-2xl font-extrabold text-graphite">Fila inteligente</h2>
              <div className="mt-7 grid gap-3">
                {actions.map(([tag, count, text, color]) => (
                  <div key={tag} className="rounded-2xl border border-border p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className={`text-xs font-extrabold tracking-[0.12em] ${color}`}>{tag}</span>
                      <span className="text-xs font-semibold text-muted-foreground">{count}</span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-graphite">{text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center gap-2 rounded-xl bg-surface p-4 text-xs leading-5 text-muted-foreground">
                <Clock3 className="h-4 w-4 shrink-0 text-primary" />
                A automação prepara a próxima ação; comunicação externa só é executada após aprovação e configuração das credenciais oficiais.
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-surface px-5 py-14 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-5 md:grid-cols-3">
              {([
                [Mail, "Follow-up assistido", "A IA prepara mensagens personalizadas por contexto e etapa do funil."],
                [CheckCircle2, "Aprovação comercial", "Nada é enviado ou publicado automaticamente sem uma decisão controlada."],
                [ShieldCheck, "Consultoria + Plataforma", "Cada oportunidade é direcionada para o caminho comercial mais adequado."],
              ] as Array<[LucideIcon, string, string]>).map(([Icon, title, desc]) => (
                <article key={String(title)} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                  <Icon className="h-5 w-5 text-primary" />
                  <h3 className="mt-4 font-bold text-graphite">{title as string}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{desc as string}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
