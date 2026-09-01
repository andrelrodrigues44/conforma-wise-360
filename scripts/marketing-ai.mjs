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

FORMATO
Pelo menos 1 dos 5 dias deve usar formato "carrossel" (varia o formato da semana; use "post" nos demais, salvo se o tema realmente pedir carrossel — ex. passo a passo, antes/depois, checklist, mitos vs fatos). Quando formato for "carrossel", preencha "slides" com 3 a 6 frases curtas (uma por slide, cada uma cabendo num cartão visual): a primeira é o gancho/capa, as intermediárias desenvolvem o raciocínio, a última reforça o CTA. Quando formato for "post", deixe "slides" como array vazio.

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
          legenda: { type: "string" },
          cta: { type: "string" },
          criativo: { type: "string" },
          metrica: { type: "string" },
          formato: { type: "string", enum: ["post", "carrossel"] },
          slides: { type: "array", items: { type: "string" } },
        },
        required: ["dia", "canal", "linha_comercial", "tema", "dor_oportunidade", "objetivo", "headline", "legenda", "cta", "criativo", "metrica", "formato", "slides"],
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

function esc(value) { return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

// librsvg (motor usado pelo sharp pra converter SVG->PNG em
// sync-marketing-creatives.mjs) não renderiza <foreignObject> de forma
// confiável -- o headline ficava em branco na imagem final mesmo com o
// SVG correto (texto SVG nativo, como o resto do cartão, sempre
// renderizou). Quebra de linha manual por contagem de caracteres +
// <tspan> por linha é a forma que funciona garantido em qualquer
// conversor, não só em navegador.
function wrapText(text, maxCharsPerLine) {
  const words = esc(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxCharsPerLine && current) { lines.push(current); current = word; }
    else current = candidate;
  }
  if (current) lines.push(current);
  return lines;
}
function headlineTspans(text, { x, firstBaselineY, lineHeight, maxLines, maxCharsPerLine }) {
  return wrapText(text, maxCharsPerLine).slice(0, maxLines).map((line, i) => `<tspan x="${x}" y="${firstBaselineY + i * lineHeight}">${line}</tspan>`).join("");
}

function creativeSvg(item, index) {
  const headlineText = headlineTspans(item.headline, { x: 80, firstBaselineY: 400, lineHeight: 70, maxLines: 7, maxCharsPerLine: 22 });
  const theme = esc(item.tema).slice(0, 120);
  const cta = esc(item.cta).slice(0, 90);
  const line = item.linha_comercial === "consultoria" ? "CONSULTORIA" : item.linha_comercial === "plataforma" ? "PLATAFORMA" : "CONSULTORIA + PLATAFORMA";
  const file = `${data}-criativo-${index + 1}.svg`;
  // Nada de texto "prévia para aprovação"/rodapé de ferramenta interna
  // aqui -- esta é a MESMA imagem que vira o post publicado depois de
  // aprovada, então só pode conter o que faria sentido no post real.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350"><rect width="1080" height="1350" fill="#f5f7f6"/><rect width="1080" height="18" fill="#0b7f43"/><circle cx="930" cy="150" r="180" fill="#e3f2ea"/><circle cx="930" cy="150" r="105" fill="#d2eadc"/><text x="80" y="105" font-family="Arial,sans-serif" font-size="28" font-weight="700" letter-spacing="7" fill="#0b7f43">CONFORMA360</text><text x="80" y="155" font-family="Arial,sans-serif" font-size="22" font-weight="700" letter-spacing="4" fill="#6b7280">${esc(line)}</text><text x="80" y="270" font-family="Arial,sans-serif" font-size="25" font-weight="700" fill="#0b7f43">${theme}</text><text font-family="Arial,sans-serif" font-size="64" font-weight="800" fill="#202124">${headlineText}</text><rect x="80" y="1050" rx="18" width="650" height="90" fill="#0b7f43"/><text x="115" y="1107" font-family="Arial,sans-serif" font-size="30" font-weight="700" fill="white">${cta}</text></svg>`;
  return { file, svg };
}

