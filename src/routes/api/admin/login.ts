import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "conforma360_marketing_session";
const MAX_AGE = 60 * 60 * 8;

function secret() {
  return process.env["SUPABASE_MARKETING_KEY"] || "";
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

function isValidSession(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  if (!match || !secret()) return false;
  const [value, signature] = decodeURIComponent(match[1]).split(".");
  if (!value || !signature) return false;
  const expected = sign(value);
  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected)) && value === "admin";
  } catch {
    return false;
  }
}

export const Route = createFileRoute("/api/admin/login")({
  server: {
    handlers: {
      GET: async ({ request }) =>
        new Response(JSON.stringify({ authenticated: isValidSession(request) }), {
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
        const cookie = `${COOKIE_NAME}=${encodeURIComponent(`${value}.${sign(value)}`)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${MAX_AGE}`;
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
