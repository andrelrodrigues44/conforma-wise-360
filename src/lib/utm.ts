const STORAGE_KEY = "conforma360_utm";
const MAX_IDADE_DIAS = 30;

export interface UtmData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
}

const CAMPOS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
] as const;

// Lê os parâmetros da URL na primeira visita e guarda no localStorage, pra sobreviver à
// navegação entre páginas e a um retorno alguns dias depois (30 dias) -- sem isso, um lead que
// clicou num anúncio hoje e preencheu o formulário amanhã apareceria como "direto", sem origem.
export function capturarUtm(): void {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const encontrados: UtmData = {};
  for (const campo of CAMPOS) {
    const valor = params.get(campo);
    if (valor) encontrados[campo] = valor;
  }
  if (Object.keys(encontrados).length === 0) return; // nada na URL, mantém o que já tinha salvo
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...encontrados, capturado_em: Date.now() }));
  } catch {
    // localStorage indisponível (modo privado, etc.) -- sem atribuição, sem quebrar nada
  }
}

export function obterUtm(): UtmData {
  if (typeof window === "undefined") return {};
  try {
    const bruto = localStorage.getItem(STORAGE_KEY);
    if (!bruto) return {};
    const dado = JSON.parse(bruto) as UtmData & { capturado_em?: number };
    const idadeDias = dado.capturado_em ? (Date.now() - dado.capturado_em) / 86_400_000 : Infinity;
    if (idadeDias > MAX_IDADE_DIAS) return {};
    const { capturado_em: _capturado_em, ...resto } = dado;
    return resto;
  } catch {
    return {};
  }
}
