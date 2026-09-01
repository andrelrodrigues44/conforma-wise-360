import { createFileRoute } from "@tanstack/react-router";

// Comentário deliberado (2ª tentativa): força mais um deploy novo --
// mesmo depois de recolar BUFFER_API_KEY correto (validado direto contra
// a API do Buffer via PowerShell, funcionando), o app publicado ainda
// não refletia o valor novo sem um deploy de código real.
const COOKIE_NAME = "conforma360_marketing_session";

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

async function bufferRequest(query: string, variables?: Record<string, unknown>) {
  // .trim() -- secret colado com espaço/quebra de linha invisível no
  // fim quebra o header Authorization sem dar nenhum aviso claro (já
  // vimos exatamente essa classe de bug antes, com outra chave, nesta
  // mesma sessão).
  const token = process.env["BUFFER_API_KEY"]?.trim();
  if (!token) throw new Error("Buffer não configurado. Adicione o secret BUFFER_API_KEY.");
  const response = await fetch("https://api.buffer.com", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ query, variables }),
  });
  const body = await response.text();
  let json: { data?: unknown; errors?: { message?: string }[]; raw?: string } | null = null;
  try { json = body ? JSON.parse(body) : null; } catch { json = { raw: body }; }
  if (!response.ok) throw new Error(json?.errors?.[0]?.message || `Buffer API ${response.status}`);
  if (json?.errors?.length) throw new Error(json.errors[0]?.message || "Erro na Buffer API.");
  return json?.data;
}

export const Route = createFileRoute("/api/admin/buffer")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!(await authorized(request))) return new Response(JSON.stringify({ error: "Não autorizado." }), { status: 401 });
        try {
          const data = await bufferRequest(`query GetBufferAccount { account { organizations { id name channels { id name displayName service avatar isQueuePaused } } } }`);
          return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
        } catch (error) {
          return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Erro ao consultar o Buffer." }), { status: 500, headers: { "Content-Type": "application/json" } });
        }
      },
      POST: async ({ request }) => {
        if (!(await authorized(request))) return new Response(JSON.stringify({ error: "Não autorizado." }), { status: 401 });
        try {
          const body = await request.json() as { action?: "draft" | "schedule"; channelId?: string; text?: string; dueAt?: string; assetUrl?: string; assetType?: "image" | "video"; service?: string };
          if (!body.channelId || !body.text) return new Response(JSON.stringify({ error: "channelId e text são obrigatórios." }), { status: 400 });
          // assetType permite anexar vídeo em vez de imagem -- necessário
          // pra canais como TikTok, que não aceitam imagem estática.
          const assetKind = body.assetType === "video" ? "video" : "image";
          const assets = body.assetUrl ? [{ [assetKind]: { url: body.assetUrl } }] : [];
          const input: Record<string, unknown> = {
            channelId: body.channelId,
            text: body.text,
            schedulingType: "automatic",
            mode: body.action === "schedule" ? "customScheduled" : "addToQueue",
            saveToDraft: body.action !== "schedule",
            aiAssisted: true,
            assets,
          };
          if (body.action === "schedule") input["dueAt"] = body.dueAt;
          const data = await bufferRequest(`mutation CreateMarketingPost($input: CreatePostInput!) { createPost(input: $input) { ... on PostActionSuccess { post { id text dueAt status channelId } } ... on MutationError { message } ... on InvalidInputError { message } ... on UnauthorizedError { message } ... on UnexpectedError { message } } }`, { input });
          return new Response(JSON.stringify(data), { status: 201, headers: { "Content-Type": "application/json" } });
        } catch (error) {
          return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Erro ao publicar no Buffer." }), { status: 500, headers: { "Content-Type": "application/json" } });
        }
      },
    },
  },
});
