import { chromium } from "playwright";

// ---------- Renderização (Playwright) ----------
// Um browser só, reaproveitado pra todos os renders da rodada -- muito
// mais rápido que abrir/fechar Chromium por imagem.
let browserPromise = null;
function getBrowser() {
  if (!browserPromise) browserPromise = chromium.launch();
  return browserPromise;
}
export async function closeBrowser() {
  if (!browserPromise) return;
  const browser = await browserPromise;
  await browser.close();
  browserPromise = null;
}

export async function renderHtmlToPng(html, { width, height, fullPage = false }) {
  const browser = await getBrowser();
  const page = await browser.newPage({ viewport: { width, height: height || 1200 } });
  try {
    await page.setContent(html, { waitUntil: "networkidle" });
    return await page.screenshot({ fullPage });
  } finally {
    await page.close();
  }
}

// ---------- Helpers de texto ----------
export function esc(value) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Destaca o trecho que a IA marcou (headline_destaque) dentro do
// headline, com um <span> colorido. Se o trecho não bater exatamente
// (a IA às vezes parafraseia), cai pro headline inteiro sem destaque --
// nunca quebra o render por causa disso.
function highlightedHeadline(headline, destaque) {
  const full = String(headline ?? "");
  const needle = String(destaque ?? "").trim();
  if (!needle) return esc(full);
  const index = full.indexOf(needle);
  if (index === -1) return esc(full);
  const before = full.slice(0, index);
  const after = full.slice(index + needle.length);
  return `${esc(before)}<span class="accent">${esc(needle)}</span>${esc(after)}`;
}

// ---------- Marca ----------
const BRAND_TAGLINE = "Conformidade que vira gestão.";
const BRAND_OBJECTIVE = "saber o que precisa ser feito, identificar o que está em risco e transformar informação em decisão.";
const BRAND_FEATURES = [
  ["§", "Requisitos Legais"],
  ["!", "Riscos e Obrigações"],
  ["▤", "Documentos e Evidências"],
  ["⌕", "Inspeções"],
  ["✓", "Planos de Ação"],
  ["✦", "Inteligência Aplicada"],
];
const BRAND_STATS = ["Menos risco na operação", "Menos vulnerabilidade em conformidade", "Mais produtividade nos processos", "Melhores decisões com dados"];

const BASE_STYLE = `
  * { margin:0; padding:0; box-sizing:border-box; font-family: Arial, Helvetica, sans-serif; }
  body { width:1080px; background:#ffffff; }
  .accent { color:#0e7fae; }
`;

function featureItem([symbol, label]) {
  return `<div class="feature"><span class="feature-badge">${esc(symbol)}</span><span>${esc(label)}</span></div>`;
}
function statItem(label) {
  return `<div class="stat">${esc(label)}</div>`;
}

