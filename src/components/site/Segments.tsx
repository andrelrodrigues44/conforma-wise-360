import mineracao from "@/assets/seg-mineracao.jpg";
import industria from "@/assets/seg-industria.jpg";
import construcao from "@/assets/seg-construcao.jpg";
import logistica from "@/assets/seg-logistica.jpg";
import energia from "@/assets/seg-energia.jpg";
import agronegocio from "@/assets/seg-agronegocio.jpg";
import publico from "@/assets/seg-publico.jpg";

const segments = [
  { img: mineracao, title: "Mineração", text: "Condicionantes, barragens, resíduos e SST." },
  { img: industria, title: "Indústria", text: "Efluentes, químicos, NRs e auditorias." },
  { img: construcao, title: "Construção Civil", text: "Obras, EPIs, inspeções e licenças." },
  { img: logistica, title: "Logística", text: "Frota, MTR, entregas e documentação." },
  { img: energia, title: "Energia", text: "Licenciamento, ESG e requisitos legais." },
  { img: agronegocio, title: "Agronegócio", text: "Outorgas, agroquímicos e rastreabilidade." },
  { img: publico, title: "Órgãos Públicos", text: "Transparência, evidências e prestação de contas." },
];

export function Segments() {
  return (
    <section id="segmentos" className="border-y border-border bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-bold tracking-[0.2em] text-primary">SEGMENTOS</span>
          <h2 className="mt-3 text-3xl font-extrabold text-graphite sm:text-4xl">
            Soluções para diversos segmentos
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Configurações e indicadores adaptados às exigências regulatórias de cada setor.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {segments.map((s) => (
            <article
              key={s.title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={s.img}
                  alt={`Segmento ${s.title}`}
                  loading="lazy"
                  width={900}
                  height={640}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-graphite/70 to-transparent" />
                <h3 className="absolute bottom-3 left-4 text-lg font-bold text-primary-foreground">
                  {s.title}
                </h3>
              </div>
              <p className="p-5 text-sm text-muted-foreground">{s.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
