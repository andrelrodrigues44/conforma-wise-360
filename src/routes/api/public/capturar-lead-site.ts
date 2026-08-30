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
  linha_comercial: z.enum(["consultoria", "plataforma", "ambos"]).optional().default("ambos"),
  interesse: z.string().trim().max(120).optional().default(""),
  segmento: z.string().trim().max(80).optional().default(""),
  porte: z.string().trim().max(50).optional().default(""),
  unidades: z.coerce.number().int().min(1).max(10000).optional(),
  consentimento_marketing: z.boolean().optional().default(false),
});

type Dados = {
  nome: string;
  empresa: string;
  cargo: string;
  email: string;
  telefone: string;
  mensagem: string;
  linha_comercial: "consultoria" | "plataforma" | "ambos";
  interesse: string;
  segmento: string;
  porte: string;
  unidades?: number;
  consentimento_marketing: boolean;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function scoreLead(d: Dados): number {
  let score = 0;
  const cargo = d.cargo.toLowerCase();
  const segmento = d.segmento.toLowerCase();
  const interesse = d.interesse.toLowerCase();

  if (/diretor|gerente|coordenador|supervisor|head|socio|sócio/.test(cargo)) score += 20;
  if (/minera|industrial|indústria|industria|automot/.test(segmento)) score += 20;
  if ((d.unidades ?? 1) > 1) score += 15;
  if (/demonstra|plataforma|software|sistema/.test(interesse)) score += 25;
  if (/diagnóstico|diagnostico|consultoria|auditoria|licenciamento/.test(interesse)) score += 20;
  if (d.consentimento_marketing) score += 5;
  return Math.min(score, 100);
}

function temperatura(score: number): "cold" | "warm" | "hot" {
  if (score >= 70) return "hot";
  if (score >= 40) return "warm";
  return "cold";
}

function notificacaoHtml(d: Dados, score: number, temp: string): string {
  const linha = (label: string, valor: string) =>
    `<tr><td style="padding:6px 12px 6px 0;color:#6b7280;font-size:13px">${label}</td><td style="padding:6px 0;color:#2C2C2C;font-size:14px"><strong>${escapeHtml(valor)}</strong></td></tr>`;

  return `<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px">
    <h2 style="color:#1E7A3E;margin:0 0 4px">Novo lead — Conforma360</h2>
    <p style="color:#6b7280;font-size:13px;margin:0 0 16px">Lead captado pelo site institucional</p>
    <table style="border-collapse:collapse;width:100%">
      ${linha("Nome", d.nome)}
      ${linha("Empresa", d.empresa)}
      ${linha("Cargo", d.cargo || "—")}
      ${linha("E-mail", d.email)}
      ${linha("Telefone", d.telefone)}
      ${linha("Linha", d.linha_comercial)}
      ${linha("Segmento", d.segmento || "—")}
      ${linha("Interesse", d.interesse || "—")}
      ${linha("Score", `${score}/100 — ${temp.toUpperCase()}`)}
    </table>
    ${d.mensagem ? `<p style="margin-top:16px;color:#2C2C2C;font-size:14px"><strong>Mensagem:</strong><br/>${escapeHtml(d.mensagem)}</p>` : ""}
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0"/>
    <p style="color:#9ca3af;font-size:12px;margin:0">Conforma360 — lead captado e classificado automaticamente.</p>
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
          if (parsed.data.website) return json({ ok: true });

          const dados: Dados = {
            nome: parsed.data.nome,
            empresa: parsed.data.empresa,
            cargo: parsed.data.cargo,
            email: parsed.data.email,
            telefone: parsed.data.telefone,
            mensagem: parsed.data.mensagem,
            linha_comercial: parsed.data.linha_comercial,
            interesse: parsed.data.interesse,
            segmento: parsed.data.segmento,
            porte: parsed.data.porte,
            unidades: parsed.data.unidades,
            consentimento_marketing: parsed.data.consentimento_marketing,
          };

          // Chave anon/publicável -- segura de expor num app público. A
          // gravação em leads_site é liberada só pra INSERT via RLS
          // (20270103090000_leads_site_insercao_anonima.sql, no repo do
          // Conforma360), sem nenhum acesso de leitura/escrita adicional.
          // NUNCA usar a service_role key aqui -- ela ignora todo o RLS do
          // banco de produção do SaaS, exposição desproporcional pra um
          // formulário de lead público.
          const { supabase } = await import("@/integrations/supabase/client");
          const { error: insertError } = await supabase.from("leads_site").insert({
            nome: dados.nome,
            empresa: dados.empresa,
            cargo: dados.cargo || null,
            email: dados.email,
            telefone: dados.telefone,
            mensagem: dados.mensagem || null,
            linha_comercial: dados.linha_comercial,
            interesse: dados.interesse || null,
            segmento: dados.segmento || null,
            porte: dados.porte || null,
            unidades: dados.unidades ?? null,
            score,
            temperatura: temp,
            etapa: "novo",
            status: "aberto",
            proxima_acao: temp === "hot" ? "Contato comercial em até 48h" : "Qualificar lead",
            proxima_acao_em: new Date(Date.now() + (temp === "hot" ? 48 : 72) * 60 * 60 * 1000).toISOString(),
            consentimento_marketing: dados.consentimento_marketing,
            ip: request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for"),
            user_agent: request.headers.get("user-agent"),
          }).select("id").single();

          if (insertError) console.error("Erro ao gravar lead:", insertError);

          if (lead?.id) {
            await db.from("sales_activities").insert({
              lead_id: lead.id,
              tipo: "captura",
              descricao: `Lead captado pelo site. Score ${score}/100 (${temp}). Linha: ${dados.linha_comercial}.`,
            });
          }

          const zeptoToken = process.env["ZEPTOMAIL_TOKEN"];
          const zeptoFrom = process.env["ZEPTOMAIL_FROM_ADDRESS"];
          if (zeptoToken && zeptoFrom) {
            const res = await fetch("https://api.zeptomail.com/v1.1/email", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: zeptoToken.startsWith("Zoho-enczapikey") ? zeptoToken : `Zoho-enczapikey ${zeptoToken}`,
              },
              body: JSON.stringify({
                from: { address: zeptoFrom, name: "Conforma360 — Site" },
                to: [{ email_address: { address: DESTINATARIO, name: "Conforma360" } }],
                reply_to: [{ address: dados.email, name: dados.nome }],
                subject: `[${temp.toUpperCase()} ${score}] Novo lead: ${dados.empresa}`,
                htmlbody: notificacaoHtml(dados, score, temp),
              }),
            });
            if (!res.ok) console.error("ZeptoMail error:", res.status, await res.text());
          } else {
            console.error("ZEPTOMAIL_TOKEN / ZEPTOMAIL_FROM_ADDRESS não configurados — lead gravado, sem e-mail.");
          }

          return json({ ok: true, lead_id: lead?.id ?? null, score, temperatura: temp });
        } catch (e) {
          console.error(e);
          return json({ error: "Erro interno" }, 500);
        }
      },
    },
  },
});
