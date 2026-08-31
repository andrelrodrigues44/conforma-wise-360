import { createFileRoute } from "@tanstack/react-router";

const COOKIE_NAME = "conforma360_marketing_session";

function getSession(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  if (!match) return null;
  const [value, signature] = decodeURIComponent(match[1]).split(".");
  return value && signature ? { value, signature } : null;
}

async function sign(value: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function sessionValid(request: Request) {
  const secret = process.env["MARKETING_SUPABASE_KEY"] || "";
  const session = getSession(request);
  if (!secret || !session || session.value !== "admin") return false;
  const expected = await sign(session.value, secret);
  return session.signature.length === expected.length && session.signature === expected;
}

async function getTable(table: string, query: string) {
  const url = process.env["MARKETING_SUPABASE_URL"];
  const key = process.env["MARKETING_SUPABASE_KEY"];
  if (!url || !key) throw new Error("Supabase Marketing não configurado no servidor.");
  const response = await fetch(`${url}/rest/v1/${table}?${query}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}`, Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`Supabase ${table}: ${response.status}`);
  return response.json();
}

export const Route = createFileRoute("/api/admin/dashboard")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!(await sessionValid(request))) {
          return new Response(JSON.stringify({ error: "Não autorizado." }), { status: 401, headers: { "Content-Type": "application/json" } });
        }
        try {
          const [leads, followups, contents, campaigns, activities] = await Promise.all([
            getTable("leads_site", "select=id,nome,empresa,cargo,linha_comercial,interesse,segmento,porte,unidades,score,temperatura,etapa,status,proxima_acao,proxima_acao_em,ultimo_contato_em,created_at&order=created_at.desc&limit=200"),
            getTable("sales_followups", "select=id,lead_id,etapa,canal,assunto,mensagem,agendado_para,enviado_em,status,created_at&order=created_at.desc&limit=200"),
            getTable("marketing_contents", "select=id,campaign_id,canal,formato,linha_comercial,titulo,legenda,cta,criativo_brief,data_publicacao,status,created_at&order=created_at.desc&limit=100"),
            getTable("marketing_campaigns", "select=id,nome,objetivo,linha_comercial,segmento,periodo_inicio,periodo_fim,status,created_at,updated_at&order=created_at.desc&limit=100"),
            getTable("sales_activities", "select=id,lead_id,tipo,descricao,created_at&order=created_at.desc&limit=200"),
          ]);
          const countBy = (items: any[], key: string) => items.reduce((acc, item) => { const value = item[key] || "sem_classificacao"; acc[value] = (acc[value] || 0) + 1; return acc; }, {} as Record<string, number>);
          const stats = {
            leads: leads.length,
            hot: leads.filter((l: any) => l.temperatura === "hot").length,
            warm: leads.filter((l: any) => l.temperatura === "warm").length,
            open: leads.filter((l: any) => ["aberto", "em_contato"].includes(l.status)).length,
            pendingFollowups: followups.filter((f: any) => ["pendente", "aprovado", "agendado"].includes(f.status)).length,
            reviewContents: contents.filter((c: any) => c.status === "revisar").length,
            approvedContents: contents.filter((c: any) => c.status === "aprovado").length,
            rejectedContents: contents.filter((c: any) => c.status === "rejeitado").length,
            activeCampaigns: campaigns.filter((c: any) => ["ativa", "agendada"].includes(c.status)).length,
            conversionRate: leads.length ? Math.round((leads.filter((l: any) => l.status === "convertido").length / leads.length) * 1000) / 10 : 0,
            byLine: countBy(leads, "linha_comercial"), byStage: countBy(leads, "etapa"), byTemperature: countBy(leads, "temperatura"),
          };
          return new Response(JSON.stringify({ stats, leads, followups, contents, campaigns, activities }), { headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
        } catch (error) {
          console.error(error);
          return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Erro interno." }), { status: 500, headers: { "Content-Type": "application/json" } });
        }
      },
    },
  },
});
