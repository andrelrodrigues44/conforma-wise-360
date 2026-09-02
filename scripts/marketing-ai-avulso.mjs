// Gera conteúdo avulso pra temas específicos (fora do calendário
// semanal automático de marketing-ai.mjs) -- uso: quando o usuário quer
// um ou mais posts sobre um assunto pontual, não a campanha da semana
// inteira. Mesma qualidade de texto/regras de segurança do pipeline
// semanal, só que os temas vêm de fora (array TEMAS abaixo) em vez de a
// IA escolher sozinha. Mesma decisão do resto do pipeline: só texto --
// a imagem é anexada manualmente depois pelo painel.
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

// Temas desta rodada -- editar aqui pra próximas rodadas avulsas.
const TEMAS = [
  { tema: "PSI — Gestão de Riscos Psicossociais (NR-01)", canal: "linkedin", linha_comercial: "ambos" },
  { tema: "PGR — Programa de Gerenciamento de Riscos", canal: "linkedin", linha_comercial: "ambos" },
  { tema: "Treinamento técnico de operação de equipamentos", canal: "instagram", linha_comercial: "consultoria" },
];

const hoje = new Date();
const data = hoje.toISOString().slice(0, 10);
const outputDir = path.resolve("marketing/generated");
const outputFile = path.join(outputDir, `${data}-conteudos-avulsos.md`);

function proximoDiaUtilIso(baseIso, offset) {
  const date = new Date(`${baseIso}T13:00:00Z`);
  let remaining = offset;
  while (remaining > 0) {
    date.setUTCDate(date.getUTCDate() + 1);
    const weekday = date.getUTCDay();
    if (weekday !== 0 && weekday !== 6) remaining--;
  }
  return date.toISOString();
}

const prompt = `Você é o agente de Growth Marketing da Conforma360.

MISSÃO COMERCIAL
Gerar demanda qualificada e vendas B2B no Brasil para duas linhas complementares:
1) CONSULTORIA CONFORMA360: Meio Ambiente, SST, Compliance, licenciamento, requisitos legais, ISO 14001/45001, auditorias e serviços técnicos.
2) PLATAFORMA CONFORMA360: software para gestão integrada de Meio Ambiente, SST, Compliance, documentos, requisitos legais, evidências, inspeções, auditorias, planos de ação, indicadores e IA.

PRIORIDADES DE MERCADO
Priorize mineração, indústria, empresas com múltiplas unidades, operações complexas e organizações que precisam demonstrar conformidade e controle.

TAREFA
Gere 1 conteúdo pra cada um destes ${TEMAS.length} temas, NESTA ORDEM, cada um com público, objetivo, headline, legenda, CTA e métrica próprios (não repita a mesma ideia entre eles):
${TEMAS.map((t, i) => `${i + 1}) Tema: "${t.tema}" — canal: ${t.canal} — linha comercial: ${t.linha_comercial}`).join("\n")}

DESTAQUE NO HEADLINE
Em "headline_destaque", copie um trecho de 2 a 5 palavras que exista EXATAMENTE dentro do "headline" (cópia literal) — o trecho mais forte (risco, benefício ou produto).

TOM
Português do Brasil. Técnico, objetivo, premium, claro e comercialmente responsável. Evite conteúdo genérico, frases vazias e promessas absolutas.

REGRAS DE SEGURANÇA
- Não invente clientes, cases, resultados, certificações, integrações, números, depoimentos ou funcionalidades.
- Não prometa conformidade garantida, ausência de multas ou resultados financeiros.
- Não apresente requisito legal como aconselhamento jurídico individual.
- Quando mencionar legislação, indique que a aplicabilidade deve ser validada conforme o contexto da organização.
- Sempre distinguir Consultoria de Plataforma.

Retorne exatamente ${TEMAS.length} itens em "conteudos", na mesma ordem dos temas acima.`;

const schema = {
  type: "object",
  additionalProperties: false,
  properties: {
    conteudos: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          tema: { type: "string" },
          dor_oportunidade: { type: "string" },
          objetivo: { type: "string" },
          headline: { type: "string" },
          headline_destaque: { type: "string" },
          legenda: { type: "string" },
          cta: { type: "string" },
          criativo: { type: "string" },
          metrica: { type: "string" },
        },
        required: ["tema", "dor_oportunidade", "objetivo", "headline", "headline_destaque", "legenda", "cta", "criativo", "metrica"],
      },
    },
  },
  required: ["conteudos"],
};

const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "content-type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
  body: JSON.stringify({ model, max_tokens: 4000, thinking: { type: "disabled" }, output_config: { format: { type: "json_schema", schema } }, messages: [{ role: "user", content: prompt }] }),
});

if (!response.ok) throw new Error(`Anthropic API ${response.status}: ${await response.text()}`);
const result = await response.json();
const block = (result.content || []).find((item) => item.type === "text");
if (!block?.text) throw new Error(`Anthropic não retornou conteúdo textual. stop_reason=${result.stop_reason || "unknown"}`);

let generated;
try { generated = JSON.parse(block.text); } catch (error) { throw new Error(`JSON inválido: ${error.message}`); }
if (!Array.isArray(generated.conteudos) || generated.conteudos.length !== TEMAS.length) {
  throw new Error(`Esperava ${TEMAS.length} conteúdos, veio ${generated.conteudos?.length ?? "campo ausente"}.`);
}

async function supabase(pathname, options = {}) {
  const res = await fetch(`${supabaseUrl}/rest/v1/${pathname}`, { ...options, headers: { apikey: marketingKey, Authorization: `Bearer ${marketingKey}`, "Content-Type": "application/json", ...(options.headers || {}) } });
  const body = await res.text();
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${body}`);
  return body ? JSON.parse(body) : null;
}

const inserted = await supabase("marketing_campaigns?select=id", { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify({ nome: `Conteúdos avulsos — ${data}`, objetivo: "Conteúdo pontual sob demanda", linha_comercial: "ambos", segmento: null, periodo_inicio: data, status: "rascunho" }) });
const campaignId = inserted?.[0]?.id;
if (!campaignId) throw new Error("Supabase não retornou o ID da campanha criada.");

for (const [index, item] of generated.conteudos.entries()) {
  const tema = TEMAS[index];
  const brief = `${item.tema}. Dor/oportunidade: ${item.dor_oportunidade}. Criativo: ${item.criativo}. Métrica: ${item.metrica}.\n\nDestaque no headline: "${item.headline_destaque}".`;
  await supabase("marketing_contents", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ campaign_id: campaignId, canal: tema.canal, formato: "post", linha_comercial: tema.linha_comercial, titulo: item.headline, legenda: item.legenda, cta: item.cta, criativo_brief: brief, data_publicacao: proximoDiaUtilIso(data, index), status: "revisar" }) });
}

await fs.mkdir(outputDir, { recursive: true });
const lines = [`# Conteúdos avulsos — ${data}`];
generated.conteudos.forEach((item, index) => {
  lines.push(`## ${index + 1}) ${TEMAS[index].tema}`, `- Canal: ${TEMAS[index].canal}`, `- Linha comercial: ${TEMAS[index].linha_comercial}`, `- Headline: ${item.headline}`, `- Destaque: ${item.headline_destaque}`, `- Legenda: ${item.legenda}`, `- CTA: ${item.cta}`, `- Ideia de criativo: ${item.criativo}`, `- Métrica: ${item.metrica}`, "");
});
await fs.writeFile(outputFile, `${lines.join("\n")}\n`, "utf8");
console.log(`Conteúdos avulsos gerados: ${outputFile} | campaign_id=${campaignId} | conteúdos=${generated.conteudos.length}`);
