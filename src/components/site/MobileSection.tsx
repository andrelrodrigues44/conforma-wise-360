import {
  ClipboardCheck,
  Camera,
  FolderOpen,
  BellRing,
  ScrollText,
  BarChart3,
} from "lucide-react";
import { PhoneMockup } from "./PhoneMockup";

const features = [
  {
    icon: ClipboardCheck,
    title: "Inspeções",
    text: "Realize inspeções, registre informações e evidências diretamente em campo.",
  },
  {
    icon: Camera,
    title: "Evidências fotográficas",
    text: "Registre evidências no local e mantenha a rastreabilidade das informações.",
  },
  {
    icon: FolderOpen,
    title: "Documentos",
    text: "Acesse e consulte documentos importantes durante a operação.",
  },
  {
    icon: BellRing,
    title: "Alertas",
    text: "Tenha visibilidade sobre pendências, prazos e situações que exigem atenção.",
  },
  {
    icon: ScrollText,
    title: "Requisitos e conformidade",
    text: "Consulte informações relacionadas à conformidade e obrigações aplicáveis.",
  },
  {
    icon: BarChart3,
    title: "Indicadores",
    text: "Tenha acesso aos principais indicadores para apoiar decisões onde estiver.",
  },
];

export function MobileSection() {
  return (
    <section className="border-y border-border bg-surface py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:px-8">
        <div className="min-w-0">
          <span className="text-xs font-bold tracking-[0.2em] text-primary">APLICATIVO MOBILE</span>
          <h2 className="mt-3 text-3xl font-extrabold text-graphite sm:text-4xl">
            SSMA em campo. Controle em tempo real.
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Leve a gestão do Conforma360 para a operação, registre informações, evidências e
            ocorrências em campo e mantenha sua gestão conectada à plataforma.
          </p>

          <div className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-soft">
                  <f.icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-graphite">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center lg:order-last">
          <div className="relative">
            <div className="pointer-events-none absolute -inset-8 -z-10 rounded-full bg-accent/70 blur-3xl" />
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