// ---------- Template 1: pôster completo (formato "post") ----------
export function renderPostHtml({ item, logoUrl, mockupUrl }) {
  const headline = highlightedHeadline(item.headline, item.headline_destaque);
  const subtext = esc(item.dor_oportunidade).slice(0, 260);
  const cta = esc(item.cta).slice(0, 60);
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${BASE_STYLE}
    .header { display:flex; align-items:center; padding:44px 56px 8px; }
    .header img { height:58px; display:block; }
    .hero { padding:20px 56px 40px; }
    .hero h1 { font-size:56px; line-height:1.18; font-weight:800; color:#151b18; }
    .hero p { margin-top:22px; font-size:23px; line-height:1.55; color:#4b5a53; max-width:900px; }
    .mockup-section { background:linear-gradient(160deg,#0b3a26 0%,#0d5c39 55%,#0b3a26 100%); padding:56px; }
    .mockup-frame { background:#fff; border-radius:18px; overflow:hidden; max-width:860px; margin:0 auto; border:1px solid rgba(255,255,255,.15); }
    .mockup-frame img { display:block; width:100%; }
    .features { background:#0b1f17; padding:48px 56px; }
    .features h3 { color:#fff; font-size:23px; font-weight:700; margin-bottom:30px; }
    .feature-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:26px 32px; }
    .feature { display:flex; align-items:center; gap:14px; color:#e7f3ec; font-size:19px; }
    .feature-badge { flex-shrink:0; width:36px; height:36px; border-radius:50%; background:#0e7c46; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:17px; }
    .objective { background:#0e7c46; margin:0 56px; border-radius:20px; padding:34px 42px; color:#fff; transform:translateY(-1px); }
    .objective strong { display:block; font-size:22px; margin-bottom:8px; }
    .objective span { font-size:19px; line-height:1.5; opacity:.95; }
    .cta-footer { background:#0b1f17; display:flex; align-items:center; justify-content:space-between; padding:44px 56px 40px; }
    .cta-footer .brand img { height:34px; display:block; }
    .cta-footer .brand p { color:#a9c6b7; font-size:16px; margin-top:8px; }
    .cta-footer .button { background:#0e7c46; color:#fff; font-weight:700; font-size:19px; padding:16px 30px; border-radius:12px; white-space:nowrap; }
    .stats-strip { background:#08160f; display:grid; grid-template-columns:repeat(4,1fr); padding:26px 40px; }
    .stat { color:#cfe8db; font-size:15px; text-align:center; line-height:1.4; }
  </style></head><body>
    <div class="header"><img src="${logoUrl}" alt="Conforma360"/></div>
    <div class="hero"><h1>${headline}</h1><p>${subtext}</p></div>
    <div class="mockup-section"><div class="mockup-frame"><img src="${mockupUrl}" alt="Plataforma Conforma360"/></div></div>
    <div class="features"><h3>Uma plataforma integrada para Meio Ambiente, SST e Compliance.</h3><div class="feature-grid">${BRAND_FEATURES.map(featureItem).join("")}</div></div>
    <div class="objective"><strong>O objetivo é simples:</strong><span>${esc(BRAND_OBJECTIVE)}</span></div>
    <div class="cta-footer"><div class="brand"><img src="${logoUrl}" alt="Conforma360"/><p>${esc(BRAND_TAGLINE)}</p></div><div class="button">${cta}</div></div>
    <div class="stats-strip">${BRAND_STATS.map(statItem).join("")}</div>
  </body></html>`;
}

// ---------- Template 2: slide de carrossel (formato "carrossel") ----------
// Canvas fixo 1080x1350 (mesma proporção retrato usada antes) -- cada
// slide precisa preencher esse espaço sozinho, diferente do pôster
// (altura livre). Fundo: foto gerada por IA (uma por conteúdo, já
// compartilhada entre os slides) com painel translúcido atrás do texto
// pra garantir contraste; sem foto (chave ausente/falha), cai pro fundo
// liso.
export function renderCarouselSlideHtml({ item, slideText, slideIndex, total, isLast, logoUrl, backgroundDataUri }) {
  const headline = esc(slideText);
  const cta = esc(item.cta).slice(0, 60);
  const bg = backgroundDataUri
    ? `background-image:url('${backgroundDataUri}'); background-size:cover; background-position:center;`
    : `background:#f5f7f6;`;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${BASE_STYLE}
    body { width:1080px; height:1350px; }
    .canvas { width:1080px; height:1350px; ${bg} position:relative; display:flex; flex-direction:column; }
    .canvas::before { content:""; position:absolute; inset:0; background:linear-gradient(180deg, rgba(255,255,255,.75) 0%, rgba(255,255,255,.55) 45%, rgba(255,255,255,.85) 100%); }
    .bar { height:16px; background:#0b7f43; }
    .row { position:relative; display:flex; align-items:center; justify-content:space-between; padding:36px 64px 0; }
    .row img { height:52px; display:block; }
    .progress { background:#0b7f43; color:#fff; font-weight:700; font-size:18px; padding:8px 18px; border-radius:999px; }
    .headline { position:relative; flex:1; display:flex; align-items:center; padding:0 64px; }
    .headline h2 { font-size:56px; line-height:1.18; font-weight:800; color:#151b18; }
    .footer { position:relative; padding:0 64px 64px; }
    .hint { color:#0b7f43; font-weight:700; font-size:22px; }
    .cta-btn { background:#0b7f43; color:#fff; font-weight:700; font-size:28px; padding:22px 34px; border-radius:16px; display:inline-block; }
  </style></head><body>
    <div class="canvas">
      <div class="bar"></div>
      <div class="row"><img src="${logoUrl}" alt="Conforma360"/><span class="progress">${slideIndex + 1}/${total}</span></div>
      <div class="headline"><h2>${headline}</h2></div>
      <div class="footer">${isLast ? `<span class="cta-btn">${cta}</span>` : `<span class="hint">Arraste para o próximo →</span>`}</div>
    </div>
  </body></html>`;
}
