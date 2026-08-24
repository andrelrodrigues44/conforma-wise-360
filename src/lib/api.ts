const SUPABASE_URL = "https://eivwprsnderogsfxckus.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdndwcnNuZGVyb2dzZnhja3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyMTAzMDAsImV4cCI6MjA5OTc4NjMwMH0.LbBMkFunGDP5PX37SmYh7Y95fBEMh3ae4Rq8PJTyWK0";

export interface LeadDemoInput {
  nome: string;
  empresa: string;
  cargo?: string | undefined;
  email: string;
  telefone: string;
  mensagem?: string | undefined;
  website?: string | undefined; // honeypot -- sempre vazio num envio humano
}

export async function enviarLeadDemo(data: LeadDemoInput): Promise<void> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/capturar-lead-site`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Não foi possível enviar sua solicitação. Tente novamente em instantes.");
  }
}
