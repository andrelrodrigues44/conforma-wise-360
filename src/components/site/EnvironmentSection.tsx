import { Leaf, FileBadge } from "lucide-react";
import { ModuleCard, SectionHeading, type ModuleCardProps } from "./ModuleCard";

const cards: ModuleCardProps[] = [
  {
    icon: Leaf,
    accent: "env",
    title: "Gestão Ambiental",
    description:
      "Aspectos, impactos, resíduos e produtos químicos organizados com as obrigações associadas.",
    features: [
      "Aspectos e impactos",
      "Resíduos",
      "Produtos químicos",
      "Obrigações ambientais",
      "Evidências",
    ],
    applicability: "Operações com controle ambiental formalizado e obrigações periódicas.",
  },
  {
    icon: FileBadge,
    accent: "env",
    title: "Licenças e Condicionantes",
    description:
      "Cada licença com suas condicionantes, prazos e responsáveis — sem depender de planilhas paralelas.",
    features: [
      "Licenças",
      "Condicionantes",
      "Prazos",
      "Obrigações",
      "Evidências e pendências",
    ],
    applicability: "Empresas licenciadas que precisam comprovar atendimento junto aos órgãos.",
  },
];

export function EnvironmentSection() {
  return (
    <section id="meio-ambiente" className="scroll-mt-24 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          accent="env"
          eyebrow="MEIO AMBIENTE"
          title="Gestão ambiental integrada ao restante da operação de SSMA"
          description="O ambiental deixa de ser um sistema à parte: prazos, evidências e planos de ação seguem o mesmo fluxo dos demais módulos."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {cards.map((c) => (
            <ModuleCard key={c.title} {...c} />
          ))}
        </div>
      </div>
    </section>
  );
}
