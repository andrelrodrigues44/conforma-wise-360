import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Clock,
  ExternalLink,
  GraduationCap,
  Users,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoDialog } from "./DemoDialog";
import {
  TREINAMENTOS_URL,
  formatarPreco,
  periodo,
  rotuloDias,
  rotuloModalidade,
  urlCurso,
  urlInscricao,
  useTurmasAbertas,
} from "@/lib/turmas-abertas";

const ISESMT_URL = "https://conforma360.isesmt.com";

const individual = [
  "Cadastro em poucos minutos, sem burocracia",
  "Cursos de NRs a distância (EAD), no seu ritmo",
  "Certificado digital emitido na conclusão",
  "Acesso pelo computador ou pelo celular",
];

const abertas = [
  "Turmas online ao vivo e presenciais, com data marcada",
  "Inscrição e pagamento online (PIX, boleto ou cartão)",
  "Certificado com código de validação e QR Code",
  "Instrutor engenheiro e auditor líder",
];

const turmas = [
  "Condições especiais por volume de colaboradores",
  "Turma fechada, exclusiva da sua empresa",
  "Acompanhamento de progresso pelo gestor",
  "Emissão de certificados em lote",
];

export function Treinamentos() {
  const turma = useTurmasAbertas()[0];
  return (
    <section
      id="treinamentos"
      className="border-y border-border bg-surface px-5 py-20 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-bold tracking-[0.2em] text-primary">TREINAMENTOS</span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-graphite sm:text-4xl">
            Capacitação em SST e Meio Ambiente, do cadastro ao certificado
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Treinamentos de Normas Regulamentadoras e de gestão ambiental, com certificado digital e
            código de validação. Escolha uma turma aberta com data marcada, comece um curso EAD na
            hora ou contrate uma turma fechada para todo o time.
          </p>
        </div>

        {turma ? (
          <div className="mt-10 overflow-hidden rounded-3xl border-2 border-primary bg-gradient-to-br from-primary/10 via-card to-card p-6 shadow-soft sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-primary-foreground">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" aria-hidden />
                    Inscrições abertas
                  </span>
                  <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
                    {rotuloDias(turma.start_date)}
                  </span>
                </div>
                <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-graphite sm:text-3xl">
                  {turma.training_name}
                </h3>
                <ul className="mt-4 grid gap-2 text-sm text-foreground/80 sm:grid-cols-2">
                  <li className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 shrink-0 text-primary" />
                    {periodo(turma)}
                  </li>
                  {turma.schedule_text ? (
                    <li className="flex items-center gap-2">
                      <Clock className="h-4 w-4 shrink-0 text-primary" />
                      {turma.schedule_text}
                    </li>
                  ) : null}
                  <li className="flex items-center gap-2">
                    <Video className="h-4 w-4 shrink-0 text-primary" />
                    {rotuloModalidade(turma)}, com certificado
                  </li>
                  {turma.seats_left != null ? (
                    <li className="flex items-center gap-2">
                      <Users className="h-4 w-4 shrink-0 text-primary" />
                      {turma.seats_left <= 5
                        ? `Últimas ${turma.seats_left} vagas`
                        : `${turma.seats_left} vagas disponíveis`}
                    </li>
                  ) : null}
                </ul>
              </div>
              <div className="flex shrink-0 flex-col items-start gap-3 lg:items-end">
                <div className="lg:text-right">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    Investimento por vaga
                  </p>
                  <p className="text-4xl font-extrabold text-graphite">
                    {formatarPreco(turma.price_cents)}
                  </p>
                  <p className="text-xs text-muted-foreground">PIX, boleto ou cartão</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button asChild size="lg" className="shadow-soft">
                    <a href={urlInscricao(turma, "site-principal-secao")}>
                      Garantir minha vaga <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <a href={urlCurso(turma, "site-principal-secao")}>Ver conteúdo</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <article className="rounded-3xl border border-border bg-card p-7 shadow-soft lg:p-9">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-primary">
              <CalendarClock className="h-6 w-6" />
            </div>
            <p className="mt-6 text-xs font-bold tracking-[0.18em] text-primary">TURMAS ABERTAS</p>
            <h3 className="mt-2 text-2xl font-extrabold text-graphite">Vagas com data marcada</h3>
            <p className="mt-4 text-muted-foreground">
              Veja as próximas turmas e o catálogo completo de treinamentos no nosso site de
              capacitação.
            </p>
            <ul className="mt-6 grid gap-3">
              {abertas.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <Button asChild size="lg" className="mt-8 shadow-soft">
              <a
                href={`${TREINAMENTOS_URL}/catalogo?utm_source=site-principal&utm_medium=site&utm_campaign=catalogo`}
              >
                Ver catálogo e turmas <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </article>

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
