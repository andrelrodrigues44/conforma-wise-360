import { ArrowRight, MessageCircle, ShieldCheck, Zap, LineChart, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoDialog } from "./DemoDialog";
import { DashboardMockup } from "./DashboardMockup";
import { PhoneMockup } from "./PhoneMockup";
import { WHATSAPP_URL } from "./contact";

const bullets = [
  { icon: ShieldCheck, text: "Reduza riscos e não conformidades" },
  { icon: Zap, text: "Automatize processos e prazos" },
  { icon: LineChart, text: "Decisões baseadas em dados" },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-gradient-surface pt-28 lg:pt-32">
      <div className="grid-blueprint pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-accent blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 pb-20 lg:px-8 lg:pb-28">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <div className="reveal min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-accent px-3.5 py-1.5 text-xs font-semibold text-primary">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Meio Ambiente · SST · Compliance · ESG · Operações
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] text-graphite sm:text-5xl xl:text-[3.5rem]">
              Gestão completa.
              <br />
              <span className="text-primary">Conformidade</span> que gera resultados.
            </h1>

            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              A plataforma integrada para Meio Ambiente, Segurança do Trabalho, Compliance Legal,
              ESG e Operações da sua empresa.
            </p>
            <p className="mt-3 max-w-xl text-base text-muted-foreground">
              Centralize informações, reduza riscos, automatize processos e tome decisões baseadas
              em dados.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <DemoDialog>
                <Button size="lg" className="h-12 px-7 text-base shadow-card">
                  Solicitar Demonstração
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </DemoDialog>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 border-primary/30 px-7 text-base text-primary hover:bg-accent"
              >
                <a href={WHATSAPP_URL} target="_blank" rel="noreferrer noopener">
                  <MessageCircle className="mr-1 h-4 w-4" />
                  Falar no WhatsApp
                </a>
              </Button>
            </div>

            <ul className="mt-9 grid gap-3 sm:grid-cols-3">
              {bullets.map((b) => (
                <li key={b.text} className="flex items-start gap-2.5">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent text-primary">
                    <b.icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 text-sm font-medium text-graphite">{b.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="reveal relative min-w-0 [animation-delay:150ms]">
            <DashboardMockup />
            <PhoneMockup className="absolute -bottom-10 left-0 hidden origin-bottom-left -translate-x-1/2 scale-[0.65] sm:block lg:-left-6 lg:scale-[0.75]" />
          </div>
        </div>
      </div>
    </section>
  );
}
