import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const kpis = [
  { label: "Índice de Conformidade", value: "91%", trend: "+4 p.p." },
  { label: "Licenças Válidas", value: "28/31", trend: "3 a renovar" },
  { label: "Condicionantes", value: "92%", trend: "atendidas" },
  { label: "Resíduos", value: "125,6 t", trend: "-8% mês" },
  { label: "Acidentes (12m)", value: "3", trend: "-40%" },
  { label: "TF", value: "2,41", trend: "meta 3,0" },
  { label: "TG", value: "18,7", trend: "meta 25" },
  { label: "LTIFR", value: "0,89", trend: "-0,3" },
  { label: "TRIFR", value: "1,64", trend: "-0,5" },
  { label: "ESG Score", value: "78", trend: "B+" },
];

const barData = [
  { mes: "Jan", conformidade: 74 },
  { mes: "Fev", conformidade: 78 },
  { mes: "Mar", conformidade: 81 },
  { mes: "Abr", conformidade: 85 },
  { mes: "Mai", conformidade: 88 },
  { mes: "Jun", conformidade: 91 },
];

const pieData = [
  { name: "Reciclagem", value: 36 },
  { name: "Coprocessamento", value: 28 },
  { name: "Aterro", value: 20 },
  { name: "Outros", value: 16 },
];

const pieColors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"];

const trendData = [
  { mes: "Jan", trifr: 3.1, ltifr: 1.9 },
  { mes: "Fev", trifr: 2.8, ltifr: 1.7 },
  { mes: "Mar", trifr: 2.5, ltifr: 1.5 },
  { mes: "Abr", trifr: 2.1, ltifr: 1.2 },
  { mes: "Mai", trifr: 1.8, ltifr: 1.0 },
  { mes: "Jun", trifr: 1.64, ltifr: 0.89 },
];

const heatRows = ["Mineração", "Usina", "Logística", "Manutenção"];
const heatCols = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];
const heatValues = [
  [1, 2, 1, 3, 2, 1],
  [2, 3, 2, 1, 1, 1],
  [3, 2, 2, 2, 1, 0],
  [1, 1, 3, 2, 2, 1],
];
const heatTone = ["bg-secondary", "bg-primary/25", "bg-primary/55", "bg-primary"];

function Panel({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-border bg-card p-5 shadow-soft ${className}`}>
      <h3 className="text-sm font-bold text-graphite">{title}</h3>
      <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function Dashboards() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-bold tracking-[0.2em] text-primary">DASHBOARDS</span>
          <h2 className="mt-3 text-3xl font-extrabold text-graphite sm:text-4xl">
            Informações que impulsionam decisões
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Indicadores executivos calculados automaticamente a partir dos registros operacionais —
            sem consolidação manual.
          </p>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {kpis.map((k) => (
            <div
              key={k.label}
              className="rounded-xl border border-border bg-surface px-4 py-3 transition-colors hover:border-primary/30"
            >
              <p className="truncate text-xs text-muted-foreground">{k.label}</p>
              <p className="mt-1 font-display text-xl font-extrabold text-graphite">{k.value}</p>
              <p className="text-[0.7rem] font-semibold text-primary">{k.trend}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <Panel title="Índice de Conformidade" subtitle="Evolução mensal (%)">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="mes" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="conformidade" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title="Resíduos por destino" subtitle="Participação no volume total">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={2}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={entry.name} fill={pieColors[i % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <ul className="mt-2 grid grid-cols-2 gap-1.5">
              {pieData.map((d, i) => (
                <li key={d.name} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: pieColors[i % pieColors.length] }}
                  />
                  <span className="truncate">{d.name}</span>
                  <span className="ml-auto font-semibold text-graphite">{d.value}%</span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Tendência de acidentabilidade" subtitle="TRIFR e LTIFR (12 meses móveis)">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="mes" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="trifr"
                  stroke="var(--chart-1)"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="ltifr"
                  stroke="var(--chart-4)"
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title="Heatmap de não conformidades" subtitle="Por área operacional e mês">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[22rem] border-separate border-spacing-1">
                <thead>
                  <tr>
                    <th className="w-28" />
                    {heatCols.map((c) => (
                      <th key={c} className="text-[0.65rem] font-medium text-muted-foreground">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {heatRows.map((row, ri) => (
                    <tr key={row}>
                      <td className="pr-2 text-left text-xs text-muted-foreground">{row}</td>
                      {heatCols.map((c, ci) => {
                        const v = heatValues[ri]?.[ci] ?? 0;
                        return (
                          <td key={c}>
                            <div
                              title={`${row} · ${c}: ${v} NC`}
                              className={`h-9 rounded-md ${heatTone[v]} transition-transform hover:scale-105`}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 flex items-center gap-2 text-[0.7rem] text-muted-foreground">
              <span>Menos</span>
              {heatTone.map((t) => (
                <span key={t} className={`h-3 w-6 rounded ${t}`} />
              ))}
              <span>Mais</span>
            </div>
          </Panel>
        </div>
      </div>
    </section>
  );
}
