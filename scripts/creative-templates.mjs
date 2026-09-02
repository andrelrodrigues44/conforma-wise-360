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
  .accent { color:#0b7f43; }
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
// Canvas fixo 1080x1350 -- cada slide é um "mini-pôster" completo (mesmo
// nível de acabamento do post único: número, logo, headline com
// destaque, foto de apoio, grade de módulos, callout, CTA, rodapé fixo),
// não mais um cartão simples de headline sozinho. Reaproveita os mesmos
// blocos de marca do pôster (BRAND_FEATURES/BRAND_OBJECTIVE/BRAND_STATS)
// pra manter os dois formatos consistentes entre si.
function carouselFeatureItem([symbol, label]) {
  return `<div class="c-feature"><span class="c-feature-badge">${esc(symbol)}</span><span>${esc(label)}</span></div>`;
}
function carouselStatItem(label) {
  return `<div class="c-stat">${esc(label)}</div>`;
}

export function renderCarouselSlideHtml({ item, slideText, slideIndex, total, isLast, logoUrl, backgroundDataUri }) {
  const headlineText = highlightedHeadline(slideText, item.headline_destaque);
  const kicker = esc(item.tema).slice(0, 60).toUpperCase();
  const cta = esc(item.cta).slice(0, 70);
  const bgImage = backgroundDataUri ? `<img src="${backgroundDataUri}" alt=""/>` : "";
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${BASE_STYLE}
    body { width:1080px; height:1350px; }
    .canvas { width:1080px; height:1350px; background:#fff; display:flex; flex-direction:column; }
    .bar { height:10px; background:#0b7f43; flex-shrink:0; }
    .header { display:flex; align-items:center; gap:16px; padding:26px 56px 4px; flex-shrink:0; }
    .number { width:52px; height:52px; border-radius:10px; background:#0b7f43; color:#fff; font-size:26px; font-weight:800; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .header img { height:42px; display:block; }
    .header .tagline { color:#5c6b64; font-size:13px; margin-top:2px; }
    .top-row { display:flex; gap:24px; padding:14px 56px 0; align-items:flex-start; flex-shrink:0; }
    .headline-col { flex:1.15; min-width:0; }
    .headline-col h2 { font-size:38px; line-height:1.16; font-weight:800; color:#151b18; }
    .kicker { display:inline-block; margin-top:12px; background:#0b1f17; color:#fff; font-size:14px; font-weight:700; letter-spacing:.5px; padding:8px 14px; border-radius:8px; }
    .photo-col { flex:0.85; flex-shrink:0; position:relative; border-radius:16px; overflow:hidden; height:230px; background:#e3f2ea; }
    .photo-col img { width:100%; height:100%; object-fit:cover; display:block; }
    .photo-badge { position:absolute; right:10px; bottom:10px; width:40px; height:40px; border-radius:50%; background:#0b7f43; color:#fff; display:flex; align-items:center; justify-content:center; font-size:20px; font-weight:800; }
    .modules { background:#0b1f17; margin:22px 56px 0; border-radius:16px; padding:22px 26px; flex-shrink:0; }
    .modules h3 { color:#fff; font-size:15px; font-weight:700; margin-bottom:14px; letter-spacing:.3px; }
    .c-feature-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px 16px; }
    .c-feature { display:flex; align-items:center; gap:8px; color:#e7f3ec; font-size:13px; }
    .c-feature-badge { flex-shrink:0; width:24px; height:24px; border-radius:50%; background:#0e7c46; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:12px; }
    .callout { background:#0e7c46; margin:18px 56px 0; border-radius:16px; padding:20px 26px; color:#fff; flex-shrink:0; }
    .callout strong { display:block; font-size:16px; margin-bottom:5px; }
    .callout span { font-size:14px; line-height:1.45; opacity:.95; }
    .cta-bar { display:flex; align-items:center; justify-content:space-between; gap:16px; margin:18px 56px 0; padding:16px 20px; border-radius:14px; background:#f0f7f3; border:1px solid #d7ede1; flex-shrink:0; }
    .cta-bar p { font-size:14px; color:#1c3a2c; font-weight:700; max-width:560px; }
    .cta-bar .btn { background:#0b7f43; color:#fff; font-weight:700; font-size:15px; padding:12px 18px; border-radius:10px; white-space:nowrap; }
    .spacer { flex:1; }
    .footer { background:#0b1f17; display:flex; align-items:center; justify-content:space-between; padding:18px 56px; flex-shrink:0; }
    .footer .brand img { height:26px; display:block; }
    .footer .brand p { color:#a9c6b7; font-size:11px; margin-top:4px; }
    .c-stats { display:flex; gap:18px; }
    .c-stat { color:#cfe8db; font-size:10px; max-width:90px; line-height:1.3; }
  </style></head><body>
    <div class="canvas">
      <div class="bar"></div>
      <div class="header">
        <div class="number">${slideIndex + 1}</div>
        <img src="${logoUrl}" alt="Conforma360"/>
        <div class="tagline">Conformidade é proteção.</div>
      </div>
      <div class="top-row">
        <div class="headline-col"><h2>${headlineText}</h2>${kicker ? `<span class="kicker">${kicker}</span>` : ""}</div>
        <div class="photo-col">${bgImage}<div class="photo-badge">✓</div></div>
      </div>
      <div class="modules"><h3>Uma plataforma integrada para Meio Ambiente, SST e Compliance</h3><div class="c-feature-grid">${BRAND_FEATURES.map(carouselFeatureItem).join("")}</div></div>
      <div class="callout"><strong>Por que isso importa:</strong><span>${esc(BRAND_OBJECTIVE)}</span></div>
      <div class="cta-bar"><p>${isLast ? "Fale com nossa equipe e tire suas dúvidas." : "Arraste para o próximo →"}</p><span class="btn">${cta}</span></div>
      <div class="spacer"></div>
      <div class="footer">
        <div class="brand"><img src="${logoUrl}" alt="Conforma360"/><p>${esc(BRAND_TAGLINE)}</p></div>
        <div class="c-stats">${BRAND_STATS.map(carouselStatItem).join("")}</div>
      </div>
    </div>
  </body></html>`;
}
