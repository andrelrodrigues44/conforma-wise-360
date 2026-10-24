import { useEffect, useState } from "react";

// Turmas abertas do site de treinamentos (treinamento.conforma360.com.br).
// A lista vem da API pública de lá; se ela falhar ou estiver vazia, nada do destaque aparece.
export const TREINAMENTOS_URL = "https://treinamento.conforma360.com.br";
const API_URL = `${TREINAMENTOS_URL}/api/turmas-abertas`;

export type TurmaAberta = {
  id: string;
  training_slug: string;
  training_name: string;
  start_date: string;
  end_date: string | null;
  schedule_text: string | null;
  modality: string;
  location: string | null;
  price_cents: number;
  seats_left: number | null;
};

let cache: Promise<TurmaAberta[]> | null = null;

function carregar(): Promise<TurmaAberta[]> {
  if (!cache) {
    cache = fetch(API_URL, { headers: { Accept: "application/json" } })
      .then((r) => (r.ok ? (r.json() as Promise<TurmaAberta[]>) : []))
      .catch(() => {
        cache = null;
        return [] as TurmaAberta[];
      });
  }
  return cache;
}

/** Turmas publicadas e com vaga, da mais próxima para a mais distante. */
export function useTurmasAbertas(): TurmaAberta[] {
  const [turmas, setTurmas] = useState<TurmaAberta[]>([]);
  useEffect(() => {
    let vivo = true;
    carregar().then((t) => {
      if (vivo) setTurmas(Array.isArray(t) ? t.filter((x) => x.seats_left !== 0) : []);
    });
    return () => {
      vivo = false;
    };
  }, []);
  return turmas;
}

export function urlInscricao(t: TurmaAberta, origem: string): string {
  return `${TREINAMENTOS_URL}/inscricao/${t.id}?utm_source=${origem}&utm_medium=site&utm_campaign=turma-aberta`;
}

export function urlCurso(t: TurmaAberta, origem: string): string {
  return `${TREINAMENTOS_URL}/treinamentos/${t.training_slug}?utm_source=${origem}&utm_medium=site&utm_campaign=turma-aberta`;
}

export function formatarPreco(centavos: number): string {
  return (centavos / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** "26 e 27/11" (curto) ou "26 a 27 de novembro de 2026" (longo). */
export function periodo(t: Pick<TurmaAberta, "start_date" | "end_date">, curto = false): string {
  const ini = new Date(t.start_date + "T00:00:00");
  const fim = t.end_date ? new Date(t.end_date + "T00:00:00") : null;
  const dia = (d: Date) => d.getDate();
  const mes2 = (d: Date) => String(d.getMonth() + 1).padStart(2, "0");
  if (!fim || fim.getTime() === ini.getTime()) {
    return curto
      ? `${dia(ini)}/${mes2(ini)}`
      : ini.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });
  }
  if (curto) return `${dia(ini)} e ${dia(fim)}/${mes2(ini)}`;
  if (ini.getMonth() === fim.getMonth()) {
    return `${dia(ini)} e ${dia(fim)} de ${ini.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}`;
  }
  return `${ini.toLocaleDateString("pt-BR", { day: "numeric", month: "long" })} a ${fim.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}`;
}

export function diasAte(iso: string): number {
  const inicio = new Date(iso + "T00:00:00").getTime();
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((inicio - hoje.getTime()) / 86400000));
}

export function rotuloDias(iso: string): string {
  const d = diasAte(iso);
  if (d === 0) return "começa hoje";
  if (d === 1) return "começa amanhã";
  return `começa em ${d} dias`;
}

export function rotuloModalidade(t: Pick<TurmaAberta, "modality" | "location">): string {
  if (t.modality === "Online") return "online ao vivo";
  return t.location ? `${t.modality.toLowerCase()} · ${t.location}` : t.modality.toLowerCase();
}