// Um SVG por slide, mesmo cartão visual do post único (mesma logo/faixa
// verde/moldura, adicionadas depois por sync-marketing-creatives.mjs).
// Nome do arquivo carrega os dois índices (item da campanha + posição do
// slide) -- é isso que sync-marketing-creatives.mjs usa pra agrupar os
// arquivos de volta no mesmo conteúdo, sem depender de ordem de leitura
// do disco.
function carouselSvgs(item, index) {
  const line = item.linha_comercial === "consultoria" ? "CONSULTORIA" : item.linha_comercial === "plataforma" ? "PLATAFORMA" : "CONSULTORIA + PLATAFORMA";
  const total = item.slides.length;
  return item.slides.map((slideText, slideIndex) => {
    const isLast = slideIndex === total - 1;
    const headlineText = headlineTspans(slideText, { x: 80, firstBaselineY: 390, lineHeight: 66, maxLines: 8, maxCharsPerLine: 26 });
    const file = `${data}-criativo-${index + 1}-slide-${slideIndex + 1}.svg`;
    const progress = `${slideIndex + 1}/${total}`;
    const ctaBlock = isLast
      ? `<rect x="80" y="1050" rx="18" width="650" height="90" fill="#0b7f43"/><text x="115" y="1107" font-family="Arial,sans-serif" font-size="30" font-weight="700" fill="white">${esc(item.cta).slice(0, 90)}</text>`
      : `<text x="80" y="1107" font-family="Arial,sans-serif" font-size="24" font-weight="700" fill="#0b7f43">Arraste para o próximo →</text>`;
    // Mesma regra do post único: nada de watermark/rodapé de ferramenta
    // interna -- é a imagem que vira o slide publicado de verdade.
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350"><rect width="1080" height="1350" fill="#f5f7f6"/><rect width="1080" height="18" fill="#0b7f43"/><circle cx="930" cy="150" r="180" fill="#e3f2ea"/><circle cx="930" cy="150" r="105" fill="#d2eadc"/><text x="80" y="105" font-family="Arial,sans-serif" font-size="28" font-weight="700" letter-spacing="7" fill="#0b7f43">CONFORMA360</text><text x="80" y="155" font-family="Arial,sans-serif" font-size="22" font-weight="700" letter-spacing="4" fill="#6b7280">${esc(line)}</text><rect x="895" y="55" rx="14" width="105" height="40" fill="#0b7f43"/><text x="947" y="82" font-family="Arial,sans-serif" font-size="19" font-weight="700" fill="white" text-anchor="middle">${progress}</text><text font-family="Arial,sans-serif" font-size="58" font-weight="800" fill="#202124">${headlineText}</text>${ctaBlock}</svg>`;
    return { file, svg };
  });
}

const inserted = await supabase("marketing_campaigns?select=id", { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify({ nome: `Campanha semanal — ${data}`, objetivo: campaign.objetivo_comercial, linha_comercial: "ambos", segmento: campaign.publico_prioritario, periodo_inicio: data, status: "rascunho" }) });
const campaignId = inserted?.[0]?.id;
if (!campaignId) throw new Error("Supabase não retornou o ID da campanha criada.");

await fs.mkdir(outputDir, { recursive: true });
for (const [index, item] of campaign.dias.entries()) {
  const isCarrossel = item.formato === "carrossel" && Array.isArray(item.slides) && item.slides.length >= 2;
  let creativeUrl;
  if (isCarrossel) {
    const slides = carouselSvgs(item, index);
    for (const slide of slides) await fs.writeFile(path.join(outputDir, slide.file), slide.svg, "utf8");
    creativeUrl = `${repoRawBase}/${slides[0].file}`;
  } else {
    const creative = creativeSvg(item, index);
    await fs.writeFile(path.join(outputDir, creative.file), creative.svg, "utf8");
    creativeUrl = `${repoRawBase}/${creative.file}`;
  }
  await supabase("marketing_contents", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ campaign_id: campaignId, canal: item.canal, formato: isCarrossel ? "carrossel" : "post", linha_comercial: item.linha_comercial, titulo: item.headline, legenda: item.legenda, cta: item.cta, criativo_brief: `${item.tema}. Dor/oportunidade: ${item.dor_oportunidade}. Criativo: ${item.criativo}. Métrica: ${item.metrica}.`, criativo_url: creativeUrl, criativo_alt: `Prévia Conforma360: ${item.headline}`, data_publicacao: addBusinessDaysIso(data, index), status: "revisar" }) });
}

const lines = [`# Campanha semanal — ${data}`, "## Objetivo comercial", campaign.objetivo_comercial, "## Público prioritário", campaign.publico_prioritario, "## Oferta principal", campaign.oferta_principal, "## Estratégia de aquisição", campaign.estrategia_aquisicao, "## Calendário"];
campaign.dias.forEach((item, index) => { const isCarrossel = item.formato === "carrossel" && Array.isArray(item.slides) && item.slides.length >= 2; const previaLine = isCarrossel ? `- Prévia visual (carrossel, ${item.slides.length} slides): ${item.slides.map((_, slideIndex) => `${repoRawBase}/${data}-criativo-${index + 1}-slide-${slideIndex + 1}.svg`).join(", ")}` : `- Prévia visual: ${repoRawBase}/${data}-criativo-${index + 1}.svg`; lines.push(`### Dia ${index + 1} — ${item.dia}`, `- Canal: ${item.canal}`, `- Formato: ${isCarrossel ? "carrossel" : "post"}`, `- Linha comercial: ${item.linha_comercial}`, `- Tema: ${item.tema}`, `- Dor ou oportunidade: ${item.dor_oportunidade}`, `- Objetivo: ${item.objetivo}`, `- Headline: ${item.headline}`, `- Legenda completa: ${item.legenda}`, `- CTA: ${item.cta}`, `- Ideia de criativo: ${item.criativo}`, `- Métrica principal: ${item.metrica}`, previaLine); });
lines.push("## Ativos de conversão", ...campaign.ativos_conversao.map((x) => `- ${x}`), "## Sequência de follow-up", ...campaign.followups.map((x) => `- ${x}`), "## Hipóteses de teste", ...campaign.testes_ab.map((x) => `- ${x}`), "## Próximas ações comerciais", ...campaign.proximas_acoes.map((x) => `- ${x}`), "## Critérios de aprovação", ...campaign.criterios_aprovacao.map((x) => `- ${x}`), "", "---", "Gerado automaticamente pelo CONFORMA360 Marketing AI.");
await fs.writeFile(outputFile, `${lines.join("\n")}\n`, "utf8");
console.log(`Campanha gerada e persistida: ${outputFile} | campaign_id=${campaignId} | conteúdos=${campaign.dias.length}`);
