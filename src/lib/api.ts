export interface LeadDemoInput {
  nome: string;
  empresa: string;
  cargo?: string | undefined;
  email: string;
  telefone: string;
  mensagem?: string | undefined;
  website?: string | undefined; // honeypot -- sempre vazio num envio humano
  // Qual serviço o visitante procura; o endpoint já grava e usa na pontuação do lead.
  linha_comercial?: "consultoria" | "plataforma" | "treinamento" | "ambos" | undefined;
  interesse?: string | undefined;
  // Origem do clique (anúncio pago, etc.), capturada da URL em src/lib/utm.ts. Ausente = tráfego
  // direto/orgânico.
  utm_source?: string | undefined;
  utm_medium?: string | undefined;
  utm_campaign?: string | undefined;
  utm_term?: string | undefined;
  utm_content?: string | undefined;
  gclid?: string | undefined;
  fbclid?: string | undefined;
}

export async function enviarLeadDemo(data: LeadDemoInput): Promise<void> {
  const res = await fetch("/api/public/capturar-lead-site", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Não foi possível enviar sua solicitação. Tente novamente em instantes.");
  }
}
