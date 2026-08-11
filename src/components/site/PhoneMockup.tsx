import { Bell, Menu, Truck, HardHat, ClipboardCheck, FolderOpen } from "lucide-react";

const tiles = [
  { icon: HardHat, label: "EPIs", note: "Em dia", tone: "ok" },
  { icon: ClipboardCheck, label: "Inspeções", note: "2 atrasadas", tone: "alert" },
  { icon: Truck, label: "Entregas", note: "Em dia", tone: "ok" },
  { icon: FolderOpen, label: "Documentos", note: "Em dia", tone: "ok" },
];

export function PhoneMockup({ className = "" }: { className?: string }) {
  const r = 40;
  const c = 2 * Math.PI * r;

  return (
    <div
      className={`w-[236px] rounded-[2.2rem] border-[7px] border-graphite bg-graphite shadow-elevated ${className}`}
    >
      <div className="overflow-hidden rounded-[1.6rem] bg-gradient-deep">
        <div className="flex items-center justify-between px-4 pb-1 pt-2.5 text-[0.55rem] font-semibold text-primary-foreground/80">
          <span>16:46</span>
          <span>••• ▮</span>
        </div>

        <div className="flex items-center justify-between px-4 pb-3">
          <span className="text-[0.6rem] font-bold tracking-[0.15em] text-primary-foreground">
            CONFORMA360
          </span>
          <div className="flex gap-2 text-primary-foreground/80">
            <Bell className="h-3.5 w-3.5" />
            <Menu className="h-3.5 w-3.5" />
          </div>
        </div>

        <div className="px-4 pb-3">
          <p className="text-sm font-bold text-primary-foreground">Boa tarde, André</p>
          <p className="text-[0.6rem] text-primary-foreground/70">Centro de Operações SSMA</p>
        </div>

        <div className="mx-3 rounded-xl bg-primary-foreground/10 p-3 text-center backdrop-blur-sm">
          <p className="text-[0.55rem] font-semibold tracking-widest text-primary-foreground/70">
            ÍNDICE DE CONFORMIDADE
          </p>
          <div className="relative mx-auto mt-2 h-24 w-24">
            <svg viewBox="0 0 96 96" className="h-24 w-24 -rotate-90">
              <circle
                cx="48"
                cy="48"
                r={r}
                fill="none"
                stroke="oklch(1 0 0 / 0.18)"
                strokeWidth="9"
              />
              <circle
                cx="48"
                cy="48"
                r={r}
                fill="none"
                stroke="oklch(0.86 0.15 130)"
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={`${c * 0.91} ${c}`}
              />
            </svg>
            <div className="absolute inset-0 grid place-items-center">
              <span className="font-display text-xl font-extrabold text-primary-foreground">
                91%
              </span>
            </div>
          </div>
          <span className="mt-1 inline-block rounded-full bg-primary-foreground/15 px-2 py-0.5 text-[0.5rem] font-semibold text-primary-foreground">
            Excelente
          </span>
        </div>

        <div className="mt-3 rounded-t-2xl bg-card p-3">
          <p className="text-[0.6rem] font-bold text-graphite">Resumo do dia</p>
          <ul className="mt-2 grid gap-1 text-[0.55rem] text-muted-foreground">
            <li className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-destructive" />1 documento vencido
            </li>
            <li className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-warning" />2 inspeções pendentes
            </li>
            <li className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Nenhuma licença vencida
            </li>
          </ul>

          <div className="mt-3 grid grid-cols-2 gap-1.5">
            {tiles.map((t) => (
              <div key={t.label} className="rounded-lg border border-border p-1.5">
                <t.icon
                  className={`h-3 w-3 ${t.tone === "alert" ? "text-destructive" : "text-primary"}`}
                />
                <p className="mt-1 text-[0.52rem] font-semibold text-graphite">{t.label}</p>
                <p className="text-[0.48rem] text-muted-foreground">{t.note}</p>
              </div>
            ))}
          </div>

          <p className="mt-2.5 text-[0.55rem] font-semibold text-primary">Ver plano de ação →</p>
        </div>
      </div>
    </div>
  );
}
