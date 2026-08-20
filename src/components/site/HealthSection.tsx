import { HeartPulse, ShieldAlert, Lock } from "lucide-react";
import { ModuleCard, SectionHeading, type ModuleCardProps } from "./ModuleCard";

const cards: ModuleCardProps[] = [
  {
    icon: HeartPulse,
    accent: "health",
    title: "Saúde Ocupacional",
    description:
      "Controle administrativo dos exames e ASOs, com visibilidade de vencimentos e pendências.",
    features: [
      "ASO",
      "Exames e periodicidades",
      "Vencimentos",
      "Pendências",
      "Histórico e indicadores",
    ],
    applicability: "Controle administrativo e gerencial dos processos de saúde ocupacional.",
  },
  {
    icon: ShieldAlert,
    accent: "health",
    title: "Comorbidades e Restrições",
    description:
      "Registro controlado de restrições e acompanhamento, com acesso limitado aos perfis autorizados.",
    features: [
      "Cadastro controlado",
      "Restrições ocupacionais",
      "Acompanhamento",
      "Alertas",
      "Histórico e controle de acesso",
    ],
    applicability:
      "Áreas de saúde e SST que precisam acompanhar restrições sem expor dados sensíveis.",
    note: "Informações sensíveis devem possuir controle de acesso adequado e tratamento compatível com a LGPD.",
  },
];

export function HealthSection() {
  return (
    <section id="saude" className="scroll-mt-24 bg-surface py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          accent="health"
          eyebrow="SAÚDE OCUPACIONAL"
          title="Saúde acompanhada com critério e privacidade"
          description="Gestão administrativa dos processos de saúde ocupacional, conectada ao cadastro de colaboradores e aos indicadores da operação."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {cards.map((c) => (
            <ModuleCard key={c.title} {...c} />
          ))}
        </div>
        <p className="mx-auto mt-8 flex max-w-3xl items-start gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-health" aria-hidden="true" />
          Dados de saúde são tratados como informação sensível: perfis de acesso restritos, registro
          de histórico e finalidade definida, em linha com a LGPD.
        </p>
      </div>
    </section>
  );
}
