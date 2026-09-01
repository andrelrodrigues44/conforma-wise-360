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

async function withOfficialLogo(svg) {
  const logoDataUri = await getLogoDataUri();
  const cleanSvg = svg
    .replace(/<image[^>]*(?:data-conforma360-logo="true"|href="[^"]*Logo(?:%20| )Conforma360\.jpg")[^>]*\/>/gi, "")
    .replace(/<image[^>]*href="https?:\/\/nezdrfoafuccuaaeozfc\.supabase\.co\/storage\/v1\/object\/public\/marketing-creatives\/Logo[^>]*\/>/gi, "");
  const logo = `<image data-conforma360-logo="true" href="${logoDataUri}" x="70" y="45" width="360" height="135" preserveAspectRatio="xMinYMid meet"/>`;
  return cleanSvg.replace(/(<svg[^>]*>)/, `$1${logo}`);
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

const allFiles = (await fs.readdir(generatedDir)).filter((file) => /^\d{4}-\d{2}-\d{2}-criativo-.*\.svg$/.test(file)).sort();
const files = allFiles.filter((file) => file.startsWith(`${data}-criativo-`));
if (!files.length) throw new Error(`Nenhum criativo encontrado para ${data}.`);

const campaigns = await supabase(`marketing_campaigns?select=id&order=created_at.desc&limit=1`);
const campaignId = campaigns?.[0]?.id;
if (!campaignId) throw new Error("Nenhuma campanha encontrada para vincular os criativos.");

const contents = await supabase(`marketing_contents?select=id,titulo&campaign_id=eq.${campaignId}&order=created_at.asc&limit=100`);

for (let index = 0; index < files.length; index++) {
  const file = files[index];
  const original = await fs.readFile(path.join(generatedDir, file), "utf8");
  const svg = await withOfficialLogo(original);
  await fs.writeFile(path.join(generatedDir, file), svg, "utf8");

  // O painel pode bloquear imagens aninhadas em SVG. Por isso, convertemos o criativo
  // final para PNG: a logo fica fisicamente incorporada na imagem publicada/pré-visualizada.
  const pngName = file.replace(/\.svg$/i, ".png");
  const pngPath = path.join(generatedDir, pngName);
  await sharp(Buffer.from(svg, "utf8")).png().toFile(pngPath);
  const creativeUrl = await uploadObject(pngName, await fs.readFile(pngPath), "image/png");

  const content = contents[index];
  if (!content) continue;
  await supabase(`marketing_contents?id=eq.${content.id}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ criativo_url: creativeUrl, criativo_alt: `Criativo oficial Conforma360: ${content.titulo}` }),
  });
  console.log(`Criativo PNG vinculado: ${pngName} -> ${content.id}`);
}

console.log(`Sincronização concluída: ${files.length} criativos na campanha ${campaignId}.`);
