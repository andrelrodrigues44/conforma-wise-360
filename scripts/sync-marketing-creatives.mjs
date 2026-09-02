import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const supabaseUrl = process.env.MARKETING_SUPABASE_URL;
const marketingKey = process.env.MARKETING_SUPABASE_KEY;
const logoUrl = process.env.CONFORMA360_LOGO_URL || "https://nezdrfoafuccuaaeozfc.supabase.co/storage/v1/object/public/marketing-creatives/Logo%20Conforma360.jpg";

if (!supabaseUrl || !marketingKey) throw new Error("MARKETING_SUPABASE_URL e MARKETING_SUPABASE_KEY são obrigatórios.");

const data = process.env.MARKETING_CREATIVE_DATE || new Date().toISOString().slice(0, 10);
const generatedDir = path.resolve("marketing/generated");
const bucket = "marketing-creatives";
const headers = { apikey: marketingKey, Authorization: `Bearer ${marketingKey}` };

async function supabase(pathname, options = {}) {
  const response = await fetch(`${supabaseUrl}/rest/v1/${pathname}`, {
    ...options,
    headers: { ...headers, Accept: "application/json", "Content-Type": "application/json", ...(options.headers || {}) },
  });
  const body = await response.text();
  if (!response.ok) throw new Error(`Supabase ${response.status}: ${body}`);
  return body ? JSON.parse(body) : null;
}

async function getLogoDataUri() {
  const response = await fetch(logoUrl);
  if (!response.ok) throw new Error(`Logo Conforma360 ${response.status}: não foi possível carregar a logo oficial.`);
  const contentType = response.headers.get("content-type") || "image/jpeg";
  const bytes = Buffer.from(await response.arrayBuffer());
  return `data:${contentType};base64,${bytes.toString("base64")}`;
}

function withOfficialLogo(svg, logoDataUri) {
  const cleanSvg = svg
    .replace(/<image[^>]*(?:data-conforma360-logo="true"|href="[^"]*Logo(?:%20| )Conforma360\.jpg")[^>]*\/>/gi, "")
    .replace(/<image[^>]*href="https?:\/\/nezdrfoafuccuaaeozfc\.supabase\.co\/storage\/v1\/object\/public\/marketing-creatives\/Logo[^>]*\/>/gi, "");
  const logo = `<image data-conforma360-logo="true" href="${logoDataUri}" x="70" y="45" width="360" height="135" preserveAspectRatio="xMinYMid meet"/>`;
  // Insere ANTES de </svg> (último elemento = topo da pilha de
  // renderização), não logo depois de <svg>. Era esse o motivo real da
  // logo nunca aparecer: como primeiro elemento, tudo que vem depois no
  // cartão (o fundo -- cor lisa ou, agora, a foto de IA) desenhava por
  // cima dela.
  return cleanSvg.replace(/<\/svg>\s*$/, `${logo}</svg>`);
}

async function uploadObject(fileName, body, contentType) {
  const objectPath = `generated/${fileName}`;
  const response = await fetch(`${supabaseUrl}/storage/v1/object/${bucket}/${objectPath}`, {
    method: "POST",
    headers: { ...headers, "Content-Type": contentType, "x-upsert": "true" },
    body,
  });
  const responseBody = await response.text();
  if (!response.ok) throw new Error(`Storage ${response.status}: ${responseBody}`);
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${objectPath}`;
}

// Nome do arquivo carrega a posição real: -criativo-N é o N-ésimo
// conteúdo gerado por marketing-ai.mjs naquele dia (1-based, mesma ordem
// de criação em marketing_contents), -slide-M (opcional) é o M-ésimo
// slide de um carrossel. Extrai os dois números do nome em vez de
// confiar na ordem de leitura do diretório -- assim um carrossel com N
// arquivos não desalinha o índice dos conteúdos seguintes.
const FILENAME_PATTERN = /^(\d{4}-\d{2}-\d{2})-criativo-(\d+)(?:-slide-(\d+))?\.svg$/;

const allFiles = (await fs.readdir(generatedDir)).filter((file) => FILENAME_PATTERN.test(file));
const files = allFiles.filter((file) => file.startsWith(`${data}-criativo-`));
if (!files.length) throw new Error(`Nenhum criativo encontrado para ${data}.`);

const campaigns = await supabase(`marketing_campaigns?select=id&order=created_at.desc&limit=1`);
const campaignId = campaigns?.[0]?.id;
if (!campaignId) throw new Error("Nenhuma campanha encontrada para vincular os criativos.");

const contents = await supabase(`marketing_contents?select=id,titulo&campaign_id=eq.${campaignId}&order=created_at.asc&limit=100`);

// Agrupa os arquivos por índice de conteúdo (N): um grupo com 1 arquivo
// é um post de imagem única; um grupo com vários arquivos ordenados por
// slide é um carrossel.
const groups = new Map();
for (const file of files) {
  const match = file.match(FILENAME_PATTERN);
  const contentIndex = Number(match[2]);
  const slideIndex = match[3] ? Number(match[3]) : 0;
  if (!groups.has(contentIndex)) groups.set(contentIndex, []);
  groups.get(contentIndex).push({ file, slideIndex });
}

const logoDataUri = await getLogoDataUri();
let syncCount = 0;

for (const contentIndex of [...groups.keys()].sort((a, b) => a - b)) {
  const slides = groups.get(contentIndex).sort((a, b) => a.slideIndex - b.slideIndex);
  const content = contents[contentIndex - 1];
  if (!content) { console.warn(`Sem conteúdo correspondente para -criativo-${contentIndex}, pulando.`); continue; }

  const urls = [];
  for (const slide of slides) {
    const original = await fs.readFile(path.join(generatedDir, slide.file), "utf8");
    const svg = withOfficialLogo(original, logoDataUri);
    await fs.writeFile(path.join(generatedDir, slide.file), svg, "utf8");

    // O painel pode bloquear imagens aninhadas em SVG. Por isso, convertemos o
    // criativo final para PNG: a logo fica fisicamente incorporada na imagem
    // publicada/pré-visualizada.
    const pngName = slide.file.replace(/\.svg$/i, ".png");
    const pngPath = path.join(generatedDir, pngName);
    await sharp(Buffer.from(svg, "utf8")).png().toFile(pngPath);
    urls.push(await uploadObject(pngName, await fs.readFile(pngPath), "image/png"));
  }

  // criativo_url continua sendo a capa/thumbnail (compatibilidade com
  // qualquer lugar que só leia esse campo); criativo_urls guarda o
  // carrossel completo, na ordem dos slides (1 item = post normal).
  await supabase(`marketing_contents?id=eq.${content.id}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      criativo_url: urls[0],
      criativo_urls: urls,
      criativo_alt: `Criativo oficial Conforma360: ${content.titulo}`,
    }),
  });
  syncCount++;
  console.log(`Criativo${urls.length > 1 ? ` (carrossel, ${urls.length} slides)` : ""} vinculado: conteúdo ${content.id}`);
}

console.log(`Sincronização concluída: ${syncCount} conteúdo(s) na campanha ${campaignId}.`);
