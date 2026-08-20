import { Scale, SearchCheck, ArrowRight } from "lucide-react";
import { ModuleCard, SectionHeading, type ModuleCardProps } from "./ModuleCard";

const cards: ModuleCardProps[] = [
  {
    icon: Scale,
    accent: "legal",
    title: "Requisitos Legais",
    description:
      "Requisitos e normas aplicáveis avaliados um a um, com evidência de atendimento e prazos.",
    features: [
      "Requisitos e normas",
      "Aplicabilidade",
      "Atendimento",
      "Evidências e pendências",
      "Prazos e histórico",
    ],
    applicability: "Transforme requisitos legais em processos controlados e rastreáveis.",
  },
  {
    icon: SearchCheck,
    accent: "legal",
    title: "Auditorias",
    description:
      "Auditorias internas com achados registrados e encaminhados para tratativa formal.",
    features: [
      "Programação de auditorias",
      "Achados e não conformidades",
      "Evidências",
      "Planos de ação vinculados",
      "Responsáveis e prazos",
    ],
    applicability: "Sistemas de gestão certificados e verificações internas periódicas.",
  },
];

const chain = [
  "Requisito",
  "Evidência",
  "Não conformidade",
  "Plano de ação",
  "Responsável",
  "Prazo",
];

export function ComplianceSection() {
  return (
    <section id="conformidade" className="scroll-mt-24 bg-surface py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          accent="legal"
          eyebrow="CONFORMIDADE"
          title="Requisito, evidência e responsabilidade na mesma linha"
          description="A conformidade deixa de ser um relatório pontual e passa a ser um processo com histórico auditável."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {cards.map((c) => (
            <ModuleCard key={c.title} {...c} />
          ))}
        </div>

        <ol className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {chain.map((step, i) => (
            <li key={step} className="flex items-center gap-2">
              <span className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-graphite shadow-soft">
                {step}
              </span>
              {i < chain.length - 1 ? (
                <ArrowRight className="h-4 w-4 text-legal" aria-hidden="true" />
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
