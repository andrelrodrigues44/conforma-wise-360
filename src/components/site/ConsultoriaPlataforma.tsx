import { ArrowRight, BriefcaseBusiness, CheckCircle2, MonitorSmartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

const consultoria = [
  "Meio Ambiente e licenciamento",
  "Segurança do Trabalho e SST",
  "ISO 14001 e ISO 45001",
  "Requisitos legais e auditorias",
];

const plataforma = [
  "Gestão de requisitos, documentos e evidências",
  "Inspeções, auditorias e planos de ação",
  "Indicadores e dashboards executivos",
  "Inteligência artificial aplicada à gestão",
];

export function ConsultoriaPlataforma() {
  return (
    <section className="border-y border-border bg-surface px-5 py-20 lg:px-8 lg:py-24" id="solucoes">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-bold tracking-[0.2em] text-primary">CONFORMA360</span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-graphite sm:text-4xl">
            Consultoria especializada + tecnologia para sua conformidade
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Você pode contratar especialistas para executar, estruturar e melhorar sua gestão — ou
            usar a plataforma para centralizar, controlar e acompanhar tudo em um só lugar.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-border bg-card p-7 shadow-soft lg:p-9">
            <div className="flex items-start justify-between gap-5">
              <div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <BriefcaseBusiness className="h-6 w-6" />
                </div>
                <p className="mt-6 text-xs font-bold tracking-[0.18em] text-primary">LINHA 01</p>
                <h3 className="mt-2 text-2xl font-extrabold text-graphite">Consultoria Conforma360</h3>
              </div>
            </div>
            <p className="mt-4 text-muted-foreground">
              Apoio técnico para empresas que precisam implantar, regularizar, auditar ou elevar a
              maturidade de Meio Ambiente, SST e sistemas de gestão.
            </p>
            <ul className="mt-6 grid gap-3">
              {consultoria.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" size="lg" className="mt-8">
              <a href="/#contato">
                Solicitar consultoria <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </article>

          <article className="rounded-3xl border border-primary/30 bg-primary/[0.04] p-7 shadow-soft lg:p-9">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
              <MonitorSmartphone className="h-6 w-6" />
            </div>
            <p className="mt-6 text-xs font-bold tracking-[0.18em] text-primary">LINHA 02</p>
            <h3 className="mt-2 text-2xl font-extrabold text-graphite">Plataforma Conforma360</h3>
            <p className="mt-4 text-muted-foreground">
              Uma plataforma integrada para transformar requisitos, riscos, documentos e evidências
              em ações, indicadores e decisões.
            </p>
            <ul className="mt-6 grid gap-3">
              {plataforma.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <a href="/precos">
                  Conhecer a plataforma <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="/#contato">Solicitar demonstração</a>
              </Button>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
