import {
  AlertTriangle,
  HardHat,
  ClipboardCheck,
  GraduationCap,
  HeartPulse,
  ShieldAlert,
  Leaf,
  FileBadge,
  Scale,
  SearchCheck,
  FolderOpen,
  ListChecks,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Accent } from "./ModuleCard";

const groups: {
  label: string;
  accent: Accent;
  href: string;
  items: { icon: LucideIcon; label: string }[];
}[] = [
  {
    label: "Segurança do Trabalho",
    accent: "safety",
    href: "#seguranca",
    items: [
      { icon: AlertTriangle, label: "Gestão de Riscos" },
      { icon: HardHat, label: "EPI" },
      { icon: ClipboardCheck, label: "Inspeções e Checklists" },
      { icon: GraduationCap, label: "Treinamentos" },
    ],
  },
  {
    label: "Saúde Ocupacional",
    accent: "health",
    href: "#saude",
    items: [
      { icon: HeartPulse, label: "Saúde Ocupacional" },
      { icon: ShieldAlert, label: "Comorbidades e Restrições" },
    ],
  },
  {
    label: "Meio Ambiente",
    accent: "env",
    href: "#meio-ambiente",
    items: [
      { icon: Leaf, label: "Gestão Ambiental" },
      { icon: FileBadge, label: "Licenças e Condicionantes" },
    ],
  },
  {
    label: "Conformidade",
    accent: "legal",
    href: "#conformidade",
    items: [
      { icon: Scale, label: "Requisitos Legais" },
      { icon: SearchCheck, label: "Auditorias" },
    ],
  },
  {
    label: "Gestão",
    accent: "mgmt",
    href: "#documentos",
    items: [
      { icon: FolderOpen, label: "Documentos" },
      { icon: ListChecks, label: "Planos de Ação" },
    ],
  },
];

const tone: Record<Accent, string> = {
  safety: "bg-safety-soft text-safety",
  health: "bg-health-soft text-health",
  env: "bg-env-soft text-env",
  legal: "bg-legal-soft text-legal",
  mgmt: "bg-mgmt-soft text-mgmt",
};

export function ModulesOverview() {
  return (
    <section id="modulos" className="scroll-mt-24 bg-surface py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-bold tracking-[0.2em] text-primary">MÓDULOS</span>
          <h2 className="mt-3 text-3xl font-extrabold text-graphite sm:text-4xl">
            Uma plataforma, cinco frentes de gestão
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Módulos independentes que compartilham a mesma base: colaboradores, unidades, evidências,
            responsáveis e prazos.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {groups.map((g) => (
            <a
              key={g.label}
              href={g.href}
              className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${tone[g.accent]}`}
              >
                {g.label}
              </span>
              <ul className="mt-4 grid gap-2.5">
                {g.items.map((i) => (
                  <li key={i.label} className="flex items-center gap-3">
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${tone[g.accent]}`}
                    >
                      <i.icon className="h-4.5 w-4.5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 text-sm font-semibold text-graphite">{i.label}</span>
                  </li>
                ))}
              </ul>
              <span className="mt-5 inline-block text-sm font-semibold text-primary group-hover:underline">
                Ver detalhes
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
