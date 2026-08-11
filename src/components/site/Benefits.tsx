import { Scale, Zap, Layers, LineChart, Smartphone, Lock } from "lucide-react";

const benefits = [
  { icon: Scale, title: "Conformidade Legal", text: "Reduza riscos regulatórios com requisitos legais atualizados e evidências auditáveis." },
  { icon: Zap, title: "Automação", text: "Menos planilhas e mais produtividade: prazos, alertas e fluxos automáticos." },
  { icon: Layers, title: "Gestão Integrada", text: "Meio Ambiente, SST, ESG e Operações em uma única plataforma." },
  { icon: LineChart, title: "Inteligência de Dados", text: "Dashboards executivos em tempo real para decisões rápidas e assertivas." },
  { icon: Smartphone, title: "Mobilidade", text: "Operação em campo pelo aplicativo, com evidências fotográficas e offline." },
  { icon: Lock, title: "Segurança", text: "Aderência à LGPD, criptografia, trilha de auditoria e proteção de dados." },
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
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <article
              key={b.title}
              className="flex gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-card"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent text-primary">
                <b.icon className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-graphite">{b.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{b.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
