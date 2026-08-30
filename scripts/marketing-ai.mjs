import fs from "node:fs/promises";
import path from "node:path";

const apiKey = process.env.ANTHROPIC_API_KEY;
const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";

if (!apiKey) {
  console.error("ANTHROPIC_API_KEY não configurada. A automação foi interrompida sem alterar arquivos.");
  process.exit(1);
}

const hoje = new Date();
const data = hoje.toISOString().slice(0, 10);
const outputDir = path.resolve("marketing/generated");
const outputFile = path.join(outputDir, `${data}-campanha-semanal.md`);

const prompt = `Você é o agente de Growth Marketing da Conforma360.

MISSÃO COMERCIAL
Gerar demanda qualificada e vendas B2B no Brasil para duas linhas complementares:
1) CONSULTORIA CONFORMA360: Meio Ambiente, SST, Compliance, licenciamento, requisitos legais, ISO 14001/45001, auditorias e serviços técnicos.
2) PLATAFORMA CONFORMA360: software para gestão integrada de Meio Ambiente, SST, Compliance, documentos, requisitos legais, evidências, inspeções, auditorias, planos de ação, indicadores e IA.

PRIORIDADES DE MERCADO
Priorize mineração, indústria, empresas com múltiplas unidades, operações complexas e organizações que precisam demonstrar conformidade e controle.

REGRA DE CONTEÚDO
Distribua a semana entre dor/risco, educação, autoridade/prova, produto/demonstração e conversão. Todo conteúdo precisa ter público, objetivo, canal, CTA e métrica. O conteúdo deve conduzir o leitor para uma ação comercial concreta: solicitar consultoria, diagnóstico, demonstração ou falar com a Conforma360.

TOM
Português do Brasil. Técnico, objetivo, premium, claro e comercialmente responsável. Evite conteúdo genérico, frases vazias e promessas absolutas.

Crie a campanha da próxima semana em Markdown exatamente nesta estrutura:
# Campanha semanal — ${data}
## Objetivo comercial
## Público prioritário
## Oferta principal
## Estratégia de aquisição
Explique como a semana deve gerar atenção, leads e oportunidades.
## Calendário
Para cada dia útil, crie:
- Canal
- Linha comercial (Consultoria ou Plataforma)
- Tema
- Dor ou oportunidade
- Objetivo
- Headline
- Legenda completa
- CTA
- Ideia de criativo
- Métrica principal
## Ativos de conversão
Crie 2 ideias de oferta/lead magnet que possam gerar leads sem inventar certificações, resultados ou dados.
## Sequência de follow-up
Crie 3 mensagens curtas para leads que demonstraram interesse, separando quando fizer sentido consultoria e plataforma.
## Hipóteses de teste
Liste 3 testes A/B com hipótese, variável e métrica.
## Próximas ações comerciais
Liste as 5 ações que devem ser executadas após a campanha.
## Critérios de aprovação
Liste verificações antes de qualquer publicação.

REGRAS DE SEGURANÇA E CREDIBILIDADE
- Não invente clientes, cases, resultados, certificações, integrações, números, depoimentos ou funcionalidades.
- Não prometa conformidade garantida, ausência de multas ou resultados financeiros.
- Não apresente requisito legal como aconselhamento jurídico individual.
- Quando mencionar legislação, indique que a aplicabilidade deve ser validada conforme o contexto da organização.
- Não publicar automaticamente em redes sociais nesta etapa; gerar conteúdo para revisão/aprovação.
- Sempre distinguir claramente Consultoria de Plataforma.
`;

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
