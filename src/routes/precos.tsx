import { createFileRoute } from "@tanstack/react-router";
import { Check, ArrowRight, MessageCircle } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { DemoDialog } from "@/components/site/DemoDialog";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { WHATSAPP_URL } from "@/components/site/contact";

const SITE_URL = "https://www.conforma360.com.br/precos";
const title = "Preços | Conforma360";
const description =
  "Planos do Conforma360: Starter, Profissional e Enterprise, ou monte seu próprio pacote. Teste grátis por 14 dias, sem cartão.";

export const Route = createFileRoute("/precos")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
  }),
  component: PrecosPage,
});

const TRIAL_URL = "https://app.conforma360.com.br/auth?mode=signup";

const planos = [
  {
    nome: "Starter",
    preco: "490",
    destaque: false,
    itens: [
      "Inspeções, NC e Planos de Ação",
      "Gestão de Perigos e Riscos",
      "Diálogo Diário de Segurança",
    ],
  },
  {
    nome: "Profissional",
    preco: "1.490",
    destaque: true,
    selo: "Mais escolhido",
    itens: [
      "Tudo do Starter",
      "Gestão de EPI",
      "Certificados de Treinamento",
      "PSI — Risco Psicossocial (NR-1)",
    ],
  },
  {
    nome: "Enterprise",
    preco: "3.990",
    destaque: false,
    itens: ["Tudo do Profissional", "Ambiental & ESG", "Analytics SST", "Saúde Ocupacional"],
  },
];

const faq = [
  {
    pergunta: "Preciso de cartão de crédito para testar?",
    resposta:
      "Não. O teste gratuito de 14 dias é liberado só com e-mail — sem cartão, sem cobrança automática ao final.",
  },
  {
    pergunta: "Posso trocar de plano depois?",
    resposta:
      "Sim. Você pode fazer upgrade a qualquer momento, e também escolher o modelo self-service, pagando só pelos módulos que sua empresa realmente usa.",
  },
  {
    pergunta: "Tem contrato de fidelidade?",
    resposta: "Não. A cobrança é mensal e você pode cancelar quando quiser, sem multa.",
  },
  {
    pergunta: "O que é o Conforma360 RAC?",
    resposta:
      "É o módulo dedicado a empresas prestadoras de serviço à Vale, com gestão de aderência aos Requisitos de Atividades Críticas (RAC), matriz de capacitação e inspeções por contrato. É contratado separadamente — fale com a gente para o valor.",
  },
  {
    pergunta: "Vocês oferecem consultoria além do software?",
    resposta:
      "Sim. Oferecemos consultoria especializada em SSMA para implantação guiada, correção de não conformidades e acompanhamento contínuo, com investimento a partir de R$ 1.200 — o valor final depende do escopo.",
  },
];

function PrecosPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28">
        <section className="px-5 pb-16 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold tracking-[0.2em] text-primary">PREÇOS</span>
            <h1 className="mt-3 text-4xl font-extrabold text-graphite sm:text-5xl">
              Um plano para cada estágio da sua operação
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Comece com um plano pronto ou monte seu próprio pacote, pagando só pelos módulos que
              você precisa. Sem fidelidade, cancele quando quiser.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-6xl gap-6 lg:grid-cols-3">
            {planos.map((p) => (
              <article
                key={p.nome}
                className={`relative rounded-3xl border bg-card p-8 shadow-soft ${
                  p.destaque ? "border-primary shadow-elevated lg:-translate-y-3" : "border-border"
                }`}
              >
                {p.selo ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-extrabold uppercase tracking-wide text-primary-foreground shadow-soft">
                    {p.selo}
                  </span>
                ) : null}
                <h2 className="text-lg font-bold text-graphite">{p.nome}</h2>
                <p className="mt-3 flex items-baseline gap-1">
                  <span className="text-sm text-muted-foreground">R$</span>
                  <span className="text-4xl font-extrabold text-graphite">{p.preco}</span>
                  <span className="text-sm text-muted-foreground">/mês</span>
                </p>
                <ul className="mt-6 grid gap-3">
                  {p.itens.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  size="lg"
                  variant={p.destaque ? "default" : "outline"}
                  className="mt-8 w-full"
                >
                  <a href={TRIAL_URL}>
                    Testar grátis
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </Button>
              </article>
            ))}
          </div>

          <div className="mx-auto mt-8 max-w-6xl rounded-2xl border border-border bg-accent p-6 text-center sm:p-8">
            <p className="text-sm text-accent-foreground">
              <strong>Prefere montar sob medida?</strong> No plano self-service, você escolhe só os
              módulos que precisa agora — o preço é a soma direta, sem pacote fixo. Todos os planos
              incluem <strong>DDS</strong> e <strong>Copiloto Executivo (IA)</strong> sem custo
              adicional.
            </p>
          </div>

          <div className="mx-auto mt-6 grid max-w-6xl gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h3 className="text-sm font-bold text-graphite">Prestador de serviço à Vale</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                <strong className="text-graphite">Conforma360 RAC</strong> — módulo dedicado à
                gestão de aderência aos Requisitos de Atividades Críticas, com matriz de
                capacitação, inspeções e evidências por contrato. Módulo avulso, consulte o
                investimento.
              </p>
              <DemoDialog>
                <Button variant="outline" className="mt-4">
                  Falar sobre RAC
                </Button>
              </DemoDialog>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h3 className="text-sm font-bold text-graphite">Consultoria especializada</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Apoio técnico em SSMA para implantação guiada, correção de não conformidades e
                acompanhamento contínuo. Investimento{" "}
                <strong className="text-graphite">a partir de R$ 1.200,00</strong>, conforme o
                escopo.
              </p>
              <DemoDialog>
                <Button variant="outline" className="mt-4">
                  Falar sobre consultoria
                </Button>
              </DemoDialog>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-surface px-5 py-16 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <span className="text-xs font-bold tracking-[0.2em] text-primary">DÚVIDAS</span>
              <h2 className="mt-3 text-3xl font-extrabold text-graphite">Perguntas frequentes</h2>
            </div>
            <Accordion type="single" collapsible className="mt-10">
              {faq.map((f) => (
                <AccordionItem key={f.pergunta} value={f.pergunta}>
                  <AccordionTrigger className="text-left text-base font-semibold text-graphite">
                    {f.pergunta}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {f.resposta}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="px-5 py-16 lg:px-8 lg:py-20">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
            <h2 className="text-2xl font-extrabold text-graphite sm:text-3xl">
              Ainda com dúvidas sobre qual plano escolher?
            </h2>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <DemoDialog>
                <Button size="lg" className="h-12 px-7">
                  Solicitar Demonstração
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </DemoDialog>
              <Button asChild size="lg" variant="outline" className="h-12 px-7">
                <a href={WHATSAPP_URL} target="_blank" rel="noreferrer noopener">
                  <MessageCircle className="mr-1 h-4 w-4" />
                  Falar no WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
