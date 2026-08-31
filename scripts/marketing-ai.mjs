import fs from "node:fs/promises";
import path from "node:path";

const apiKey = process.env.ANTHROPIC_API_KEY;
const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";
const supabaseUrl = process.env.MARKETING_SUPABASE_URL;
const marketingKey = process.env.MARKETING_SUPABASE_KEY;

if (!apiKey || !supabaseUrl || !marketingKey) {
  console.error("Secrets incompletos: ANTHROPIC_API_KEY, MARKETING_SUPABASE_URL e MARKETING_SUPABASE_KEY são obrigatórios.");
  process.exit(1);
}

const hoje = new Date();
const data = hoje.toISOString().slice(0, 10);
const outputDir = path.resolve("marketing/generated");
const outputFile = path.join(outputDir, `${data}-campanha-semanal.md`);

const prompt = `Você é o agente de Growth Marketing da Conforma360.

MISSÃO COMERCIAL
Gerar demanda qualificada e vendas B2B no Brasil para duas linhas complementares:
1) CONSULTORIA CONFORMA360: Meio Ambiente, SST, Compliance, licenciamento, requisitos legais, ISO 14001/45001, auditorias e serviços técnicos.
2) PLATAFORMA CONFORMA360: software para gestão integrada de Meio Ambiente, SST, Compliance, documentos, requisitos legais, evidências, inspeções, auditorias, planos de ação, indicadores e IA.

PRIORIDADES DE MERCADO
Priorize mineração, indústria, empresas com múltiplas unidades, operações complexas e organizações que precisam demonstrar conformidade e controle.

ESTRATÉGIA
Distribua os 5 dias úteis entre dor/risco, educação, autoridade/prova, produto/demonstração e conversão. Cada conteúdo precisa ter público, objetivo, canal, CTA e métrica. A semana deve conduzir o público para consultoria, diagnóstico, demonstração ou conversa comercial.

TOM
Português do Brasil. Técnico, objetivo, premium, claro e comercialmente responsável. Evite conteúdo genérico, frases vazias e promessas absolutas.

REGRAS DE SEGURANÇA
- Não invente clientes, cases, resultados, certificações, integrações, números, depoimentos ou funcionalidades.
- Não prometa conformidade garantida, ausência de multas ou resultados financeiros.
- Não apresente requisito legal como aconselhamento jurídico individual.
- Quando mencionar legislação, indique que a aplicabilidade deve ser validada conforme o contexto da organização.
- Não publicar automaticamente em redes sociais nesta etapa; gerar conteúdo para revisão/aprovação.
- Sempre distinguir Consultoria de Plataforma.

Gere a campanha da próxima semana. Retorne SOMENTE um objeto compatível com o schema solicitado.`;

const schema = {
  type: "object",
  additionalProperties: false,
  properties: {
    objetivo_comercial: { type: "string" },
    publico_prioritario: { type: "string" },
    oferta_principal: { type: "string" },
    estrategia_aquisicao: { type: "string" },
    dias: {
      type: "array",
      minItems: 5,
      maxItems: 5,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          dia: { type: "string" },
          canal: { type: "string", enum: ["linkedin", "instagram", "email", "blog", "whatsapp"] },
          linha_comercial: { type: "string", enum: ["consultoria", "plataforma", "ambos"] },
          tema: { type: "string" },
          dor_oportunidade: { type: "string" },
          objetivo: { type: "string" },
          headline: { type: "string" },
          legenda: { type: "string" },
          cta: { type: "string" },
          criativo: { type: "string" },
          metrica: { type: "string" },
        },
        required: ["dia", "canal", "linha_comercial", "tema", "dor_oportunidade", "objetivo", "headline", "legenda", "cta", "criativo", "metrica"],
      },
    },
    ativos_conversao: { type: "array", minItems: 2, maxItems: 2, items: { type: "string" } },
    followups: { type: "array", minItems: 3, maxItems: 3, items: { type: "string" } },
    testes_ab: { type: "array", minItems: 3, maxItems: 3, items: { type: "string" } },
    proximas_acoes: { type: "array", minItems: 5, maxItems: 5, items: { type: "string" } },
    criterios_aprovacao: { type: "array", minItems: 4, maxItems: 8, items: { type: "string" } },
  },
  required: ["objetivo_comercial", "publico_prioritario", "oferta_principal", "estrategia_aquisicao", "dias", "ativos_conversao", "followups", "testes_ab", "proximas_acoes", "criterios_aprovacao"],
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
    max_tokens: 9000,
    thinking: { type: "disabled" },
    output_config: { format: { type: "json_schema", schema } },
    messages: [{ role: "user", content: prompt }],
  }),
});

