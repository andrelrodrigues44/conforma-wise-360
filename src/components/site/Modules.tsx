import {
  Leaf,
  HardHat,
  Scale,
  Trash2,
  FlaskConical,
  Globe2,
  ShieldCheck,
  Brain,
  Check,
} from "lucide-react";

const modules = [
  {
    icon: Leaf,
    title: "Meio Ambiente",
    items: ["Licenciamento Ambiental", "Condicionantes", "Aspectos e Impactos", "Água e Efluentes"],
  },
  {
    icon: HardHat,
    title: "SST",
    items: ["Inspeções", "Auditorias", "Acidentes", "Treinamentos"],
  },
  {
    icon: Scale,
    title: "Compliance Legal",
    items: [
      "Requisitos Legais",
      "Avaliação de Conformidade",
      "Evidências",
      "Plano de Ação",
    ],
  },
  {
    icon: Trash2,
    title: "Gestão de Resíduos",
    items: ["MTR", "Destinação", "Inventário", "Indicadores"],
  },
  {
    icon: FlaskConical,
    title: "Produtos Químicos",
    items: ["FISPQ", "Estoque", "Compatibilidade", "Emergências"],
  },
  {
    icon: Globe2,
    title: "ESG",
    items: ["Indicadores", "Dashboards", "Relatórios", "Score ESG"],
  },
  {
    icon: ShieldCheck,
    title: "Gestão de EPIs",
    items: ["Entregas", "Controle de CA", "Validade", "Assinatura Digital"],
  },
  {
    icon: Brain,
    title: "Riscos Psicossociais",
    items: ["NR-01", "Questionários", "Matriz de Risco", "Dashboard"],
  },
];

export function Modules() {
  return (
    <section id="modulos" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-bold tracking-[0.2em] text-primary">MÓDULOS</span>
          <h2 className="mt-3 text-3xl font-extrabold text-graphite sm:text-4xl">
            Tudo que sua empresa precisa em um único lugar
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Módulos integrados que compartilham a mesma base de dados, evitando duplicidade e
            garantindo rastreabilidade ponta a ponta.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((m) => (
            <article
              key={m.title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-card"
            >
              <span className="absolute inset-x-0 top-0 h-1 scale-x-0 bg-gradient-primary transition-transform duration-300 group-hover:scale-x-100" />
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <m.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-graphite">{m.title}</h3>
              <ul className="mt-4 grid gap-2">
                {m.items.map((i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    <span className="min-w-0">{i}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
