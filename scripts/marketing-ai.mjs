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
const repoRawBase = "https://raw.githubusercontent.com/andrelrodrigues44/conforma-wise-360/main/marketing/generated";

// A campanha tem 1 conteúdo por dia útil (campaign.dias, seção "Distribua
// os 5 dias úteis..." no prompt) -- offset 0 é o próprio dia da geração
// (sempre segunda, pelo cron), os seguintes pulam fim de semana. Não
// tenta interpretar o texto livre item.dia (ex. "Terça-feira") -- usa a
// posição no array, que é ordem garantida. data_publicacao é
// TIMESTAMPTZ (não DATE) -- retorna um timestamp completo, às 13h UTC
// (10h BRT), não só a data, senão o horário salvo vira meia-noite UTC.
function addBusinessDaysIso(baseIso, offset) {
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
  headers: { "content-type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
  body: JSON.stringify({ model, max_tokens: 9000, thinking: { type: "disabled" }, output_config: { format: { type: "json_schema", schema } }, messages: [{ role: "user", content: prompt }] }),
});

if (!response.ok) throw new Error(`Anthropic API ${response.status}: ${await response.text()}`);
const result = await response.json();
const block = (result.content || []).find((item) => item.type === "text");
if (!block?.text) throw new Error(`Anthropic não retornou conteúdo textual. stop_reason=${result.stop_reason || "unknown"}`);

let campaign;
try { campaign = JSON.parse(block.text); } catch (error) { throw new Error(`JSON da campanha inválido: ${error.message}`); }

async function supabase(pathname, options = {}) {
  const res = await fetch(`${supabaseUrl}/rest/v1/${pathname}`, { ...options, headers: { apikey: marketingKey, Authorization: `Bearer ${marketingKey}`, "Content-Type": "application/json", ...(options.headers || {}) } });
  const body = await res.text();
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${body}`);
  return body ? JSON.parse(body) : null;
}

function esc(value) { return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

function creativeSvg(item, index) {
  const headline = esc(item.headline).slice(0, 150);
  const theme = esc(item.tema).slice(0, 120);
  const cta = esc(item.cta).slice(0, 90);
  const line = item.linha_comercial === "consultoria" ? "CONSULTORIA" : item.linha_comercial === "plataforma" ? "PLATAFORMA" : "CONSULTORIA + PLATAFORMA";
  const channel = esc(item.canal).toUpperCase();
  const file = `${data}-criativo-${index + 1}.svg`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350"><rect width="1080" height="1350" fill="#f5f7f6"/><rect width="1080" height="18" fill="#0b7f43"/><circle cx="930" cy="150" r="180" fill="#e3f2ea"/><circle cx="930" cy="150" r="105" fill="#d2eadc"/><text x="80" y="105" font-family="Arial,sans-serif" font-size="28" font-weight="700" letter-spacing="7" fill="#0b7f43">CONFORMA360</text><text x="80" y="155" font-family="Arial,sans-serif" font-size="22" font-weight="700" letter-spacing="4" fill="#6b7280">${esc(line)}</text><text x="80" y="270" font-family="Arial,sans-serif" font-size="25" font-weight="700" fill="#0b7f43">${theme}</text><foreignObject x="80" y="330" width="900" height="500"><div xmlns="http://www.w3.org/1999/xhtml" style="font-family:Arial,sans-serif;font-size:64px;font-weight:800;line-height:1.08;color:#202124">${headline}</div></foreignObject><rect x="80" y="900" width="920" height="3" fill="#d7ded9"/><text x="80" y="975" font-family="Arial,sans-serif" font-size="23" fill="#6b7280">PRÉVIA PARA APROVAÇÃO • ${channel}</text><rect x="80" y="1050" rx="18" width="650" height="90" fill="#0b7f43"/><text x="115" y="1107" font-family="Arial,sans-serif" font-size="30" font-weight="700" fill="white">${cta}</text><text x="80" y="1260" font-family="Arial,sans-serif" font-size="20" fill="#7b8580">CONFORMA360 Marketing AI</text></svg>`;
  return { file, svg };
}

const inserted = await supabase("marketing_campaigns?select=id", { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify({ nome: `Campanha semanal — ${data}`, objetivo: campaign.objetivo_comercial, linha_comercial: "ambos", segmento: campaign.publico_prioritario, periodo_inicio: data, status: "rascunho" }) });
const campaignId = inserted?.[0]?.id;
if (!campaignId) throw new Error("Supabase não retornou o ID da campanha criada.");

await fs.mkdir(outputDir, { recursive: true });
for (const [index, item] of campaign.dias.entries()) {
  const creative = creativeSvg(item, index);
  await fs.writeFile(path.join(outputDir, creative.file), creative.svg, "utf8");
  const creativeUrl = `${repoRawBase}/${creative.file}`;
  await supabase("marketing_contents", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ campaign_id: campaignId, canal: item.canal, formato: "post", linha_comercial: item.linha_comercial, titulo: item.headline, legenda: item.legenda, cta: item.cta, criativo_brief: `${item.tema}. Dor/oportunidade: ${item.dor_oportunidade}. Criativo: ${item.criativo}. Métrica: ${item.metrica}.`, criativo_url: creativeUrl, criativo_alt: `Prévia Conforma360: ${item.headline}`, data_publicacao: addBusinessDaysIso(data, index), status: "revisar" }) });
}

const lines = [`# Campanha semanal — ${data}`, "## Objetivo comercial", campaign.objetivo_comercial, "## Público prioritário", campaign.publico_prioritario, "## Oferta principal", campaign.oferta_principal, "## Estratégia de aquisição", campaign.estrategia_aquisicao, "## Calendário"];
campaign.dias.forEach((item, index) => { lines.push(`### Dia ${index + 1} — ${item.dia}`, `- Canal: ${item.canal}`, `- Linha comercial: ${item.linha_comercial}`, `- Tema: ${item.tema}`, `- Dor ou oportunidade: ${item.dor_oportunidade}`, `- Objetivo: ${item.objetivo}`, `- Headline: ${item.headline}`, `- Legenda completa: ${item.legenda}`, `- CTA: ${item.cta}`, `- Ideia de criativo: ${item.criativo}`, `- Métrica principal: ${item.metrica}`, `- Prévia visual: ${repoRawBase}/${data}-criativo-${index + 1}.svg`); });
lines.push("## Ativos de conversão", ...campaign.ativos_conversao.map((x) => `- ${x}`), "## Sequência de follow-up", ...campaign.followups.map((x) => `- ${x}`), "## Hipóteses de teste", ...campaign.testes_ab.map((x) => `- ${x}`), "## Próximas ações comerciais", ...campaign.proximas_acoes.map((x) => `- ${x}`), "## Critérios de aprovação", ...campaign.criterios_aprovacao.map((x) => `- ${x}`), "", "---", "Gerado automaticamente pelo CONFORMA360 Marketing AI.");
await fs.writeFile(outputFile, `${lines.join("\n")}\n`, "utf8");
console.log(`Campanha gerada e persistida: ${outputFile} | campaign_id=${campaignId} | conteúdos=${campaign.dias.length}`);
