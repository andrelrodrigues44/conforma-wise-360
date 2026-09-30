const GOOGLE_ADS_ID = "AW-18483721023";

// O rótulo específico da ação "Enviar formulário de lead" no Google Ads --
// enquanto não configurado, o disparo é apenas ignorado (não quebra nada,
// só não conta a conversão). Ver VITE_GOOGLE_ADS_LEAD_CONVERSION_LABEL no .env.
const CONVERSION_LABEL = import.meta.env["VITE_GOOGLE_ADS_LEAD_CONVERSION_LABEL"] as
  string | undefined;

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
  if (!CONVERSION_LABEL) {
    console.warn(
      "VITE_GOOGLE_ADS_LEAD_CONVERSION_LABEL não configurado -- conversão de lead não registrada no Google Ads.",
    );
    return;
  }
  window.gtag("event", "conversion", { send_to: `${GOOGLE_ADS_ID}/${CONVERSION_LABEL}` });
}
