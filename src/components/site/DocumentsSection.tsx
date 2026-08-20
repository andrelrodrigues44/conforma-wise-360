import { FolderOpen, FileText } from "lucide-react";
import { ModuleCard, SectionHeading, type ModuleCardProps } from "./ModuleCard";

const cards: ModuleCardProps[] = [
  {
    icon: FolderOpen,
    accent: "mgmt",
    title: "Documentos",
    description:
      "Repositório único, com versão vigente, validade e responsável visíveis em cada documento.",
    features: [
      "Documentos e categorias",
      "Controle de validade",
      "Responsáveis",
      "Evidências associadas",
      "Histórico de versões",
    ],
    applicability: "Times que precisam localizar rapidamente o documento vigente e comprovado.",
  },
  {
    icon: FileText,
    accent: "mgmt",
    title: "Documentos Técnicos",
    description:
      "PGR, laudos e programas legais organizados junto dos processos que dependem deles.",
    features: [
      "PGR e programas legais",
      "Laudos e relatórios",
      "Vinculação a riscos e requisitos",
      "Vencimentos",
      "Rastreabilidade",
    ],
    applicability: "Documentação técnica exigida por normas e por órgãos fiscalizadores.",
  },
];

export function DocumentsSection() {
  return (
    <section id="documentos" className="scroll-mt-24 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          accent="mgmt"
          eyebrow="GESTÃO DOCUMENTAL"
          title="Documentos organizados, rastreáveis e associados aos processos"
          description="Cada documento vive ligado ao risco, requisito ou inspeção que o originou — não em uma pasta solta."
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
