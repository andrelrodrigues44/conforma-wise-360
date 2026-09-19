import { ArrowRight, Cog, Flame, Phone } from "lucide-react";
import jerLogo from "@/assets/parceiro-jer.png";

// Parceiros técnicos: empresas de engenharia que executam o que a plataforma
// não faz sozinha (inspeções e laudos com responsável técnico). O contato vai
// direto pro WhatsApp do parceiro.
const JER_TELEFONE_DISPLAY = "(31) 99574-2693";
const WHATSAPP_JER =
  "https://wa.me/5531995742693?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Conforma360%20e%20gostaria%20de%20saber%20mais%20sobre%20inspe%C3%A7%C3%B5es%20de%20NR-12%20e%20NR-13.";

const parceiros = [
  {
    nome: "JER Engenharia & Projetos",
    logo: jerLogo,
    descricao: "Serviços técnicos, inspeções e engenharia e projetos.",
    normas: [
      { icon: Cog, sigla: "NR-12", texto: "Segurança em máquinas e equipamentos" },
      { icon: Flame, sigla: "NR-13", texto: "Caldeiras, vasos de pressão e tubulações" },
    ],
    telefone: JER_TELEFONE_DISPLAY,
    cta: { label: "Falar sobre NR-12 e NR-13", href: WHATSAPP_JER },
  },
];

export function Partners() {
  return (
    <section id="parceiros" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-bold tracking-[0.2em] text-primary">PARCEIROS</span>
          <h2 className="mt-3 text-3xl font-extrabold text-graphite sm:text-4xl">
            Engenharia especializada ao seu lado
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Inspeções e laudos que exigem responsável técnico ficam com quem é referência no assunto
            — a Conforma360 conecta você ao parceiro certo.
          </p>
        </div>

        <div className="mt-14 grid gap-6">
          {parceiros.map((p) => (
            <article
              key={p.nome}
              className="grid items-center gap-8 rounded-2xl border border-border bg-card p-6 shadow-soft transition-shadow duration-300 hover:shadow-card sm:p-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
            >
              <div className="grid place-items-center rounded-xl border border-border bg-white p-6">
                <img
                  src={p.logo}
                  alt={`Logotipo ${p.nome}`}
                  loading="lazy"
                  className="h-auto w-full max-w-md object-contain"
                />
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-graphite">{p.nome}</h3>
                <p className="mt-2 text-muted-foreground">{p.descricao}</p>

                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {p.normas.map((n) => (
                    <li
                      key={n.sigla}
                      className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4"
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent text-primary">
                        <n.icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-graphite">{n.sigla}</p>
                        <p className="text-xs text-muted-foreground">{n.texto}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
                  <a
                    href={p.cta.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                  >
                    {p.cta.label}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 text-primary" />
                    {p.telefone}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
