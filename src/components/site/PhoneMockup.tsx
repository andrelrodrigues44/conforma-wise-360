// Celular ilustrativo do aplicativo, feito em HTML (não é print): nítido em qualquer tela e sem
// dado real de ninguém. Os números são de exemplo.

const RESUMO = [
  { cor: "bg-muted-foreground/40", texto: "0 documento(s) vencido(s)" },
  { cor: "bg-warning", texto: "3 inspeção(ões) pendente(s)" },
  { cor: "bg-primary", texto: "Nenhuma licença vencida" },
];

const RAIO = 30;
const CIRCUNFERENCIA = 2 * Math.PI * RAIO;

export function PhoneMockup({ className = "" }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label="Prévia ilustrativa do aplicativo mobile do Conforma360, com índice de conformidade e resumo do dia"
      className={`w-[236px] overflow-hidden rounded-[2.2rem] border-[7px] border-graphite bg-graphite shadow-elevated ${className}`}
    >
      <div aria-hidden="true" className="space-y-3 rounded-[1.6rem] bg-surface px-3.5 pb-4 pt-3">
        {/* Topo */}
        <div className="flex items-center justify-between">
          <p className="text-[0.62rem] font-extrabold tracking-[0.14em] text-graphite">
            CONFORMA<span className="text-primary">360</span>
          </p>
          <span className="h-4 w-4 rounded-full bg-accent ring-1 ring-primary/20" />
        </div>
        <div>
          <p className="text-[0.85rem] font-extrabold text-graphite">Centro de Operações SSMA</p>
          <p className="text-[0.6rem] text-muted-foreground">Visão geral da conformidade</p>
        </div>

        {/* Índice de conformidade */}
        <div className="rounded-xl bg-gradient-to-br from-primary-dark to-primary p-3 text-white">
          <p className="text-[0.52rem] font-bold tracking-[0.14em] text-white/80">
            ÍNDICE DE CONFORMIDADE
          </p>
          <div className="mt-2 flex items-center gap-3">
            <svg viewBox="0 0 80 80" className="h-14 w-14 shrink-0 -rotate-90">
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
              <p className="font-display text-2xl font-extrabold leading-none">98%</p>
              <span className="mt-1.5 inline-block rounded-full bg-white/20 px-2 py-0.5 text-[0.52rem] font-semibold">
                Excelente
              </span>
            </div>
          </div>
        </div>

        {/* Resumo do dia */}
        <div className="rounded-xl border border-border bg-card p-3">
          <p className="text-[0.68rem] font-bold text-graphite">Resumo do dia</p>
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
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-border bg-card px-2.5 py-1.5">
            <p className="text-[0.52rem] text-muted-foreground">Licenças</p>
            <p className="text-[0.64rem] font-bold text-graphite">Em dia</p>
          </div>
          <div className="rounded-lg border border-border bg-card px-2.5 py-1.5">
            <p className="text-[0.52rem] text-muted-foreground">Inspeções</p>
            <p className="text-[0.64rem] font-bold text-graphite">1 atrasada</p>
          </div>
        </div>
      </div>
    </div>
  );
}
