import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 91, suffix: "%", label: "Índice de Conformidade", note: "média dos clientes ativos" },
  { value: 80, suffix: "%", label: "Redução do tempo administrativo", note: "menos retrabalho" },
  { value: 100, suffix: "%", label: "Rastreabilidade documental", note: "histórico e evidências" },
  { value: null, suffix: "", label: "Indicadores em tempo real", note: "atualização automática" },
];

function useCountUp(target: number | null, active: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active || target === null) return;
    const duration = 1200;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setValue(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active]);
  return value;
}

function StatCard({ stat, active }: { stat: (typeof stats)[number]; active: boolean }) {
  const value = useCountUp(stat.value, active);
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
      <p className="font-display text-4xl font-extrabold text-primary">
        {stat.value === null ? "Tempo Real" : `${value}${stat.suffix}`}
      </p>
      <p className="mt-3 text-base font-semibold text-graphite">{stat.label}</p>
      <p className="mt-1 text-sm text-muted-foreground">{stat.note}</p>
    </div>
  );
}

export function Results() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setActive(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="solucoes" className="border-y border-border bg-surface py-20 lg:py-24">
      <div ref={ref} className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold text-graphite sm:text-4xl">
            Empresas não precisam de mais planilhas. Precisam de controle.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            O Conforma360 substitui planilhas dispersas e sistemas isolados por uma base única de
            informação, com indicadores confiáveis e auditáveis.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <StatCard key={s.label} stat={s} active={active} />
          ))}
        </div>
      </div>
    </section>
  );
}
