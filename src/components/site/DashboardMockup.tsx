import painel from "@/assets/painel-conforma360.png.asset.json";

const KEY_ROWS = [14, 14, 13, 12, 11];

function KeyboardDeck() {
  return (
    <div className="kb-deck relative mx-auto w-[106%] origin-top -translate-x-[3%] rounded-b-[0.9rem] border border-white/10 bg-gradient-to-b from-[#242424] via-[#1b1b1b] to-[#101010] px-4 pb-5 pt-4 shadow-elevated sm:px-6 sm:pb-8 sm:pt-6">
      {/* Teclas */}
      <div className="space-y-1 sm:space-y-1.5">
        {KEY_ROWS.map((count, row) => (
          <div
            key={row}
            className="grid gap-[2px] sm:gap-[3px]"
            style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: count }).map((_, key) => (
              <span
                key={key}
                className="h-[5px] rounded-[2px] bg-white/[0.07] ring-1 ring-white/[0.06] sm:h-[9px] sm:rounded-[3px]"
              />
            ))}
          </div>
        ))}
        {/* Barra de espaço */}
        <div className="grid grid-cols-12 gap-[2px] sm:gap-[3px]">
          <span className="col-span-2 h-[5px] rounded-[2px] bg-white/[0.07] ring-1 ring-white/[0.06] sm:h-[9px]" />
          <span className="col-span-8 h-[5px] rounded-[2px] bg-white/[0.07] ring-1 ring-white/[0.06] sm:h-[9px]" />
          <span className="col-span-2 h-[5px] rounded-[2px] bg-white/[0.07] ring-1 ring-white/[0.06] sm:h-[9px]" />
        </div>
      </div>

      {/* Trackpad */}
      <div className="mx-auto mt-2.5 h-4 w-[34%] rounded-[0.35rem] bg-white/[0.05] ring-1 ring-white/[0.08] sm:mt-4 sm:h-6" />

      {/* Borda frontal da base */}
      <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-b-[0.9rem] bg-gradient-to-b from-white/10 to-transparent sm:h-1" />
    </div>
  );
}

export function DashboardMockup() {
  return (
    <div className="notebook-3d relative">
      {/* Elementos gráficos discretos */}
      <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-tr from-accent/60 via-transparent to-primary/10 blur-2xl" />

      <div className="notebook-3d-inner group/nb hover:notebook-3d-inner-hover">
        {/* Tampa / tela do notebook */}
        <div className="relative z-10 rounded-t-[1.1rem] border border-graphite/25 bg-gradient-to-b from-graphite to-[#1b1b1b] p-[0.55rem] shadow-elevated sm:rounded-t-[1.4rem] sm:p-3">
          <div className="relative overflow-hidden rounded-[0.6rem] bg-graphite ring-1 ring-white/10 sm:rounded-[0.8rem]">
            {/* Barra do sistema */}
            <div className="flex items-center gap-1.5 bg-[#101010] px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-destructive/70 sm:h-2 sm:w-2" />
              <span className="h-1.5 w-1.5 rounded-full bg-warning/70 sm:h-2 sm:w-2" />
              <span className="h-1.5 w-1.5 rounded-full bg-primary/70 sm:h-2 sm:w-2" />
              <div className="ml-2 flex-1 truncate rounded bg-white/10 px-2 py-0.5 text-[0.55rem] text-white/60 sm:text-[0.6rem]">
                app.conforma360.com.br/painel
              </div>
            </div>

            <img
              src={painel.url}
              alt="Centro de Operações SSMA do Conforma360: índice de conformidade 98%, resumo do dia, licenças, inspeções, treinamentos e documentos"
              className="block w-full"
              loading="eager"
              decoding="async"
            />

            {/* Brilho sutil da tela */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-white/10" />
          </div>
        </div>

        {/* Dobradiça + base com teclado em perspectiva */}
        <div className="kb-wrap">
          <KeyboardDeck />
        </div>

        {/* Sombra projetada */}
        <div className="mx-auto -mt-2 h-3 w-[80%] rounded-b-full bg-graphite/25 blur-[8px] sm:h-4" />
      </div>
    </div>
  );
}
