import {
  LayoutDashboard,
  Leaf,
  HardHat,
  Scale,
  FileCheck2,
  ClipboardList,
  Trash2,
  FlaskConical,
  BarChart3,
  FileText,
  Settings,
} from "lucide-react";

const nav = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Leaf, label: "Meio Ambiente" },
  { icon: HardHat, label: "SST" },
  { icon: Scale, label: "Requisitos Legais" },
  { icon: FileCheck2, label: "Licenciamento" },
  { icon: ClipboardList, label: "Condicionantes" },
  { icon: Trash2, label: "Resíduos" },
  { icon: FlaskConical, label: "Químicos" },
  { icon: BarChart3, label: "Indicadores ESG" },
  { icon: FileText, label: "Relatórios" },
  { icon: Settings, label: "Configurações" },
];

const kpis = [
  { label: "Índice Integrado de Conformidade", value: "91%", note: "Excelente", tone: "good" },
  { label: "Condicionantes atendidas", value: "92%", note: "28 de 31" },
  { label: "Licenças válidas", value: "28", note: "de 31" },
  { label: "Resíduos gerados (mês)", value: "125,6 t", note: "-8% vs. abril" },
];

const donut = [
  { label: "Atendidas", pct: 92, color: "var(--chart-1)" },
  { label: "Em andamento", pct: 6, color: "var(--chart-3)" },
  { label: "A vencer", pct: 1, color: "var(--chart-4)" },
  { label: "Vencidas", pct: 1, color: "var(--chart-5)" },
];

const residuos = [
  { label: "Reciclagem", t: "45,7 t", pct: 36 },
  { label: "Coprocessamento", t: "34,9 t", pct: 28 },
  { label: "Aterro", t: "25,1 t", pct: 20 },
  { label: "Outros", t: "19,9 t", pct: 16 },
];

function Donut() {
  const r = 34;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg viewBox="0 0 90 90" className="h-24 w-24 shrink-0 -rotate-90">
      {donut.map((s) => {
        const len = (s.pct / 100) * c;
        const el = (
          <circle
            key={s.label}
            cx="45"
            cy="45"
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth="13"
            strokeDasharray={`${len} ${c - len}`}
            strokeDashoffset={-offset}
          />
        );
        offset += len;
        return el;
      })}
    </svg>
  );
}

export function DashboardMockup() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-elevated">
      <div className="flex items-center gap-2 border-b border-border bg-secondary px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-primary/60" />
        <div className="ml-3 flex-1 truncate rounded-md bg-background px-3 py-1 text-[0.6rem] text-muted-foreground">
          app.conforma360.com.br/dashboard
        </div>
      </div>

      <div className="grid grid-cols-[auto_minmax(0,1fr)]">
        <aside className="hidden w-44 shrink-0 bg-sidebar p-3 sm:block">
          <div className="px-2 pb-3 text-[0.6rem] font-bold tracking-[0.18em] text-sidebar-foreground/60">
            CONFORMA360
          </div>
          <nav className="grid gap-0.5">
            {nav.map((n) => (
              <div
                key={n.label}
                className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[0.65rem] ${
                  n.active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold"
                    : "text-sidebar-foreground/70"
                }`}
              >
                <n.icon className="h-3 w-3 shrink-0" />
                <span className="truncate">{n.label}</span>
              </div>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 space-y-3 bg-surface p-3 sm:p-4">
          <div className="flex items-baseline justify-between">
            <h3 className="font-display text-sm font-bold">Dashboard Executivo</h3>
            <span className="text-[0.6rem] text-muted-foreground">Atualizado agora</span>
          </div>

          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            {kpis.map((k) => (
              <div key={k.label} className="rounded-lg border border-border bg-card p-2.5">
                <p className="text-[0.55rem] leading-tight text-muted-foreground">{k.label}</p>
                <p className="mt-1 font-display text-lg font-extrabold text-graphite">{k.value}</p>
                <p
                  className={`text-[0.55rem] font-semibold ${
                    k.tone === "good" ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {k.note}
                </p>
              </div>
            ))}
          </div>

          <div className="grid gap-2 lg:grid-cols-[1.15fr_1fr]">
            <div className="rounded-lg border border-border bg-card p-3">
              <p className="text-[0.6rem] font-semibold text-muted-foreground">
                Atendimento de Condicionantes
              </p>
              <div className="mt-2 flex items-center gap-3">
                <Donut />
                <ul className="grid min-w-0 flex-1 gap-1">
                  {donut.map((s) => (
                    <li key={s.label} className="flex items-center gap-2 text-[0.58rem]">
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: s.color }}
                      />
                      <span className="truncate text-muted-foreground">{s.label}</span>
                      <span className="ml-auto font-semibold text-graphite">{s.pct}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid gap-2">
              <div className="rounded-lg border border-border bg-card p-3">
                <p className="text-[0.6rem] font-semibold text-muted-foreground">
                  Índice de Conformidade Legal (ICL)
                </p>
                <p className="mt-1 font-display text-2xl font-extrabold text-graphite">84%</p>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full w-[84%] rounded-full bg-gradient-primary" />
                </div>
              </div>
              <div className="rounded-lg border border-border bg-card p-3">
                <p className="text-[0.6rem] font-semibold text-muted-foreground">
                  Resíduos por destino (mês)
                </p>
                <ul className="mt-2 grid gap-1.5">
                  {residuos.map((r) => (
                    <li key={r.label} className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-[0.55rem] text-muted-foreground">{r.label}</p>
                        <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-secondary">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${r.pct}%` }}
                          />
                        </div>
                      </div>
                      <span className="shrink-0 text-[0.55rem] font-semibold text-graphite">
                        {r.t}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
