import { createFileRoute } from "@tanstack/react-router";

const COOKIE_NAME = "conforma360_marketing_session";
const TABLES = new Set(["leads_site", "marketing_contents", "marketing_campaigns", "sales_followups"]);

function getSession(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  if (!match) return null;
  const [value, signature] = decodeURIComponent(match[1] ?? "").split(".");
  return value && signature ? { value, signature } : null;
}

async function sign(value: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function authorized(request: Request) {
  const secret = process.env["MARKETING_SUPABASE_KEY"] || "";
  const session = getSession(request);
  if (!secret || !session || session.value !== "admin") return false;
  const expected = await sign(session.value, secret);
  return session.signature.length === expected.length && session.signature === expected;
}

function tableConfig(table: string) {
  const configs: Record<string, string[]> = {
    leads_site: ["nome", "empresa", "cargo", "linha_comercial", "interesse", "segmento", "porte", "unidades", "score", "temperatura", "etapa", "status", "proxima_acao", "proxima_acao_em"],
    marketing_contents: ["campaign_id", "canal", "formato", "linha_comercial", "titulo", "legenda", "cta", "criativo_brief", "criativo_url", "criativo_alt", "data_publicacao", "status"],
    marketing_campaigns: ["nome", "objetivo", "linha_comercial", "segmento", "periodo_inicio", "periodo_fim", "status"],
    sales_followups: ["lead_id", "etapa", "canal", "assunto", "mensagem", "agendado_para", "status"],
  };
  return configs[table] || [];
}

async function supabase(table: string, init: RequestInit, query = "") {
  const url = process.env["MARKETING_SUPABASE_URL"];
  const key = process.env["MARKETING_SUPABASE_KEY"];
  if (!url || !key) throw new Error("Supabase Marketing não configurado no servidor.");
  const response = await fetch(`${url}/rest/v1/${table}${query ? `?${query}` : ""}`, {
    ...init,
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=representation", ...(init.headers || {}) },
  });
  const body = await response.text();
  let json: unknown = null;
  try { json = body ? JSON.parse(body) : null; } catch { json = { raw: body }; }
  if (!response.ok) throw new Error(typeof json === "object" && json && "message" in json ? String(json.message) : `Supabase ${table}: ${response.status}`);
  return json;
}

export const Route = createFileRoute("/api/admin/manage")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!(await authorized(request))) return new Response(JSON.stringify({ error: "Não autorizado." }), { status: 401 });
        const url = new URL(request.url);
        const table = url.searchParams.get("table") || "";
        const id = url.searchParams.get("id");
        if (!TABLES.has(table)) return new Response(JSON.stringify({ error: "Tabela não permitida." }), { status: 400 });
        const query = id ? `id=eq.${encodeURIComponent(id)}&select=*` : "select=*&order=created_at.desc&limit=200";
        try { return new Response(JSON.stringify(await supabase(table, { method: "GET" }, query)), { headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } }); }
        catch (error) { return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Erro interno." }), { status: 500 }); }
      },
      POST: async ({ request }) => {
        if (!(await authorized(request))) return new Response(JSON.stringify({ error: "Não autorizado." }), { status: 401 });
        try {
          const body = await request.json() as { table?: string; data?: Record<string, unknown> };
          if (!body.table || !TABLES.has(body.table) || !body.data) return new Response(JSON.stringify({ error: "Tabela ou dados inválidos." }), { status: 400 });
          const allowed = new Set(tableConfig(body.table));
          const payload = Object.fromEntries(Object.entries(body.data).filter(([key, value]) => allowed.has(key) && value !== "" && value !== null && value !== undefined));
          return new Response(JSON.stringify(await supabase(body.table, { method: "POST", body: JSON.stringify(payload) })), { status: 201, headers: { "Content-Type": "application/json" } });
        } catch (error) { return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Erro interno." }), { status: 500 }); }
      },
      PATCH: async ({ request }) => {
        if (!(await authorized(request))) return new Response(JSON.stringify({ error: "Não autorizado." }), { status: 401 });
        try {
          const body = await request.json() as { table?: string; id?: string; data?: Record<string, unknown> };
          if (!body.table || !TABLES.has(body.table) || !body.id || !body.data) return new Response(JSON.stringify({ error: "Tabela, id ou dados inválidos." }), { status: 400 });
          const allowed = new Set(tableConfig(body.table));
          const payload = Object.fromEntries(Object.entries(body.data).filter(([key]) => allowed.has(key)));
          return new Response(JSON.stringify(await supabase(body.table, { method: "PATCH", body: JSON.stringify(payload) }, `id=eq.${encodeURIComponent(body.id)}`)), { headers: { "Content-Type": "application/json" } });
        } catch (error) { return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Erro interno." }), { status: 500 }); }
      },
    },
  },
});
