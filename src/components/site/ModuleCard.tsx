import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";

export type Accent = "safety" | "health" | "env" | "legal" | "mgmt";

const accentMap: Record<Accent, { icon: string; bar: string; check: string; ring: string }> = {
  safety: {
    icon: "bg-safety-soft text-safety",
    bar: "bg-safety",
    check: "text-safety",
    ring: "hover:border-safety/35",
  },
  health: {
    icon: "bg-health-soft text-health",
    bar: "bg-health",
    check: "text-health",
    ring: "hover:border-health/35",
  },
  env: {
    icon: "bg-env-soft text-env",
    bar: "bg-env",
    check: "text-env",
    ring: "hover:border-env/35",
  },
  legal: {
    icon: "bg-legal-soft text-legal",
    bar: "bg-legal",
    check: "text-legal",
    ring: "hover:border-legal/35",
  },
  mgmt: {
    icon: "bg-mgmt-soft text-mgmt",
    bar: "bg-mgmt",
    check: "text-mgmt",
    ring: "hover:border-mgmt/35",
  },
};

export interface ModuleCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  applicability: string;
  accent: Accent;
  note?: string;
}

export function ModuleCard({
  icon: Icon,
  title,
  description,
  features,
  applicability,
  accent,
  note,
}: ModuleCardProps) {
  const a = accentMap[accent];
  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card ${a.ring}`}
    >
      <span
        className={`absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${a.bar}`}
      />
      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${a.icon}`}>
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>

      <h3 className="mt-5 text-lg font-bold text-graphite">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>

      <p className="mt-5 text-[0.7rem] font-bold tracking-[0.14em] text-muted-foreground">
        PRINCIPAIS FUNCIONALIDADES
      </p>
      <ul className="mt-3 grid gap-2">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
            <Check className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${a.check}`} aria-hidden="true" />
            <span className="min-w-0">{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 rounded-xl border border-border bg-surface px-4 py-3">
        <p className="text-[0.7rem] font-bold tracking-[0.14em] text-muted-foreground">
          APLICABILIDADE
        </p>
        <p className="mt-1 text-sm text-graphite">{applicability}</p>
      </div>

      {note ? <p className="mt-3 text-xs text-muted-foreground">{note}</p> : null}
    </article>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  accent = "env",
}: {
  eyebrow: string;
  title: string;
  description: string;
  accent?: Accent;
}) {
  const color = {
    safety: "text-safety",
    health: "text-health",
    env: "text-env",
    legal: "text-legal",
    mgmt: "text-mgmt",
  }[accent];

  return (
    <div className="mx-auto max-w-3xl text-center">
      <span className={`text-xs font-bold tracking-[0.2em] ${color}`}>{eyebrow}</span>
      <h2 className="mt-3 text-3xl font-extrabold text-graphite sm:text-4xl">{title}</h2>
      <p className="mt-4 text-lg text-muted-foreground">{description}</p>
    </div>
  );
}
