// Prévia ilustrativa do painel do Conforma360, feita em HTML (não é print): fica nítida em
// qualquer tela e não carrega dado real de ninguém. Os números são de exemplo.

const NAV = ["Painel", "Alertas", "Assistente IA", "Inspeções", "Gestão de EPI", "Saúde"];

const RESUMO = [
  { cor: "bg-muted-foreground/40", texto: "0 documento(s) vencido(s)" },
  { cor: "bg-warning", texto: "3 inspeção(ões) pendente(s)" },
  { cor: "bg-primary", texto: "Nenhuma licença vencida" },
];

const CHIPS = [
  { rotulo: "Licenças", valor: "Em dia" },
  { rotulo: "Inspeções", valor: "1 atrasada" },
  { rotulo: "Treinamentos", valor: "Em dia" },
  { rotulo: "Documentos", valor: "Em dia" },
];

const BARRAS = [46, 52, 58, 63, 71, 78, 84, 91];

const RAIO = 30;
const CIRCUNFERENCIA = 2 * Math.PI * RAIO;

export function DashboardMockup() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-tr from-accent/60 via-transparent to-primary/10 blur-2xl" />

      <figure
        role="img"
        aria-label="Prévia ilustrativa do painel do Conforma360, com índice de conformidade, resumo do dia e status de licenças, inspeções, treinamentos e documentos"
        className="overflow-hidden rounded-xl border border-border bg-card shadow-elevated"
      >
        {/* Barra do navegador */}
        <div className="flex items-center gap-1.5 border-b border-border bg-surface px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-destructive/60" />
          <span className="h-2 w-2 rounded-full bg-warning/70" />
          <span className="h-2 w-2 rounded-full bg-primary/60" />
          <div className="ml-2 flex-1 truncate rounded-md bg-card px-2.5 py-0.5 text-[0.62rem] text-muted-foreground ring-1 ring-border">
            app.conforma360.com.br/painel
          </div>
        </div>

        <div
          aria-hidden="true"
          className="grid grid-cols-[6.75rem_minmax(0,1fr)] sm:grid-cols-[8rem_minmax(0,1fr)]"
        >
          {/* Menu lateral */}
          <aside className="space-y-1 bg-graphite px-2.5 py-3.5 sm:px-3">
            <p className="mb-3 px-1 text-[0.62rem] font-extrabold tracking-[0.14em] text-white">
              CONFORMA<span className="text-primary-light">360</span>
            </p>
            {NAV.map((item, i) => (
              <p
                key={item}
                className={`truncate rounded-md px-2 py-1.5 text-[0.6rem] font-medium sm:text-[0.64rem] ${
                  i === 0 ? "bg-primary text-white" : "text-white/65"
                }`}
              >
                {item}
              </p>
            ))}
          </aside>

          {/* Conteúdo */}
          <div className="min-w-0 space-y-2.5 bg-surface p-3 sm:p-4">
            <div>
              <p className="text-[0.8rem] font-extrabold text-graphite sm:text-sm">
                Centro de Operações SSMA
              </p>
              <p className="text-[0.6rem] text-muted-foreground">Visão geral da conformidade</p>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-[1.05fr_1fr]">
              {/* Índice de conformidade */}
              <div className="rounded-xl bg-gradient-to-br from-primary-dark to-primary p-3 text-white">
                <p className="text-[0.55rem] font-bold tracking-[0.14em] text-white/80">
                  ÍNDICE DE CONFORMIDADE
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <svg
                    viewBox="0 0 80 80"
                    className="h-14 w-14 shrink-0 -rotate-90 sm:h-16 sm:w-16"
                  >
                    <circle
                      cx="40"
                      cy="40"
                      r={RAIO}
                      fill="none"
                      stroke="rgba(255,255,255,0.22)"
                      strokeWidth="9"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r={RAIO}
                      fill="none"
                      stroke="white"
                      strokeWidth="9"
                      strokeLinecap="round"
                      strokeDasharray={`${CIRCUNFERENCIA * 0.98} ${CIRCUNFERENCIA}`}
                    />
                  </svg>
                  <div>
                    <p className="font-display text-2xl font-extrabold leading-none sm:text-[1.7rem]">
                      98%
                    </p>
                    <span className="mt-1.5 inline-block rounded-full bg-white/20 px-2 py-0.5 text-[0.55rem] font-semibold">
                      Excelente
                    </span>
                  </div>
                </div>
              </div>

              {/* Resumo do dia */}
              <div className="rounded-xl border border-border bg-card p-3">
                <p className="text-[0.66rem] font-bold text-graphite">Resumo do dia</p>
                <ul className="mt-2 space-y-1.5">
                  {RESUMO.map((r) => (
                    <li
                      key={r.texto}
                      className="flex items-center gap-2 text-[0.6rem] text-muted-foreground"
                    >
                      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${r.cor}`} />
                      {r.texto}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-[0.58rem] font-semibold text-primary">
                  Ver plano de ação →
                </p>
              </div>
            </div>

            {/* Situação por área */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {CHIPS.map((c) => (
                <div
                  key={c.rotulo}
                  className="rounded-lg border border-border bg-card px-2.5 py-1.5"
                >
                  <p className="text-[0.54rem] text-muted-foreground">{c.rotulo}</p>
                  <p className="text-[0.66rem] font-bold text-graphite">{c.valor}</p>
                </div>
              ))}
            </div>

            {/* Evolução da conformidade (o celular fica sobre o canto direito desta faixa) */}
            <div className="rounded-lg border border-border bg-card px-3 pb-2.5 pt-2">
              <p className="text-[0.58rem] font-semibold text-muted-foreground">
                Evolução da conformidade
              </p>
              <div className="mt-2 flex h-11 items-end gap-1.5 sm:h-14">
                {BARRAS.map((h, i) => (
                  <span
                    key={i}
                    style={{ height: `${h}%` }}
                    className={`flex-1 rounded-t ${i === BARRAS.length - 1 ? "bg-primary" : "bg-primary/35"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </figure>
    </div>
  );
}
