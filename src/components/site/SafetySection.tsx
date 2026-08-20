import { AlertTriangle, HardHat, ClipboardCheck, GraduationCap } from "lucide-react";
import { ModuleCard, SectionHeading, type ModuleCardProps } from "./ModuleCard";

const cards: ModuleCardProps[] = [
  {
    icon: AlertTriangle,
    accent: "safety",
    title: "Gestão de Riscos",
    description:
      "Do perigo identificado ao controle implantado, com evidências e plano de ação vinculados.",
    features: [
      "Identificação de perigos",
      "Avaliação e classificação",
      "Matriz de riscos",
      "Controles e evidências",
      "Plano de ação",
    ],
    applicability: "PGR, GRO, APR e processos de avaliação e controle de riscos ocupacionais.",
  },
  {
    icon: HardHat,
    accent: "safety",
    title: "EPI",
    description: "Catálogo, entrega e devolução com rastreabilidade individual por colaborador.",
    features: [
      "Cadastro e catálogo",
      "Controle de CA",
      "Entrega e devolução",
      "Histórico por colaborador",
      "Assinatura e evidências",
    ],
    applicability:
      "Empresas que precisam controlar a entrega e a rastreabilidade dos equipamentos de proteção.",
  },
  {
    icon: ClipboardCheck,
    accent: "safety",
    title: "Inspeções e Checklists",
    description:
      "Checklists padronizados aplicados em campo, com registro fotográfico e tratativa de desvios.",
    features: [
      "Checklists configuráveis",
      "Inspeções em campo",
      "Conformidades e não conformidades",
      "Evidências e fotos",
      "Ações e indicadores",
    ],
    applicability: "Inspeções de campo, auditorias internas e verificações operacionais.",
  },
  {
    icon: GraduationCap,
    accent: "safety",
    title: "Treinamentos",
    description: "Capacitações registradas, com validade monitorada e certificados centralizados.",
    features: [
      "Cadastro de treinamentos",
      "Participantes",
      "Certificados",
      "Validades e histórico",
      "Controle de vencimentos",
    ],
    applicability: "Gestão de capacitações e treinamentos obrigatórios.",
  },
];

export function SafetySection() {
  return (
    <section id="seguranca" className="scroll-mt-24 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          accent="safety"
          eyebrow="SEGURANÇA DO TRABALHO"
          title="Risco identificado, controlado e comprovado"
          description="Os módulos de segurança compartilham a mesma base de dados: um risco gera ação, a ação gera evidência e a evidência alimenta o indicador."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((c) => (
            <ModuleCard key={c.title} {...c} />
          ))}
        </div>
      </div>
    </section>
  );
}
