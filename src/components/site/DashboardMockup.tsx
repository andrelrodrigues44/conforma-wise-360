import painel from "@/assets/painel-conforma360.png.asset.json";

export function DashboardMockup() {
  return (
    <div className="relative">
      {/* Tampa / tela do notebook */}
      <div className="rounded-t-[1.1rem] border border-graphite/25 bg-gradient-to-b from-graphite to-[#1b1b1b] p-[0.55rem] shadow-elevated sm:rounded-t-[1.4rem] sm:p-3">
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

      {/* Base do notebook */}
      <div className="relative mx-auto h-3 w-[104%] -translate-x-[2%] rounded-b-[0.6rem] bg-gradient-to-b from-[#3a3a3a] to-[#1b1b1b] shadow-card sm:h-4">
        <span className="absolute left-1/2 top-1 h-1 w-16 -translate-x-1/2 rounded-full bg-white/15 sm:top-1.5 sm:w-24" />
      </div>
      <div className="mx-auto h-1.5 w-[86%] rounded-b-full bg-graphite/15 blur-[2px]" />
    </div>
  );
}
