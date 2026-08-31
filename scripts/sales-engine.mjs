const apiKey = process.env.ANTHROPIC_API_KEY;
const supabaseUrl = process.env.MARKETING_SUPABASE_URL;
const marketingKey = process.env.MARKETING_SUPABASE_KEY;
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

  const body = await response.text();

  if (!response.ok) {
    throw new Error(`Supabase ${response.status}: ${body || "resposta vazia"}`);
  }

  if (!body.trim()) return null;

  try {
    return JSON.parse(body);
  } catch (error) {
    throw new Error(`Supabase retornou JSON inválido. status=${response.status}; erro=${error.message}; conteúdo=${body.slice(0, 2000)}`);
  }
}

const leads = await supabase(
  "leads_site?select=id,nome,empresa,cargo,linha_comercial,interesse,segmento,porte,unidades,score,temperatura,etapa,status,proxima_acao,ultimo_contato_em&status=eq.aberto&temperatura=in.(hot,warm)&order=score.desc&limit=20",
);

if (!leads?.length) {
  console.log("Sales Engine: nenhum lead HOT/WARM aberto para processar.");
  process.exit(0);
}

const prompt = `Você é o SDR IA da Conforma360.
Gere um rascunho de follow-up para cada lead abaixo.

OBJETIVO: avançar leads para diagnóstico de consultoria, demonstração da plataforma ou ambos.
REGRAS: português do Brasil; técnico, humano e curto; não inventar informações; não prometer resultados; não enviar nada; produzir somente rascunhos para aprovação humana.

Para cada lead, preencha: lead_id, etapa_recomendada, canal, assunto, mensagem, justificativa.
Canal: email ou whatsapp.
Etapa recomendada: qualificacao, diagnostico ou demonstracao.

LEADS:
${JSON.stringify(leads, null, 2)}`;

const followupSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    followups: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          lead_id: { type: "string" },
          etapa_recomendada: { type: "string", enum: ["qualificacao", "diagnostico", "demonstracao"] },
          canal: { type: "string", enum: ["email", "whatsapp"] },
          assunto: { type: "string" },
          mensagem: { type: "string" },
          justificativa: { type: "string" },
        },
        required: ["lead_id", "etapa_recomendada", "canal", "assunto", "mensagem", "justificativa"],
      },
    },
  },
  required: ["followups"],
};

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
    thinking: { type: "disabled" },
    tools: [
      {
        name: "generate_followups",
        description: "Gera rascunhos de follow-up para os leads fornecidos. Não envia mensagens.",
        input_schema: followupSchema,
      },
    ],
    tool_choice: { type: "tool", name: "generate_followups" },
    messages: [{ role: "user", content: prompt }],
  }),
});

if (!response.ok) throw new Error(`Anthropic API ${response.status}: ${await response.text()}`);

const result = await response.json();
const stopReason = result.stop_reason || "unknown";
const blocks = Array.isArray(result.content) ? result.content : [];
const toolBlock = blocks.find((block) => block.type === "tool_use" && block.name === "generate_followups");

console.log(`Sales Engine: Anthropic stop_reason=${stopReason}, blocos=${blocks.length}, tool_use=${Boolean(toolBlock)}.`);

if (stopReason === "refusal") throw new Error("Anthropic recusou a geração do follow-up.");
if (!toolBlock || !toolBlock.input) {
  throw new Error(`Anthropic não retornou tool_use estruturado. stop_reason=${stopReason}; blocos=${JSON.stringify(blocks).slice(0, 3000)}`);
}

const parsed = toolBlock.input;
if (!parsed || !Array.isArray(parsed.followups)) {
  throw new Error("Tool use da Anthropic retornou estrutura inválida: followups não é um array.");
}

const leadIds = new Set(leads.map((lead) => lead.id));
let created = 0;

for (const item of parsed.followups) {
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

  created += 1;
}

console.log(`Sales Engine: ${created} rascunhos processados para aprovação.`);
