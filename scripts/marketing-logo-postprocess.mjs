import fs from "node:fs/promises";
import path from "node:path";

const outputDir = path.resolve("marketing/generated");
const logoUrl = "https://nezdrfoafuccuaaeozfc.supabase.co/storage/v1/object/public/marketing-creatives/Logo%20Conforma360.jpg";

const files = (await fs.readdir(outputDir)).filter((name) => name.endsWith(".svg"));

for (const file of files) {
  const filePath = path.join(outputDir, file);
  let svg = await fs.readFile(filePath, "utf8");
  if (svg.includes(logoUrl) || svg.includes("data-conforma360-logo")) continue;

  const image = `<image data-conforma360-logo="true" href="${logoUrl}" x="70" y="45" width="360" height="135" preserveAspectRatio="xMidYMid meet"/>`;
  svg = svg.replace(/(<svg[^>]*>)/, `$1${image}`);
  await fs.writeFile(filePath, svg, "utf8");
}

console.log(`Logo Conforma360 aplicada em ${files.length} criativo(s).`);
