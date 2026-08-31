import fs from "node:fs/promises";
import path from "node:path";

const generatedDir = path.resolve("marketing/generated");
const brandConfigPath = path.resolve("marketing/brand/brand-config.json");

const forbiddenPatterns = [
  /garantia de conformidade/i,
  /risco zero/i,
  /nunca será autuad[oa]/i,
  /resultado garantido/i,
  /conformidade garantida/i,
];

const requiredTerms = ["CONFORMA360"];

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

if (!(await exists(brandConfigPath))) {
  throw new Error("Brand config ausente: marketing/brand/brand-config.json");
}

if (!(await exists(generatedDir))) {
  console.log("Nenhuma pasta marketing/generated encontrada; nada a validar.");
  process.exit(0);
}

const entries = await fs.readdir(generatedDir, { withFileTypes: true });
const files = entries.filter((entry) => entry.isFile() && entry.name.endsWith(".md"));

if (!files.length) {
  console.log("Nenhuma campanha Markdown encontrada; nada a validar.");
  process.exit(0);
}

const errors = [];

for (const file of files) {
  const filePath = path.join(generatedDir, file.name);
  const content = await fs.readFile(filePath, "utf8");

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(content)) {
      errors.push(`${file.name}: contém afirmação comercial/regulatória proibida: ${pattern}`);
    }
  }

  if (!requiredTerms.every((term) => content.includes(term))) {
    errors.push(`${file.name}: não contém a marca CONFORMA360.`);
  }

  if (!/CTA|cta/i.test(content)) {
    errors.push(`${file.name}: CTA não identificado.`);
  }
}

if (errors.length) {
  console.error("Falha no quality gate de Marketing AI:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Quality gate aprovado: ${files.length} campanha(s) validada(s).`);
