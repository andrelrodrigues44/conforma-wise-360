import { ArrowRight, CalendarCheck } from "lucide-react";
import {
  formatarPreco,
  periodo,
  rotuloDias,
  rotuloModalidade,
  urlInscricao,
  useTurmasAbertas,
} from "@/lib/turmas-abertas";

/** Faixa fina no topo do site, só aparece quando existe turma aberta no site de treinamentos. */
export function useTemTurmaAberta(): boolean {
  return useTurmasAbertas().length > 0;
}

export function TurmaAbertaFaixa() {
  const turmas = useTurmasAbertas();
  const t = turmas[0];
  if (!t) return null;
  const mais = turmas.length - 1;

  return (
    <a
      href={urlInscricao(t, "site-principal-faixa")}
      className="flex h-9 items-center gap-3 bg-primary px-5 text-xs text-primary-foreground transition-opacity hover:opacity-95 sm:text-sm lg:px-8"
      aria-label="Turma aberta: garantir vaga"
    >
      <CalendarCheck className="hidden h-4 w-4 shrink-0 sm:block" aria-hidden />
      <span className="min-w-0 flex-1 truncate">
        <span className="font-semibold">Inscrições abertas:</span> {t.training_name} ·{" "}
        {periodo(t, true)} · {rotuloModalidade(t)} ·{" "}
        <span className="font-semibold">{formatarPreco(t.price_cents)}</span>
        {mais > 0 ? ` · +${mais} ${mais === 1 ? "turma" : "turmas"}` : ""}
      </span>
      <span className="hidden shrink-0 items-center gap-1 rounded-md bg-white px-3 py-1 text-xs font-semibold text-primary sm:inline-flex">
        {rotuloDias(t.start_date)} · Garantir vaga <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </a>
  );
}
