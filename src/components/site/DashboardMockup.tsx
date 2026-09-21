import heroNotebook from "@/assets/hero-notebook.webp";

// Imagem de apresentação do painel do Conforma360, com o notebook numa mesa de trabalho. A tela
// mostra dados de exemplo (a legenda "prévia ilustrativa" fica no Hero).
export function DashboardMockup() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-tr from-accent/60 via-transparent to-primary/10 blur-2xl" />
      <img
        src={heroNotebook}
        alt="Notebook exibindo o painel do Conforma360, com índice de conformidade, resumo do dia e status de licenças, inspeções, treinamentos e documentos"
        width={1536}
        height={1024}
        loading="eager"
        decoding="async"
        fetchPriority="high"
        className="block h-auto w-full rounded-2xl shadow-elevated"
      />
    </div>
  );
}
