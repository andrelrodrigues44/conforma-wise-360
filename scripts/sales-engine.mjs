const apiKey = process.env.ANTHROPIC_API_KEY;
const supabaseUrl = process.env.SUPABASE_MARKETING_URL;
const marketingKey = process.env.SUPABASE_MARKETING_KEY;
const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";

if (!apiKey || !supabaseUrl || !marketingKey) {
  console.log("Sales Engine: secrets incompletos; nenhuma ação externa foi executada.");
  process.exit(0);
}

const headers = {
  apikey: marketingKey,
  Authorization: `Bearer ${marketingKey}`,
  "Content-Type": "application/json",
};

async function supabase(path, options = {}) {
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
  });
  if (!response.ok) throw new Error(`Supabase ${response.status}: ${await response.text()}`);
  return response.status === 204 ? null : response.json();
}

const leads = await supabase(
  "leads_site?select=id,nome,empresa,cargo,linha_comercial,interesse,segmento,porte,unidades,score,temperatura,etapa,status,proxima_acao,ultimo_contato_em&status=eq.aberto&temperatura=in.(hot,warm)&order=score.desc&limit=20",
);

if (!leads?.length) {
  console.log("Sales Engine: nenhum lead HOT/WARM aberto para processar.");
  process.exit(0);
}

const prompt = `Você é o SDR IA da Conforma360.
Gere rascunhos de follow-up para os leads abaixo.

OBJETIVO: avançar leads para diagnóstico de consultoria, demonstração da plataforma ou ambos.
REGRAS: português do Brasil; técnico, humano e curto; não inventar informações; não prometer resultados; não enviar nada; produzir somente rascunhos para aprovação humana.

Para cada lead, retorne um objeto com: lead_id, etapa_recomendada, canal, assunto, mensagem, justificativa.
Canal deve ser email ou whatsapp.
Etapa recomendada deve ser qualificacao, diagnostico ou demonstracao.

LEADS:
${JSON.stringify(leads, null, 2)}

Responda SOMENTE JSON válido no formato {"followups":[...]}.`;

const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "content-type": "application/json",
    "x-api-key": apiKey,
    "anthropic-version": "2023-06-01",
  },
  body: JSON.stringify({
    model,
    max_tokens: 5000,
    messages: [{ role: "user", content: prompt }],
  }),
});

if (!response.ok) throw new Error(`Anthropic API ${response.status}: ${await response.text()}`);

const result = await response.json();
const text = (result.content || [])
  .filter((block) => block.type === "text")
  .map((block) => block.text)
  .join("\n")
  .trim();

const start = text.indexOf("{");
const end = text.lastIndexOf("}");
if (start < 0 || end < start) throw new Error("Resposta da IA não contém JSON válido.");

const parsed = JSON.parse(text.slice(start, end + 1));
const leadIds = new Set(leads.map((lead) => lead.id));

for (const item of parsed.followups || []) {
  if (!leadIds.has(item.lead_id) || !item.mensagem) continue;

  await supabase("sales_followups", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      lead_id: item.lead_id,
      etapa: 2,
      canal: item.canal === "whatsapp" ? "whatsapp" : "email",
      assunto: item.assunto || "Conforma360 — próximo passo",
      mensagem: item.mensagem,
      agendado_para: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: "pendente",
    }),
  });

  await supabase("sales_activities", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      lead_id: item.lead_id,
      tipo: "ia_followup",
      descricao: `Rascunho de follow-up gerado pela IA. Canal: ${item.canal}. Etapa sugerida: ${item.etapa_recomendada}.`,
    }),
  });
}

console.log(`Sales Engine: ${parsed.followups?.length || 0} rascunhos processados para aprovação.`);
