import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Bot,
  CalendarDays,
  CheckCircle2,
  FileText,
  Instagram,
  Linkedin,
  LockKeyhole,
  Megaphone,
  MessageSquareText,
  PenLine,
  Send,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/marketing-ai")({
  head: () => ({
    meta: [
      { title: "Marketing AI | Conforma360" },
      {
        name: "description",
        content:
          "Centro de marketing com IA da Conforma360 para estratégia, conteúdo, leads, campanhas e análise de resultados.",
      },
    ],
  }),
  component: MarketingAIPage,
});

const agents = [
  { name: "Orquestrador", desc: "Transforma objetivos comerciais em planos executáveis.", icon: Sparkles },
  { name: "Estrategista", desc: "Define público, oferta, pauta, canais e prioridades.", icon: Target },
  { name: "Copywriter", desc: "Cria textos, CTAs, anúncios, e-mails e páginas.", icon: PenLine },
  { name: "Social Media", desc: "Converte a estratégia em conteúdo para LinkedIn e Instagram.", icon: Megaphone },
  { name: "SDR IA", desc: "Qualifica leads, sugere abordagem e próxima ação.", icon: Users },
  { name: "Analytics", desc: "Analisa desempenho e recomenda o próximo teste.", icon: BarChart3 },
];

const pipeline = ["Objetivo", "Estratégia", "Conteúdo", "Aprovação", "Publicação", "Analytics"];

function MarketingAIPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28">
        <section className="px-5 pb-16 lg:px-8 lg:pb-20">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-bold tracking-[0.15em] text-primary">
                <Bot className="h-4 w-4" /> CONFORMA360 MARKETING AI
              </span>
              <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-graphite sm:text-6xl">
                Uma operação de marketing com IA para vender a Conforma360.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
                Planeje campanhas, gere conteúdo, organize leads e acompanhe resultados em um único
                fluxo. A automação prepara o trabalho; ações externas passam por aprovação e pelas
                credenciais oficiais de cada canal.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" className="h-12 px-7">
                  <Sparkles className="mr-2 h-4 w-4" /> Criar campanha com IA
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 px-7">
                  <a href="/marketing-dashboard">
                    <LockKeyhole className="mr-2 h-4 w-4" /> Acessar painel
                  </a>
                </Button>
              </div>
            </div>

            <div className="mt-14 grid gap-5 md:grid-cols-4">
              {[
                ["24", "Leads em acompanhamento", Users],
                ["18", "Conteúdos no pipeline", FileText],
                ["12", "Publicações agendadas", CalendarDays],
                ["3,8%", "Conversão média", BarChart3],
              ].map(([value, label, Icon]: [string, string, LucideIcon]) => (
                <div key={String(label)} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                  <Icon className="h-5 w-5 text-primary" />
                  <p className="mt-4 text-3xl font-extrabold text-graphite">{value as string}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{label as string}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-surface px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <span className="text-xs font-bold tracking-[0.2em] text-primary">ORQUESTRAÇÃO</span>
              <h2 className="mt-3 text-3xl font-extrabold text-graphite">Do objetivo à venda em um fluxo controlado</h2>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {pipeline.map((step, index) => (
                <div key={step} className="relative rounded-2xl border border-border bg-card p-5 shadow-soft">
                  <span className="text-xs font-bold text-primary">0{index + 1}</span>
                  <p className="mt-3 font-bold text-graphite">{step}</p>
                  {index < pipeline.length - 1 ? <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 text-primary lg:block" /> : null}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-16 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <span className="text-xs font-bold tracking-[0.2em] text-primary">AGENTES</span>
                <h2 className="mt-3 text-3xl font-extrabold text-graphite">Especialistas digitais trabalhando juntos</h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                O sistema compartilha o contexto comercial da Conforma360 para reduzir respostas
                genéricas e manter estratégia, copy, conteúdo e vendas alinhados.
              </p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {agents.map(({ name, desc, icon: Icon }) => (
                <article key={name} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-graphite">{name}</h3>
                      <span className="text-xs text-primary">ATIVO</span>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">{desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-surface px-5 py-16 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
            <div>
              <span className="text-xs font-bold tracking-[0.2em] text-primary">CONTEÚDO + VENDA</span>
              <h2 className="mt-3 text-3xl font-extrabold text-graphite">Uma pauta vira uma campanha completa</h2>
              <p className="mt-4 max-w-2xl text-muted-foreground">
                A partir de um objetivo comercial, a IA pode gerar pauta, legenda, roteiro, carrossel,
                CTA, sequência de follow-up e briefing do criativo. Você revisa e aprova antes da
                publicação externa.
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  [Instagram, "Instagram: feed, carrossel, Stories e Reels"],
                  [Linkedin, "LinkedIn: autoridade, geração de demanda e prospecção"],
                  [MessageSquareText, "Follow-up: mensagens orientadas por contexto"],
                  [Send, "Campanhas: calendário, CTA e distribuição"],
                ].map(([Icon, text]: [LucideIcon, string]) => (
                  <div key={String(text)} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm text-foreground/80">{text as string}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-primary/20 bg-card p-6 shadow-elevated">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold tracking-[0.15em] text-primary">FILA DE APROVAÇÃO</p>
                  <h3 className="mt-2 text-xl font-extrabold text-graphite">Conteúdos desta semana</h3>
                </div>
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <div className="mt-6 grid gap-3">
                {["LinkedIn · Requisitos legais", "Instagram · 5 erros em auditorias", "LinkedIn · Case de conformidade", "Stories · Convite para demonstração"].map((item, index) => (
                  <div key={item} className="flex items-center justify-between rounded-xl border border-border p-4">
                    <div>
                      <p className="text-sm font-semibold text-graphite">{item}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{index === 0 ? "Aguardando aprovação" : "Programado"}</p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                      {index === 0 ? "REVISAR" : "OK"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-16 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-4xl rounded-3xl bg-primary p-8 text-primary-foreground shadow-elevated sm:p-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-bold tracking-[0.2em] opacity-80">PRÓXIMA ETAPA</p>
                <h2 className="mt-2 text-3xl font-extrabold">Conectar IA, leads e canais de publicação</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 opacity-85">
                  As automações externas só serão ativadas depois que as credenciais oficiais forem
                  configuradas e os fluxos forem validados.
                </p>
              </div>
              <Button asChild variant="secondary" size="lg" className="shrink-0">
                <a href="/marketing-dashboard">Abrir painel <ArrowRight className="ml-2 h-4 w-4" /></a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
