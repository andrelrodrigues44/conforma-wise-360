import {
  ArrowRight,
  ClipboardCheck,
  FileSpreadsheet,
  FileText,
  FlaskConical,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const HOTMART = "https://go.hotmart.com";
const SRC = "dp=1&src=site";

// Preços e links lidos na Hotmart em 02/11/2026. Para trocar um preço ou link, edite só este array.
const produtos = [
  {
    id: "I108296942L",
    tipo: "E-book em PDF",
    nome: "Checklist de documentos de SST e meio ambiente",
    descricao:
      "167 itens para preparar auditoria e fiscalização, cada um com a norma e o item de base. Para imprimir e preencher.",
    preco: "R$ 37",
    icone: ClipboardCheck,
  },
  {
    id: "B108303641U",
    tipo: "E-book em PDF",
    nome: "NR-01 na prática: GRO e PGR passo a passo",
    descricao:
      "Etapas do GRO, inventário de riscos, matriz 5x5, plano de ação e estudo de caso, com o item da norma em cada exigência.",
    preco: "R$ 37",
    icone: FileText,
  },
  {
    id: "D108303717E",
    tipo: "E-book em PDF",
    nome: "Guia de bolso: FDS e rotulagem de produtos químicos",
    descricao:
      "O que a NR-26 diz sobre rótulo e ficha de segurança, com roteiros, checklists e um estudo de caso.",
    preco: "R$ 27",
    icone: FlaskConical,
  },
  {
    id: "P108289276B",
    tipo: "Planilha em Excel",
    nome: "Pacote NR-01 com painel de gestão",
    descricao:
      "Inventário de riscos, plano de ação 5W2H e painel com gráficos que se atualiza sozinho, com exemplos preenchidos.",
    preco: "R$ 67",
    icone: FileSpreadsheet,
  },
  {
    id: "V108295784G",
    tipo: "Serviço remoto",
    nome: "Diagnóstico Express",
    descricao:
      "Análise dos seus documentos e fotos, relatório com plano de ação priorizado e reunião por vídeo de até 45 minutos. 1 estabelecimento, até 50 trabalhadores.",
    preco: "R$ 297",
    icone: Stethoscope,
  },
];

export function Loja() {
  return (
    <section id="loja" className="px-5 py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-bold tracking-[0.2em] text-primary">LOJA</span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-graphite sm:text-4xl">
            Materiais para organizar SST e meio ambiente
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Guias, planilha e um diagnóstico remoto, feitos por quem faz auditoria. Cada afirmação
            traz a norma e o item. Compra pela Hotmart, com garantia de 7 dias.
          </p>
        </div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {produtos.map((p) => {
            const Icone = p.icone;
            return (
              <li key={p.id} className="flex">
                <article className="flex w-full flex-col rounded-3xl border border-border bg-card p-7 shadow-soft">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-primary">
                    <Icone className="h-6 w-6" />
                  </div>
                  <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                    {p.tipo}
                  </p>
                  <h3 className="mt-2 text-xl font-extrabold text-graphite">{p.nome}</h3>
                  <p className="mt-3 flex-1 text-sm text-muted-foreground">{p.descricao}</p>
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                    <p className="whitespace-nowrap text-3xl font-extrabold text-graphite">
                      {p.preco}
                    </p>
                    <Button asChild>
                      <a
                        href={`${HOTMART}/${p.id}?${SRC}`}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        Ver detalhes <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>

        <p className="mx-auto mt-8 max-w-3xl text-center text-xs text-muted-foreground">
          Materiais de finalidade educacional, que não substituem o texto da norma publicado
          oficialmente nem o responsável técnico da empresa. Nenhum deles é laudo, PGR pronto ou
          parecer. Valores sujeitos a alteração.
        </p>
      </div>
    </section>
  );
}
