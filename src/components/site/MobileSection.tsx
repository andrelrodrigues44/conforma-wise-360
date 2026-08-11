import { Truck, HardHat, ClipboardCheck, FolderOpen, BellRing, BarChart3 } from "lucide-react";
import { PhoneMockup } from "./PhoneMockup";

const features = [
  { icon: Truck, title: "Gestão de Entregas", text: "Controle de entregas em tempo real." },
  { icon: HardHat, title: "Gestão de EPIs", text: "Controle de validade, CA e histórico." },
  { icon: ClipboardCheck, title: "Inspeções", text: "Checklists e evidências fotográficas." },
  { icon: FolderOpen, title: "Documentos", text: "Centralização documental em campo." },
  { icon: BellRing, title: "Alertas Inteligentes", text: "Notificações automáticas de pendências." },
  { icon: BarChart3, title: "Dashboards", text: "Indicadores estratégicos em qualquer lugar." },
];

export function MobileSection() {
  return (
    <section className="border-y border-border bg-surface py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-[auto_minmax(0,1fr)] lg:px-8">
        <div className="flex justify-center">
          <PhoneMockup />
        </div>

        <div className="min-w-0">
          <span className="text-xs font-bold tracking-[0.2em] text-primary">APLICATIVO MOBILE</span>
          <h2 className="mt-3 text-3xl font-extrabold text-graphite sm:text-4xl">
            Todos os seus processos na palma da mão
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Operação em campo mesmo sem conexão estável: registre, evidencie e sincronize
            automaticamente com a plataforma.
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
      </div>
    </section>
  );
}
