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

FORMATO
Pelo menos 1 dos 5 dias deve usar formato "carrossel" (varia o formato da semana; use "post" nos demais, salvo se o tema realmente pedir carrossel — ex. passo a passo, antes/depois, checklist, mitos vs fatos). Quando formato for "carrossel", preencha "slides" com 3 a 6 frases curtas (uma por slide, cada uma cabendo num cartão visual): a primeira é o gancho/capa, as intermediárias desenvolvem o raciocínio, a última reforça o CTA. Quando formato for "post", deixe "slides" como array vazio.

DESTAQUE NO HEADLINE
Em "headline_destaque", copie um trecho de 2 a 5 palavras que exista EXATAMENTE dentro do "headline" (mesma pontuação e acentuação, cópia literal) — esse trecho é o que deve ser destacado em cor quando a peça visual for montada. Escolha a parte mais forte do headline (o risco, o benefício ou o produto), nunca a frase inteira.

TOM
Português do Brasil. Técnico, objetivo, premium, claro e comercialmente responsável. Evite conteúdo genérico, frases vazias e promessas absolutas.

REGRAS DE SEGURANÇA
- Não invente clientes, cases, resultados, certificações, integrações, números, depoimentos ou funcionalidades.
- Não prometa conformidade garantida, ausência de multas ou resultados financeiros.
- Não apresente requisito legal como aconselhamento jurídico individual.
- Quando mencionar legislação, indique que a aplicabilidade deve ser validada conforme o contexto da organização.
- Não publicar automaticamente em redes sociais nesta etapa; gerar conteúdo para revisão/aprovação.
- Sempre distinguir Consultoria de Plataforma.

CONTAGENS OBRIGATÓRIAS (o schema não trava isso — siga à risca)
- "dias": exatamente 5 itens.
- "ativos_conversao": exatamente 2 itens.
- "followups": exatamente 3 itens.
- "testes_ab": exatamente 3 itens.
- "proximas_acoes": exatamente 5 itens.
- "criterios_aprovacao": entre 4 e 8 itens.

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
          headline_destaque: { type: "string" },
          legenda: { type: "string" },
          cta: { type: "string" },
          criativo: { type: "string" },
          metrica: { type: "string" },
          formato: { type: "string", enum: ["post", "carrossel"] },
          slides: { type: "array", items: { type: "string" } },
        },
        required: ["dia", "canal", "linha_comercial", "tema", "dor_oportunidade", "objetivo", "headline", "headline_destaque", "legenda", "cta", "criativo", "metrica", "formato", "slides"],
      },
    },
    ativos_conversao: { type: "array", items: { type: "string" } },
    followups: { type: "array", items: { type: "string" } },
    testes_ab: { type: "array", items: { type: "string" } },
    proximas_acoes: { type: "array", items: { type: "string" } },
    criterios_aprovacao: { type: "array", items: { type: "string" } },
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

// O schema não trava mais "minItems" diferente de 0/1 (a API da Anthropic
// passou a rejeitar isso em output_config.format.schema) -- a contagem
// exata agora só é pedida no prompt, então validamos aqui e falhamos
// alto/claro em vez de publicar uma campanha incompleta.
function validarContagem(nome, valor, min, max = min) {
  const tamanho = Array.isArray(valor) ? valor.length : -1;
  if (tamanho < min || tamanho > max) throw new Error(`Campanha inválida: "${nome}" deveria ter ${min === max ? `${min} itens` : `entre ${min} e ${max} itens`}, veio ${tamanho < 0 ? "campo ausente/inválido" : tamanho}.`);
}
validarContagem("dias", campaign.dias, 5);
validarContagem("ativos_conversao", campaign.ativos_conversao, 2);
validarContagem("followups", campaign.followups, 3);
validarContagem("testes_ab", campaign.testes_ab, 3);
validarContagem("proximas_acoes", campaign.proximas_acoes, 5);
validarContagem("criterios_aprovacao", campaign.criterios_aprovacao, 4, 8);

