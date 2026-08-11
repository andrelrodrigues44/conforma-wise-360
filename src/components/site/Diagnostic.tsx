import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Gauge, ShieldAlert, Sparkles } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

type Question = { id: string; area: string; text: string };

const questions: Question[] = [
  { id: "q1", area: "Licenciamento", text: "Você possui controle centralizado das licenças ambientais e seus prazos de renovação?" },
  { id: "q2", area: "Condicionantes", text: "As condicionantes das licenças são acompanhadas com responsáveis e evidências?" },
  { id: "q3", area: "Requisitos Legais", text: "Existe uma matriz de requisitos legais atualizada e avaliada periodicamente?" },
  { id: "q4", area: "Resíduos", text: "A gestão de resíduos (MTR, destinação e inventário) é rastreável e auditável?" },
  { id: "q5", area: "SST", text: "Inspeções, auditorias e planos de ação de SST são registrados em sistema?" },
  { id: "q6", area: "EPIs", text: "A entrega de EPIs possui controle de CA, validade e assinatura digital?" },
  { id: "q7", area: "Químicos", text: "FISPQ, estoque e compatibilidade de produtos químicos estão sob controle?" },
  { id: "q8", area: "Psicossociais", text: "Os riscos psicossociais exigidos pela NR-01 já foram avaliados?" },
  { id: "q9", area: "ESG", text: "Sua empresa monitora indicadores ESG com dados consolidados automaticamente?" },
  { id: "q10", area: "Dados", text: "A diretoria acompanha indicadores de conformidade em tempo real?" },
];

const options = [
  { label: "Sim, totalmente estruturado", value: 10 },
  { label: "Parcialmente", value: 6 },
  { label: "Apenas em planilhas", value: 3 },
  { label: "Não temos controle", value: 0 },
];

const leadSchema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome").max(100),
  empresa: z.string().trim().min(2, "Informe a empresa").max(120),
  cargo: z.string().trim().min(2, "Informe seu cargo").max(80),
  email: z.string().trim().email("E-mail inválido").max(255),
  telefone: z.string().trim().min(8, "Telefone inválido").max(20),
});

function maturity(score: number) {
  if (score >= 85) return { level: "Otimizado", text: "Gestão madura e orientada por dados." };
  if (score >= 65) return { level: "Gerenciado", text: "Boa base, com lacunas de integração." };
  if (score >= 40) return { level: "Em desenvolvimento", text: "Controles parciais e muito manuais." };
  return { level: "Inicial", text: "Alta exposição a riscos regulatórios." };
}

