import { ListChecks, ArrowRight } from "lucide-react";
import { SectionHeading } from "./ModuleCard";

const attributes = [
  "Ações",
  "Responsáveis",
  "Prazos",
  "Prioridades",
  "Status",
  "Evidências",
  "Atrasos",
  "Conclusão",
];

const flow = ["Problema", "Ação", "Responsável", "Prazo", "Evidência", "Conclusão"];

export function ActionPlansSection() {
  return (
    <section id="planos-de-acao" className="scroll-mt-24 bg-surface py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          accent="mgmt"
          eyebrow="PLANOS DE AÇÃO"
          title="Nada fica sem dono e sem data"
          description="Todo desvio identificado em risco, inspeção, auditoria ou requisito vira uma ação acompanhada até a conclusão."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.15fr]">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-mgmt-soft text-mgmt">
              <ListChecks className="h-6 w-6" aria-hidden="true" />
            </span>
            <h3 className="mt-5 text-lg font-bold text-graphite">O que é controlado</h3>
            <ul className="mt-4 grid grid-cols-2 gap-2">
              {attributes.map((a) => (
                <li
                  key={a}
                  className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-graphite"
                >
                  {a}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h3 className="text-lg font-bold text-graphite">Do desvio à comprovação</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              O mesmo fluxo vale para segurança, saúde, meio ambiente e conformidade.
            </p>
            <ol className="mt-6 grid gap-3">
              {flow.map((step, i) => (
                <li key={step} className="flex items-center gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-mgmt-soft text-sm font-bold text-mgmt">
                    {i + 1}
                  </span>
                  <span className="font-semibold text-graphite">{step}</span>
                  {i < flow.length - 1 ? (
                    <ArrowRight
                      className="ml-auto h-4 w-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
