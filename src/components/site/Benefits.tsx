import { Scale, Layers, BrainCircuit, GitBranch, Smartphone, LineChart } from "lucide-react";

const pillars = [
  {
    num: "01",
    icon: Scale,
    title: "Conformidade Legal",
    text: "Centralize requisitos legais, obrigações e evidências para reduzir riscos regulatórios.",
  },
  {
    num: "02",
    icon: Layers,
    title: "Gestão Integrada",
    text: "Meio Ambiente, SST, Compliance, ESG e Operações conectados em uma única plataforma.",
  },
  {
    num: "03",
    icon: BrainCircuit,
    title: "Inteligência",
    text: "Use dados, indicadores e recursos de IA para transformar informações em decisões.",
  },
  {
    num: "04",
    icon: GitBranch,
    title: "Rastreabilidade",
    text: "Conecte requisitos, registros, evidências, pendências e ações em uma gestão auditável.",
  },
  {
    num: "05",
    icon: Smartphone,
    title: "Mobilidade",
    text: "Leve a gestão para o campo e registre informações e evidências diretamente na operação.",
  },
  {
    num: "06",
    icon: LineChart,
    title: "Gestão Executiva",
    text: "Transforme dados operacionais em uma visão clara para gestores, coordenadores e diretoria.",
  },
];

export function Benefits() {
  return (
    <section id="beneficios" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-bold tracking-[0.2em] text-primary">BENEFÍCIOS</span>
          <h2 className="mt-3 text-3xl font-extrabold text-graphite sm:text-4xl">
            Por que escolher o Conforma360?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Plataforma integrada de Gestão Ambiental, Segurança do Trabalho, Compliance Legal, ESG e
            Operações.
          </p>
          <p className="mt-3 text-base text-muted-foreground">
            O Conforma360 conecta requisitos, riscos, evidências, ações e indicadores para
            transformar conformidade em gestão e informação em decisão.
          </p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p) => (
            <article
              key={p.num}
              className="group relative bg-card p-6 transition-colors duration-300 hover:bg-surface"
            >
              <span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
              <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-surface text-legal transition-colors duration-300 group-hover:border-primary/30 group-hover:text-primary">
                  <p.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-xs font-bold tracking-[0.2em] text-muted-foreground/70">
                  {p.num}
                </span>
              </div>
              <h3 className="mt-4 text-base font-bold text-graphite">{p.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
