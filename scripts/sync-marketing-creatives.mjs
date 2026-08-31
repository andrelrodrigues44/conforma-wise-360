import fs from "node:fs/promises";
import path from "node:path";

const supabaseUrl = process.env.MARKETING_SUPABASE_URL;
const marketingKey = process.env.MARKETING_SUPABASE_KEY;
const logoUrl = process.env.CONFORMA360_LOGO_URL;

if (!supabaseUrl || !marketingKey) throw new Error("MARKETING_SUPABASE_URL e MARKETING_SUPABASE_KEY são obrigatórios.");
if (!logoUrl) throw new Error("CONFORMA360_LOGO_URL não configurada. Cadastre uma única vez a URL pública da logo oficial no Supabase Storage.");

const data = new Date().toISOString().slice(0, 10);
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

function withOfficialLogo(svg) {
  const logo = `<image href="${logoUrl}" x="80" y="55" width="360" height="95" preserveAspectRatio="xMinYMid meet"/>`;
  return svg.replace(/<text x="80" y="105"[^>]*>CONFORMA360<\/text>/, logo);
}

async function uploadSvg(fileName, svg) {
  const objectPath = `generated/${fileName}`;
  const response = await fetch(`${supabaseUrl}/storage/v1/object/${bucket}/${objectPath}`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "image/svg+xml", "x-upsert": "true" },
    body: Buffer.from(svg, "utf8"),
  });
  const body = await response.text();
  if (!response.ok) throw new Error(`Storage ${response.status}: ${body}`);
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${objectPath}`;
}

const files = (await fs.readdir(generatedDir)).filter((file) => file.startsWith(`${data}-criativo-`) && file.endsWith(".svg")).sort();
if (!files.length) throw new Error(`Nenhum criativo encontrado para ${data}.`);

const campaigns = await supabase(`marketing_campaigns?select=id&order=created_at.desc&limit=1`);
const campaignId = campaigns?.[0]?.id;
if (!campaignId) throw new Error("Nenhuma campanha encontrada para vincular os criativos.");

const contents = await supabase(`marketing_contents?select=id,titulo&campaign_id=eq.${campaignId}&order=created_at.asc&limit=100`);

for (let index = 0; index < files.length; index++) {
  const file = files[index];
  const original = await fs.readFile(path.join(generatedDir, file), "utf8");
  const svg = withOfficialLogo(original);
  await fs.writeFile(path.join(generatedDir, file), svg, "utf8");
  const creativeUrl = await uploadSvg(file, svg);
  const content = contents[index];
  if (!content) continue;
  await supabase(`marketing_contents?id=eq.${content.id}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ criativo_url: creativeUrl, criativo_alt: `Criativo oficial Conforma360: ${content.titulo}` }),
  });
  console.log(`Criativo vinculado: ${file} -> ${content.id}`);
}

console.log(`Sincronização concluída: ${files.length} criativos na campanha ${campaignId}.`);
