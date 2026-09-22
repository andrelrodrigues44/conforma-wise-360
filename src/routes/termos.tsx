import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";

const SITE_URL = "https://www.conforma360.com.br/termos";
const title = "Termos de Uso | Conforma360";
const description =
  "Consulte as condições de acesso e uso do site e da plataforma Conforma360.";

const sections = [
  {
    title: "1. Aceitação.",
    text: "Ao acessar este site ou solicitar uma demonstração da plataforma Conforma360, você concorda com estes Termos de Uso.",
  },
  {
    title: "2. O que é o Conforma360.",
    text: "Plataforma de gestão de conformidade, meio ambiente, segurança do trabalho, compliance legal e ESG, operada por José Emílio Rodrigues (JER Engenharia & Projetos), CNPJ 15.087.536/0001-63, oferecida por planos de assinatura mensal, com teste gratuito de 14 dias.",
  },
  {
    title: "3. Teste gratuito e assinatura.",
    text: "O teste de 14 dias dá acesso completo à plataforma, sem necessidade de cartão de crédito para começar. Após o período de teste, a continuidade de uso depende da contratação de um plano pago. Não há fidelidade contratual — o cancelamento pode ser feito a qualquer momento.",
  },
  {
    title: "4. Propriedade intelectual.",
    text: "Todo o conteúdo deste site (textos, marca, layout, software da plataforma) é de propriedade da Conforma360 ou usado sob licença, e não pode ser reproduzido sem autorização.",
  },
  {
    title: "5. Uso adequado.",
    text: "Você concorda em usar o site e a plataforma apenas para fins lícitos, sem tentar comprometer a segurança ou o funcionamento do serviço.",
  },
  {
    title: "6. Limitação de responsabilidade.",
    text: "A Conforma360 se empenha em manter o site e a plataforma disponíveis e corretos, mas não garante disponibilidade ininterrupta e não se responsabiliza por decisões tomadas exclusivamente com base nas informações do site.",
  },
  {
    title: "7. Alterações.",
    text: "Estes termos podem ser atualizados periodicamente; a data no topo indica a versão mais recente.",
  },
  {
    title: "8. Foro.",
    text: "Fica eleito o foro da comarca de Belo Horizonte, MG, para dirimir eventuais controvérsias.",
  },
];

export const Route = createFileRoute("/termos")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="px-5 pb-20 pt-32 lg:px-8">
        <article className="mx-auto max-w-2xl">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao início
          </Link>

          <h1 className="mt-6 text-3xl font-extrabold text-graphite sm:text-4xl">Termos de Uso</h1>
          <p className="mt-3 text-sm text-muted-foreground">(Última atualização: 22/09/2026)</p>

          <div className="prose-conforma mt-10 grid gap-5">
            {sections.map((section) => (
              <p key={section.title} className="leading-relaxed text-muted-foreground">
                <strong className="font-bold text-graphite">{section.title}</strong> {section.text}
              </p>
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}