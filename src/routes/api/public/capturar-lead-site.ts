import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const DESTINATARIO = "contato@conforma360.com.br";

const schema = z.object({
  nome: z.string().trim().min(2).max(100),
  empresa: z.string().trim().min(2).max(120),
  cargo: z.string().trim().max(80).optional().default(""),
  email: z.string().trim().email().max(255),
  telefone: z.string().trim().min(8).max(20),
  mensagem: z.string().trim().max(600).optional().default(""),
  website: z.string().optional(),
});

type Dados = {
  nome: string;
  empresa: string;
  cargo: string;
  email: string;
  telefone: string;
  mensagem: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function notificacaoHtml(d: Dados): string {
  const linha = (label: string, valor: string) =>
    `<tr><td style="padding:6px 12px 6px 0;color:#6b7280;font-size:13px">${label}</td><td style="padding:6px 0;color:#2C2C2C;font-size:14px"><strong>${escapeHtml(valor)}</strong></td></tr>`;

  return `<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px">
    <h2 style="color:#1E7A3E;margin:0 0 4px">Novo lead — Solicitação de demonstração</h2>
    <p style="color:#6b7280;font-size:13px;margin:0 0 16px">Recebido pelo site institucional (conforma360.com.br)</p>
    <table style="border-collapse:collapse;width:100%">
      ${linha("Nome", d.nome)}
      ${linha("Empresa", d.empresa)}
      ${linha("Cargo", d.cargo || "—")}
      ${linha("E-mail", d.email)}
      ${linha("Telefone", d.telefone)}
    </table>
    ${d.mensagem ? `<p style="margin-top:16px;color:#2C2C2C;font-size:14px"><strong>Mensagem:</strong><br/>${escapeHtml(d.mensagem)}</p>` : ""}
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0"/>
    <p style="color:#9ca3af;font-size:12px;margin:0">Conforma360 — captado automaticamente via conforma360.com.br</p>
  </div>`;
}

export const Route = createFileRoute("/api/public/capturar-lead-site")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: corsHeaders }),
      POST: async ({ request }) => {
        const json = (body: unknown, status = 200) =>
          new Response(JSON.stringify(body), {
            status,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });

        try {
          const parsed = schema.safeParse(await request.json());
          if (!parsed.success) return json({ error: "Dados inválidos" }, 400);

          // honeypot — envio humano nunca preenche este campo
          if (parsed.data.website) return json({ ok: true });

          const dados: Dados = {
            nome: parsed.data.nome,
            empresa: parsed.data.empresa,
            cargo: parsed.data.cargo,
            email: parsed.data.email,
            telefone: parsed.data.telefone,
            mensagem: parsed.data.mensagem,
          };

          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { error: insertError } = await supabaseAdmin.from("leads_site").insert({
            nome: dados.nome,
            empresa: dados.empresa,
            cargo: dados.cargo || null,
            email: dados.email,
            telefone: dados.telefone,
            mensagem: dados.mensagem || null,
            ip: request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for"),
            user_agent: request.headers.get("user-agent"),
          });
          if (insertError) console.error("Erro ao gravar lead:", insertError);

          const zeptoToken = process.env["ZEPTOMAIL_TOKEN"];
          const zeptoFrom = process.env["ZEPTOMAIL_FROM_ADDRESS"];
          if (zeptoToken && zeptoFrom) {
            const res = await fetch("https://api.zeptomail.com/v1.1/email", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: zeptoToken.startsWith("Zoho-enczapikey")
                  ? zeptoToken
                  : `Zoho-enczapikey ${zeptoToken}`,
              },
              body: JSON.stringify({
                from: { address: zeptoFrom, name: "Conforma360 — Site" },
                to: [{ email_address: { address: DESTINATARIO, name: "Conforma360" } }],
                reply_to: [{ address: dados.email, name: dados.nome }],
                subject: `Novo lead: ${dados.empresa} (${dados.nome})`,
                htmlbody: notificacaoHtml(dados),
              }),
            });
            if (!res.ok) console.error("ZeptoMail error:", res.status, await res.text());
          } else {
            console.error(
              "ZEPTOMAIL_TOKEN / ZEPTOMAIL_FROM_ADDRESS não configurados — lead gravado, sem e-mail.",
            );
          }

          return json({ ok: true });
        } catch (e) {
          console.error(e);
          return json({ error: "Erro interno" }, 500);
        }
      },
    },
  },
});
