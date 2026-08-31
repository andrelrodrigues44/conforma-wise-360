import { createFileRoute } from "@tanstack/react-router";

const COOKIE_NAME = "conforma360_marketing_session";
const MAX_AGE = 60 * 60 * 8;

function secret() {
  return process.env["MARKETING_SUPABASE_KEY"] || "";
}

async function sign(value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function getSessionValue(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  if (!match) return null;
  const [value, signature] = decodeURIComponent(match[1]).split(".");
  return value && signature ? { value, signature } : null;
}

async function isValidSession(request: Request) {
  const session = getSessionValue(request);
  if (!session || !secret() || session.value !== "admin") return false;
  const expected = await sign(session.value);
  return session.signature.length === expected.length && session.signature === expected;
}

export const Route = createFileRoute("/api/admin/login")({
  server: {
    handlers: {
      GET: async ({ request }) =>
        new Response(JSON.stringify({ authenticated: await isValidSession(request) }), {
          headers: { "Content-Type": "application/json" },
        }),
      POST: async ({ request }) => {
        const configuredPassword = process.env["MARKETING_ADMIN_PASSWORD"];
        if (!configuredPassword || !secret()) {
          return new Response(JSON.stringify({ error: "Administração ainda não configurada no ambiente." }), {
            status: 503,
            headers: { "Content-Type": "application/json" },
          });
        }

        const body = await request.json().catch(() => ({}));
        const password = typeof body?.password === "string" ? body.password : "";
        if (password !== configuredPassword) {
          return new Response(JSON.stringify({ error: "Senha inválida." }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        const value = "admin";
        const cookie = `${COOKIE_NAME}=${encodeURIComponent(`${value}.${await sign(value)}`)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${MAX_AGE}`;
        return new Response(JSON.stringify({ ok: true }), {
          headers: {
            "Content-Type": "application/json",
            "Set-Cookie": cookie,
          },
        });
      },
    },
  },
});
