import { Check, Minus, X } from "lucide-react";

type Level = "full" | "partial" | "none";

const rows: { label: string; c360: Level; planilhas: Level; isolados: Level }[] = [
  { label: "Meio Ambiente", c360: "full", planilhas: "partial", isolados: "partial" },
  { label: "SST", c360: "full", planilhas: "partial", isolados: "partial" },
  { label: "Compliance Legal", c360: "full", planilhas: "none", isolados: "partial" },
  { label: "ESG", c360: "full", planilhas: "none", isolados: "none" },
  { label: "Gestão de EPIs", c360: "full", planilhas: "partial", isolados: "partial" },
  { label: "Riscos Psicossociais", c360: "full", planilhas: "none", isolados: "none" },
  { label: "Aplicativo Mobile", c360: "full", planilhas: "none", isolados: "partial" },
  { label: "Inteligência Artificial", c360: "full", planilhas: "none", isolados: "none" },
  { label: "Dashboards em tempo real", c360: "full", planilhas: "none", isolados: "partial" },
];

function Mark({ level }: { level: Level }) {
  if (level === "full")
    return (
      <span className="mx-auto grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground">
        <Check className="h-4 w-4" />
      </span>
    );
  if (level === "partial")
    return (
      <span className="mx-auto grid h-7 w-7 place-items-center rounded-full bg-secondary text-muted-foreground">
        <Minus className="h-4 w-4" />
      </span>
    );
  return (
    <span className="mx-auto grid h-7 w-7 place-items-center rounded-full bg-destructive/10 text-destructive">
      <X className="h-4 w-4" />
    </span>
  );
}

export function Comparison() {
  return (
    <section className="border-y border-border bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-bold tracking-[0.2em] text-primary">COMPARATIVO</span>
          <h2 className="mt-3 text-3xl font-extrabold text-graphite sm:text-4xl">
            Conforma360 x planilhas x sistemas isolados
          </h2>
        </div>

        <div className="mt-12 overflow-x-auto rounded-2xl border border-border bg-card shadow-card">
          <table className="w-full min-w-[34rem] text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="p-4 text-left font-semibold text-muted-foreground">Recurso</th>
                <th className="bg-accent p-4 text-center font-bold text-primary">Conforma360</th>
                <th className="p-4 text-center font-semibold text-muted-foreground">Planilhas</th>
                <th className="p-4 text-center font-semibold text-muted-foreground">
                  Sistemas isolados
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-b border-border last:border-0">
                  <td className="p-4 font-medium text-graphite">{r.label}</td>
                  <td className="bg-accent/50 p-4">
                    <Mark level={r.c360} />
                  </td>
                  <td className="p-4">
                    <Mark level={r.planilhas} />
                  </td>
                  <td className="p-4">
                    <Mark level={r.isolados} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Legenda: atende integralmente · atende parcialmente · não atende
        </p>
      </div>
    </section>
  );
}