if (!response.ok) throw new Error(`Anthropic API ${response.status}: ${await response.text()}`);
const result = await response.json();
const block = (result.content || []).find((item) => item.type === "text");
if (!block?.text) throw new Error(`Anthropic não retornou conteúdo textual. stop_reason=${result.stop_reason || "unknown"}`);

let campaign;
try {
  campaign = JSON.parse(block.text);
} catch (error) {
  throw new Error(`JSON da campanha inválido: ${error.message}`);
}

async function supabase(pathname, options = {}) {
  const res = await fetch(`${supabaseUrl}/rest/v1/${pathname}`, {
    ...options,
    headers: {
      apikey: marketingKey,
      Authorization: `Bearer ${marketingKey}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${body}`);
  return body ? JSON.parse(body) : null;
}

const inserted = await supabase("marketing_campaigns?select=id", {
  method: "POST",
  headers: { Prefer: "return=representation" },
  body: JSON.stringify({
    nome: `Campanha semanal — ${data}`,
    objetivo: campaign.objetivo_comercial,
    linha_comercial: "ambos",
    segmento: campaign.publico_prioritario,
    periodo_inicio: data,
    status: "rascunho",
  }),
});

const campaignId = inserted?.[0]?.id;
if (!campaignId) throw new Error("Supabase não retornou o ID da campanha criada.");

for (const item of campaign.dias) {
  await supabase("marketing_contents", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      campaign_id: campaignId,
      canal: item.canal,
      formato: "post",
      linha_comercial: item.linha_comercial,
      titulo: item.headline,
      legenda: item.legenda,
      cta: item.cta,
      criativo_brief: `${item.tema}. Dor/oportunidade: ${item.dor_oportunidade}. Criativo: ${item.criativo}. Métrica: ${item.metrica}.`,
      data_publicacao: null,
      status: "revisar",
    }),
  });
}

const lines = [
  `# Campanha semanal — ${data}`,
  "## Objetivo comercial", campaign.objetivo_comercial,
  "## Público prioritário", campaign.publico_prioritario,
  "## Oferta principal", campaign.oferta_principal,
  "## Estratégia de aquisição", campaign.estrategia_aquisicao,
  "## Calendário",
];

campaign.dias.forEach((item, index) => {
  lines.push(`### Dia ${index + 1} — ${item.dia}`);
  lines.push(`- Canal: ${item.canal}`);
  lines.push(`- Linha comercial: ${item.linha_comercial}`);
  lines.push(`- Tema: ${item.tema}`);
  lines.push(`- Dor ou oportunidade: ${item.dor_oportunidade}`);
  lines.push(`- Objetivo: ${item.objetivo}`);
  lines.push(`- Headline: ${item.headline}`);
  lines.push(`- Legenda completa: ${item.legenda}`);
  lines.push(`- CTA: ${item.cta}`);
  lines.push(`- Ideia de criativo: ${item.criativo}`);
  lines.push(`- Métrica principal: ${item.metrica}`);
});

lines.push("## Ativos de conversão", ...campaign.ativos_conversao.map((x) => `- ${x}`));
lines.push("## Sequência de follow-up", ...campaign.followups.map((x) => `- ${x}`));
lines.push("## Hipóteses de teste", ...campaign.testes_ab.map((x) => `- ${x}`));
lines.push("## Próximas ações comerciais", ...campaign.proximas_acoes.map((x) => `- ${x}`));
lines.push("## Critérios de aprovação", ...campaign.criterios_aprovacao.map((x) => `- ${x}`));
lines.push("", "---", "Gerado automaticamente pelo CONFORMA360 Marketing AI.");

await fs.mkdir(outputDir, { recursive: true });
await fs.writeFile(outputFile, `${lines.join("\n")}\n`, "utf8");
console.log(`Campanha gerada e persistida: ${outputFile} | campaign_id=${campaignId} | conteúdos=${campaign.dias.length}`);
