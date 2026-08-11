import painel from "@/assets/painel-full.png.asset.json";

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

      <div className="bg-surface">
        <img
          src={painel.url}
          alt="Painel Conforma360 com índice de conformidade, licenças, saúde do sistema, alertas e inspeções por semana"
          className="block w-full"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
}
