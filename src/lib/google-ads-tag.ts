const GOOGLE_ADS_ID = "AW-18483721023";

// Rótulo da ação de conversão "Enviar formulário de lead" (conta Conforma360,
// 944-175-0352), obtido pelo Assistente de Tags do Google Ads em 29/09/2026.
const CONVERSION_LABEL = "xS1RCMiYm4sdEL_m3O1E";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

// Carrega o Google tag (gtag.js) uma única vez, client-side -- sem isso não há
// remarketing nem conversão nenhuma sendo medida pelos anúncios do Google Ads.
export function carregarGoogleAdsTag(): void {
  if (typeof window === "undefined") return;
  if (document.getElementById("google-ads-gtag")) return; // já carregada

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", GOOGLE_ADS_ID);

  const script = document.createElement("script");
  script.id = "google-ads-gtag";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`;
  document.head.appendChild(script);
}

// Chamar quando um lead é enviado com sucesso pelo site (qualquer formulário).
export function dispararConversaoLead(): void {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "conversion", { send_to: `${GOOGLE_ADS_ID}/${CONVERSION_LABEL}` });
}