async function supabase(pathname, options = {}) {
  const res = await fetch(`${supabaseUrl}/rest/v1/${pathname}`, { ...options, headers: { apikey: marketingKey, Authorization: `Bearer ${marketingKey}`, "Content-Type": "application/json", ...(options.headers || {}) } });
  const body = await res.text();
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${body}`);
  return body ? JSON.parse(body) : null;
}

const inserted = await supabase("marketing_campaigns?select=id", { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify({ nome: `Campanha semanal — ${data}`, objetivo: campaign.objetivo_comercial, linha_comercial: "ambos", segmento: campaign.publico_prioritario, periodo_inicio: data, status: "rascunho" }) });
const campaignId = inserted?.[0]?.id;
if (!campaignId) throw new Error("Supabase não retornou o ID da campanha criada.");

// A IA só prepara o TEXTO -- a arte é feita fora e anexada manualmente
// pelo painel (upload direto, inclusive do celular). criativo_url nasce
// vazio; quando é carrossel, o roteiro completo dos slides (o que cada
// imagem precisa dizer, na ordem) vai dentro de criativo_brief, pra
// quem for desenhar saber exatamente o texto de cada slide.
for (const [index, item] of campaign.dias.entries()) {
  const isCarrossel = item.formato === "carrossel" && Array.isArray(item.slides) && item.slides.length >= 2;
  const brief = isCarrossel
    ? `${item.tema}. Dor/oportunidade: ${item.dor_oportunidade}. Criativo: ${item.criativo}. Métrica: ${item.metrica}.\n\nRoteiro do carrossel (${item.slides.length} slides, nesta ordem):\n${item.slides.map((s, i) => `${i + 1}) ${s}`).join("\n")}\n\nDestaque no headline principal: "${item.headline_destaque}".`
    : `${item.tema}. Dor/oportunidade: ${item.dor_oportunidade}. Criativo: ${item.criativo}. Métrica: ${item.metrica}.\n\nDestaque no headline: "${item.headline_destaque}".`;
  await supabase("marketing_contents", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ campaign_id: campaignId, canal: item.canal, formato: isCarrossel ? "carrossel" : "post", linha_comercial: item.linha_comercial, titulo: item.headline, legenda: item.legenda, cta: item.cta, criativo_brief: brief, data_publicacao: addBusinessDaysIso(data, index), status: "revisar" }) });
}

await fs.mkdir(outputDir, { recursive: true });
const lines = [`# Campanha semanal — ${data}`, "## Objetivo comercial", campaign.objetivo_comercial, "## Público prioritário", campaign.publico_prioritario, "## Oferta principal", campaign.oferta_principal, "## Estratégia de aquisição", campaign.estrategia_aquisicao, "## Calendário"];
campaign.dias.forEach((item, index) => {
  const isCarrossel = item.formato === "carrossel" && Array.isArray(item.slides) && item.slides.length >= 2;
  lines.push(`### Dia ${index + 1} — ${item.dia}`, `- Canal: ${item.canal}`, `- Formato: ${isCarrossel ? "carrossel" : "post"}`, `- Linha comercial: ${item.linha_comercial}`, `- Tema: ${item.tema}`, `- Dor ou oportunidade: ${item.dor_oportunidade}`, `- Objetivo: ${item.objetivo}`, `- Headline: ${item.headline}`, `- Destaque do headline: ${item.headline_destaque}`, `- Legenda completa: ${item.legenda}`, `- CTA: ${item.cta}`, `- Ideia de criativo: ${item.criativo}`, `- Métrica principal: ${item.metrica}`);
  if (isCarrossel) lines.push(`- Roteiro do carrossel (${item.slides.length} slides):`, ...item.slides.map((s, i) => `  ${i + 1}) ${s}`));
});
lines.push("## Ativos de conversão", ...campaign.ativos_conversao.map((x) => `- ${x}`), "## Sequência de follow-up", ...campaign.followups.map((x) => `- ${x}`), "## Hipóteses de teste", ...campaign.testes_ab.map((x) => `- ${x}`), "## Próximas ações comerciais", ...campaign.proximas_acoes.map((x) => `- ${x}`), "## Critérios de aprovação", ...campaign.criterios_aprovacao.map((x) => `- ${x}`), "", "---", "Gerado automaticamente pelo CONFORMA360 Marketing AI.");
await fs.writeFile(outputFile, `${lines.join("\n")}\n`, "utf8");
console.log(`Campanha gerada e persistida: ${outputFile} | campaign_id=${campaignId} | conteúdos=${campaign.dias.length}`);