export function Diagnostic() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [stage, setStage] = useState<"quiz" | "form" | "result">("quiz");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const score = useMemo(() => {
    const total = questions.reduce((acc, q) => acc + (answers[q.id] ?? 0), 0);
    return Math.round((total / (questions.length * 10)) * 100);
  }, [answers]);

  const risks = useMemo(
    () => questions.filter((q) => (answers[q.id] ?? 0) <= 3).map((q) => q.area),
    [answers],
  );

  const current = questions[step];
  const progress = stage === "quiz" ? (step / questions.length) * 100 : 100;

  function answer(value: number) {
    if (!current) return;
    setAnswers((prev) => ({ ...prev, [current.id]: value }));
    if (step === questions.length - 1) setStage("form");
    else setStep((s) => s + 1);
  }

  function submitLead(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const parsed = leadSchema.safeParse(data);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    setStage("result");
    toast.success("Diagnóstico gerado!", { description: "Enviamos uma cópia para o seu e-mail." });
  }

  const m = maturity(score);

  return (
    <section id="diagnostico" className="py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-5 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-accent px-3.5 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Exclusivo
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-graphite sm:text-4xl">
            Diagnóstico gratuito de conformidade
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Responda 10 perguntas e receba seu score, nível de maturidade, principais riscos e
            recomendações em menos de 2 minutos.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <Progress value={progress} className="h-1.5 rounded-none" />

          <div className="p-6 sm:p-9">
            {stage === "quiz" && current ? (
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                  <span className="text-primary">{current.area}</span>
                  <span>
                    {step + 1} de {questions.length}
                  </span>
                </div>
                <h3 className="mt-3 text-xl font-bold text-graphite sm:text-2xl">{current.text}</h3>

                <div className="mt-6 grid gap-3">
                  {options.map((o) => (
                    <button
                      key={o.label}
                      type="button"
                      onClick={() => answer(o.value)}
                      className="flex items-center justify-between rounded-xl border border-border bg-background px-5 py-4 text-left text-sm font-medium text-graphite transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-accent"
                    >
                      {o.label}
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </button>
                  ))}
                </div>

                {step > 0 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s - 1)}
                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="h-4 w-4" /> Voltar
                  </button>
                ) : null}
              </div>
            ) : null}

            {stage === "form" ? (
              <form onSubmit={submitLead} className="grid gap-4">
                <h3 className="text-xl font-bold text-graphite sm:text-2xl">
                  Seu diagnóstico está pronto
                </h3>
                <p className="-mt-2 text-sm text-muted-foreground">
                  Informe seus dados para visualizar o resultado completo.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <LeadField label="Nome" name="nome" error={errors["nome"]} />
                  <LeadField label="Empresa" name="empresa" error={errors["empresa"]} />
                  <LeadField label="Cargo" name="cargo" error={errors["cargo"]} />
                  <LeadField label="Telefone" name="telefone" type="tel" error={errors["telefone"]} />
                </div>
                <LeadField label="E-mail corporativo" name="email" type="email" error={errors["email"]} />
                <Button type="submit" size="lg" className="mt-1">
                  Ver meu resultado
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Dados tratados conforme a LGPD.
                </p>
              </form>
            ) : null}

            {stage === "result" ? (
              <div>
                <div className="grid items-center gap-6 sm:grid-cols-[auto_minmax(0,1fr)]">
                  <div className="relative mx-auto h-32 w-32">
                    <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90">
                      <circle
                        cx="60"
                        cy="60"
                        r="52"
                        fill="none"
                        stroke="var(--secondary)"
                        strokeWidth="12"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="52"
                        fill="none"
                        stroke="var(--primary)"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={`${(score / 100) * 2 * Math.PI * 52} ${2 * Math.PI * 52}`}
                      />
                    </svg>
                    <div className="absolute inset-0 grid place-items-center">
                      <span className="font-display text-3xl font-extrabold text-graphite">
                        {score}
                      </span>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 text-sm font-semibold text-primary">
                      <Gauge className="h-4 w-4" /> Nível de maturidade
                    </p>
                    <h3 className="mt-1 text-2xl font-extrabold text-graphite">{m.level}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{m.text}</p>
                  </div>
                </div>

                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  <div className="rounded-xl border border-border bg-surface p-5">
                    <p className="flex items-center gap-2 text-sm font-bold text-graphite">
                      <ShieldAlert className="h-4 w-4 text-destructive" /> Principais riscos
                    </p>
                    {risks.length ? (
                      <ul className="mt-3 grid gap-1.5 text-sm text-muted-foreground">
                        {risks.map((r) => (
                          <li key={r}>• {r} sem controle estruturado</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-3 text-sm text-muted-foreground">
                        Nenhum risco crítico identificado. Foco em otimização contínua.
                      </p>
                    )}
                  </div>
                  <div className="rounded-xl border border-border bg-surface p-5">
                    <p className="flex items-center gap-2 text-sm font-bold text-graphite">
                      <Sparkles className="h-4 w-4 text-primary" /> Recomendações
                    </p>
                    <ul className="mt-3 grid gap-1.5 text-sm text-muted-foreground">
                      <li>• Centralizar documentos e evidências em base única</li>
                      <li>• Automatizar alertas de prazos e condicionantes</li>
                      <li>• Implantar coleta em campo pelo aplicativo mobile</li>
                      <li>• Ativar dashboards executivos em tempo real</li>
                    </ul>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="mt-8 w-full"
                  onClick={() => {
                    setStage("quiz");
                    setStep(0);
                    setAnswers({});
                  }}
                >
                  Refazer diagnóstico
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function LeadField({
  label,
  name,
  type = "text",
  error,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string | undefined;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={`diag-${name}`}>{label}</Label>
      <Input id={`diag-${name}`} name={name} type={type} maxLength={255} aria-invalid={!!error} />
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
