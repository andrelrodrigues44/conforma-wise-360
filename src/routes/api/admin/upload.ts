// Upload manual de criativo -- o usuário anexa a imagem (feita fora,
// com controle total do visual) em vez do pipeline gerar sozinho. Mesma
// autenticação por cookie das outras rotas admin (ver manage.ts pro
// racional completo). Funciona de celular também: <input type="file">
// no cliente já abre a galeria de fotos nativa, nada especial aqui.
import { createFileRoute } from "@tanstack/react-router";

const COOKIE_NAME = "conforma360_marketing_session";
const MAX_FILES = 10;
const MAX_BYTES = 10 * 1024 * 1024;

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

export const Route = createFileRoute("/api/admin/upload")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!(await authorized(request))) return new Response(JSON.stringify({ error: "Não autorizado." }), { status: 401 });
        const supabaseUrl = process.env["MARKETING_SUPABASE_URL"];
        const key = process.env["MARKETING_SUPABASE_KEY"];
        if (!supabaseUrl || !key) return new Response(JSON.stringify({ error: "Supabase não configurado no servidor." }), { status: 500 });

        try {
          const form = await request.formData();
          const files = form.getAll("files").filter((f): f is File => f instanceof File);
          if (!files.length) return new Response(JSON.stringify({ error: "Nenhum arquivo enviado." }), { status: 400 });
          if (files.length > MAX_FILES) return new Response(JSON.stringify({ error: `Máximo de ${MAX_FILES} imagens por vez.` }), { status: 400 });

          const urls: string[] = [];
          for (const file of files) {
            if (!file.type.startsWith("image/")) return new Response(JSON.stringify({ error: `"${file.name}" não é uma imagem.` }), { status: 400 });
            if (file.size > MAX_BYTES) return new Response(JSON.stringify({ error: `"${file.name}" maior que 10MB.` }), { status: 400 });

            const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
            const objectPath = `generated/manual-${crypto.randomUUID()}.${ext}`;
            const buffer = await file.arrayBuffer();
            const response = await fetch(`${supabaseUrl}/storage/v1/object/marketing-creatives/${objectPath}`, {
              method: "POST",
              headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": file.type, "x-upsert": "true" },
              body: buffer,
            });
            const body = await response.text();
            if (!response.ok) return new Response(JSON.stringify({ error: `Falha ao subir "${file.name}": ${body}` }), { status: 500 });
            urls.push(`${supabaseUrl}/storage/v1/object/public/marketing-creatives/${objectPath}`);
          }

          return new Response(JSON.stringify({ urls }), { status: 201, headers: { "Content-Type": "application/json" } });
        } catch (error) {
          return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Erro ao subir imagem." }), { status: 500 });
        }
      },
    },
  },
});
