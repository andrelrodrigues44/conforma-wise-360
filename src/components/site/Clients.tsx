import { ArrowUpRight, Building2 } from "lucide-react";

// Empresas que usam a plataforma. Descrições baseadas no que cada empresa publica
// no próprio site. Sem logos por enquanto (adicionar `logo` quando o cliente
// enviar/autorizar o arquivo). Só listar com autorização do cliente.
const clientes = [
  {
    nome: "M&GEO Projetos de Engenharia",
    sigla: "M&G",
    descricao:
      "Instalação de geomembranas e coberturas flutuantes, solda de tubulações em PE e PP e fiscalização de obras.",
    site: "https://megeo.com.br/",
    siteLabel: "megeo.com.br",
  },
  {
    nome: "Major Drilling",
    sigla: "MD",
    descricao:
      "Serviços especializados de perfuração para as indústrias de mineração e metalúrgica, de superfície e subterrâneos, com operações em vários continentes.",
    site: "https://www.majordrilling.com/pt-br/",
    siteLabel: "majordrilling.com",
  },
];

export function Clients() {
  return (
    <section id="clientes" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-bold tracking-[0.2em] text-primary">CLIENTES</span>
          <h2 className="mt-3 text-3xl font-extrabold text-graphite sm:text-4xl">
            Empresas que já usam a Conforma360
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Operações de engenharia e mineração usando a plataforma na rotina de SST, meio ambiente
            e conformidade.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl gap-5 sm:grid-cols-2">
          {clientes.map((c) => (
            <article
              key={c.nome}
              className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
            >
              <div className="flex items-center gap-4">
                <span
                  aria-hidden
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-accent text-lg font-extrabold tracking-tight text-primary"
                >
                  {c.sigla || <Building2 className="h-6 w-6" />}
                </span>
                <h3 className="text-lg font-bold leading-snug text-graphite">{c.nome}</h3>
              </div>
              <p className="mt-4 flex-1 text-sm text-muted-foreground">{c.descricao}</p>
              <a
                href={c.site}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                {c.siteLabel}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
