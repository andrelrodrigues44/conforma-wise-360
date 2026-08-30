import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/admin/logout")({
  server: {
    handlers: {
      POST: async () =>
        new Response(JSON.stringify({ ok: true }), {
          headers: {
            "Content-Type": "application/json",
            "Set-Cookie": "conforma360_marketing_session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0",
          },
        }),
    },
  },
});
