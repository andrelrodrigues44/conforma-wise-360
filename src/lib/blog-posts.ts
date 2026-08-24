export type BlogBlock =
  { type: "p"; text: string } | { type: "h2"; text: string } | { type: "ul"; items: string[] };

export interface BlogPost {
  slug: string;
  titulo: string;
  resumo: string;
  categoria: string;
  dataPublicacao: string; // ISO
  tempoLeitura: string;
  blocks: BlogBlock[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "nr-01-riscos-psicossociais-o-que-muda-na-pratica",
    titulo: "NR-01 e riscos psicossociais: o que muda na prática da gestão de SST",
    resumo:
      "A NR-01 deixou de tratar risco psicossocial como tema opcional — hoje ele faz parte do Programa de Gerenciamento de Riscos (PGR), com as mesmas exigências de identificação, avaliação e controle já aplicadas a riscos físicos e químicos.",
    categoria: "Riscos Psicossociais",
    dataPublicacao: "2026-06-10",
    tempoLeitura: "6 min",
    blocks: [
      {
        type: "p",
        text: "Por muito tempo, saúde mental no trabalho ficou numa área cinzenta: reconhecida como importante, mas sem um processo formal exigido pela legislação de Segurança e Saúde no Trabalho. Isso mudou com a atualização da NR-01, que passou a tratar os riscos psicossociais dentro da mesma lógica de gerenciamento de risco já aplicada a agentes físicos, químicos e biológicos — com identificação, avaliação, plano de ação e reavaliação periódica, dentro do Programa de Gerenciamento de Riscos (PGR).",
      },
      { type: "h2", text: "O que conta como risco psicossocial" },
      {
        type: "p",
        text: "Na prática, isso inclui fatores como sobrecarga de trabalho, metas inatingíveis, ambiguidade de papéis, assédio moral, jornadas exaustivas, falta de autonomia e conflitos interpessoais crônicos. São riscos reais de adoecimento — afastamentos por transtornos mentais estão entre as causas que mais crescem em boa parte dos setores produtivos — mas historicamente difíceis de medir de forma estruturada, justamente por não deixarem vestígio físico como um ruído acima do limite de tolerância ou uma substância química no ar.",
      },
      { type: "h2", text: "O que a empresa precisa ter, na prática" },
      {
        type: "ul",
        items: [
          "Um instrumento de avaliação estruturado — questionário validado, aplicado periodicamente, não uma percepção informal do RH.",
          "Anonimato garantido nas respostas individuais, com resultado apresentado de forma agregada — nunca expondo quem respondeu o quê.",
          "Um plano de ação vinculado a cada risco identificado como relevante, com responsável e prazo — igual ao que já se exige para um risco ergonômico ou de ruído.",
          "Reavaliação periódica, para acompanhar se as medidas de controle estão funcionando ao longo do tempo.",
          "Integração com o restante do PGR — o risco psicossocial não pode viver numa pesquisa de clima isolada, desconectada do inventário de riscos da empresa.",
        ],
      },
      { type: "h2", text: "O erro mais comum" },
      {
        type: "p",
        text: "O erro mais comum não é ignorar o tema — é tratá-lo como uma pesquisa de clima organizacional avulsa, feita uma vez e arquivada. Sem periodicidade, sem plano de ação rastreável e sem ligação com o restante do programa de gestão de riscos, a empresa cumpre a letra da norma sem cumprir o espírito dela — e continua exposta tanto ao risco de adoecimento real quanto ao risco de não conformidade numa fiscalização.",
      },
      {
        type: "p",
        text: "Uma plataforma que trata risco psicossocial com o mesmo rigor de rastreabilidade de qualquer outro risco ocupacional — questionário estruturado, matriz de risco, plano de ação e dashboard de acompanhamento — é o que transforma essa exigência de checklist em processo de gestão de verdade.",
      },
    ],
  },
  {
    slug: "como-estruturar-inventario-de-perigos-e-riscos",
    titulo: "Como estruturar um inventário de perigos e riscos ocupacionais (passo a passo)",
    resumo:
      "Um inventário de riscos malfeito é pior do que nenhum: dá falsa sensação de controle. Veja a sequência que evita os erros mais comuns — perigo confundido com risco, controle listado sem eficácia avaliada, e risco residual nunca recalculado.",
    categoria: "Gestão de Riscos",
    dataPublicacao: "2026-07-02",
    tempoLeitura: "7 min",
    blocks: [
      {
        type: "p",
        text: "Todo programa de gestão de SST depende de uma base comum: saber, com precisão, quais perigos existem em cada processo e atividade da empresa, e qual o risco real associado a cada um. Parece óbvio, mas é exatamente aqui que a maioria dos inventários falha — misturando perigo com risco, listando controles que nunca foram avaliados de fato, e nunca recalculando o risco residual depois que uma medida é implementada.",
      },
      { type: "h2", text: "1. Separe processo, atividade e perigo" },
      {
        type: "p",
        text: "Comece pela estrutura, não pela planilha de riscos. Mapeie os processos da operação, depois as atividades dentro de cada processo, e só então associe os perigos a cada atividade específica — não ao processo como um todo. 'Manutenção mecânica' é um processo genérico demais para ligar direto a um risco; 'troca de peça em equipamento energizado' é uma atividade específica, com perigos e controles próprios.",
      },
      { type: "h2", text: "2. Perigo não é risco" },
      {
        type: "p",
        text: "Perigo é a fonte com potencial de causar dano — ruído, uma superfície em altura, um produto químico. Risco é a combinação entre a probabilidade daquele perigo se concretizar e a severidade da consequência caso aconteça. Um mesmo perigo pode gerar riscos muito diferentes dependendo do contexto: trabalho em altura numa plataforma com guarda-corpo bem dimensionado é um risco distinto do mesmo trabalho sem proteção coletiva.",
      },
      { type: "h2", text: "3. Avalie o risco antes e depois do controle" },
      {
        type: "p",
        text: "É aqui que a maioria dos inventários perde a validade rápido: o risco é avaliado uma vez, os controles são listados ao lado, e ninguém recalcula o risco residual depois que a medida foi implementada. Sem essa segunda avaliação, não dá para saber se o controle realmente reduziu o risco a um nível aceitável — ele só existe no papel.",
      },
      { type: "h2", text: "4. Priorize por severidade, não só por frequência" },
      {
        type: "ul",
        items: [
          "Riscos de baixa probabilidade e alta severidade (ex: espaço confinado, trabalho com energia elétrica) exigem controle rigoroso mesmo sendo raros.",
          "Riscos de alta frequência e baixa severidade (ex: pequenos cortes recorrentes) merecem atenção, mas não devem consumir o mesmo nível de prioridade que um risco catastrófico pouco frequente.",
          "A matriz de probabilidade x severidade existe exatamente para evitar que a equipe de SST gaste energia desproporcional em riscos triviais enquanto um risco raro e grave fica sem plano de ação.",
        ],
      },
      { type: "h2", text: "5. Gere plano de ação automaticamente para risco alto ou crítico" },
      {
        type: "p",
        text: "Todo risco classificado como alto ou crítico deveria, por padrão, gerar um plano de ação com responsável e prazo — não depender de alguém lembrar de criar isso manualmente depois. É essa automação, junto com o recálculo do risco residual, que transforma um inventário de uma foto estática num processo vivo de gestão de risco.",
      },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
