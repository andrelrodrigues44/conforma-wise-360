import { ArrowRight, CheckCircle2, ExternalLink, GraduationCap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoDialog } from "./DemoDialog";

const ISESMT_URL = "https://conforma360.isesmt.com";

const individual = [
  "Cadastro em poucos minutos, sem burocracia",
  "Cursos de NRs 100% a distância (EAD)",
  "Certificado digital emitido na conclusão",
  "Acesso pelo computador ou pelo celular",
];

const turmas = [
  "Condições especiais por volume de colaboradores",
  "Turma fechada, exclusiva da sua empresa",
  "Acompanhamento de progresso pelo gestor",
  "Emissão de certificados em lote",
];

export function Treinamentos() {
  return (
    <section
      id="treinamentos"
      className="border-y border-border bg-surface px-5 py-20 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-bold tracking-[0.2em] text-primary">TREINAMENTOS EAD</span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-graphite sm:text-4xl">
            Capacitação online, do cadastro ao certificado
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Treinamentos de Normas Regulamentadoras 100% a distância, com certificação digital
            reconhecida. Seu colaborador se cadastra e começa o curso na hora, ou sua empresa
            contrata uma turma fechada para todo o time.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-primary/30 bg-primary/[0.04] p-7 shadow-soft lg:p-9">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
              <GraduationCap className="h-6 w-6" />
            </div>
            <p className="mt-6 text-xs font-bold tracking-[0.18em] text-primary">INDIVIDUAL</p>
            <h3 className="mt-2 text-2xl font-extrabold text-graphite">Comece agora, sozinho</h3>
            <p className="mt-4 text-muted-foreground">
              Cadastro simples e início imediato do curso, direto na nossa plataforma de EAD.
            </p>
            <ul className="mt-6 grid gap-3">
              {individual.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <Button asChild size="lg" className="mt-8 shadow-soft">
              <a href={ISESMT_URL} target="_blank" rel="noreferrer noopener">
                Cadastre-se e comece agora <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </article>

          <article className="rounded-3xl border border-border bg-card p-7 shadow-soft lg:p-9">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-primary">
              <Users className="h-6 w-6" />
            </div>
            <p className="mt-6 text-xs font-bold tracking-[0.18em] text-primary">
              EQUIPES E TURMAS
            </p>
            <h3 className="mt-2 text-2xl font-extrabold text-graphite">Contrate para o seu time</h3>
            <p className="mt-4 text-muted-foreground">
              Para turmas maiores, montamos uma proposta sob medida com condição especial por
              volume.
            </p>
            <ul className="mt-6 grid gap-3">
              {turmas.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <DemoDialog linha="treinamento">
              <Button variant="outline" size="lg" className="mt-8">
                Solicitar treinamento para minha equipe <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </DemoDialog>
          </article>
        </div>
      </div>
    </section>
  );
}
