import fs from "node:fs/promises";
import path from "node:path";

const apiKey = process.env.ANTHROPIC_API_KEY;
const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514";

if (!apiKey) {
  console.error("ANTHROPIC_API_KEY não configurada. A automação foi interrompida sem alterar arquivos.");
  process.exit(1);
}

const hoje = new Date();
const data = hoje.toISOString().slice(0, 10);
const outputDir = path.resolve("marketing/generated");
const outputFile = path.join(outputDir, `${data}-campanha-semanal.md`);

const prompt = `Você é o agente de Growth Marketing da Conforma360.

A Conforma360 possui duas linhas comerciais:
1) CONSULTORIA: Meio Ambiente, SST, Compliance, licenciamento, requisitos legais, ISO 14001/45001, auditorias e serviços técnicos.
2) PLATAFORMA: software para gestão integrada de Meio Ambiente, SST, Compliance, documentos, requisitos legais, evidências, inspeções, auditorias, planos de ação, indicadores e IA.

Objetivo principal: gerar demanda qualificada e vendas B2B no Brasil, com prioridade para mineração, indústria e empresas com operações complexas.

Crie a campanha da próxima semana em português do Brasil, com linguagem técnica, objetiva, premium e comercialmente responsável.

Entregue em Markdown exatamente nesta estrutura:
# Campanha semanal — ${data}
## Objetivo comercial
## Público prioritário
## Oferta principal
## Calendário
Para cada dia útil, crie:
- Canal
- Tema
- Objetivo
- Headline
- Legenda completa
- CTA
- Ideia de criativo
- Métrica principal
## Sequência de follow-up
Crie 3 mensagens curtas para leads que demonstraram interesse.
## Hipóteses de teste
Liste 3 testes A/B.
## Critérios de aprovação
Liste verificações antes de qualquer publicação.

Não invente clientes, resultados, certificações, integrações ou números. Não prometa conformidade garantida. Quando mencionar requisitos legais, trate-os como tema técnico e recomende validação conforme o contexto aplicável.`;

const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "content-type": "application/json",
    "x-api-key": apiKey,
    "anthropic-version": "2023-06-01",
  },
  body: JSON.stringify({
    model,
    max_tokens: 7000,
    temperature: 0.6,
    messages: [{ role: "user", content: prompt }],
  }),
});

if (!response.ok) {
  const body = await response.text();
  throw new Error(`Anthropic API ${response.status}: ${body}`);
}

const result = await response.json();
const text = (result.content || [])
  .filter((block) => block.type === "text")
  .map((block) => block.text)
  .join("\n")
  .trim();

if (!text) throw new Error("A API não retornou conteúdo textual.");

await fs.mkdir(outputDir, { recursive: true });
await fs.writeFile(outputFile, `${text}\n\n---\nGerado automaticamente pelo CONFORMA360 Marketing AI.\n`, "utf8");

console.log(`Campanha gerada: ${outputFile}`);
