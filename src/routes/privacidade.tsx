import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";

const SITE_URL = "https://www.conforma360.com.br/privacidade";
const title = "Política de Privacidade | Conforma360";
const description =
  "Saiba como a Conforma360 coleta, utiliza, protege e permite o controle dos seus dados pessoais.";

const sections = [
  {
    title: "1. Quais dados coletamos.",
    text: "Ao solicitar uma demonstração ou entrar em contato, coletamos: nome, e-mail corporativo, empresa, cargo, telefone (opcional) e a mensagem que você escrever. Não coletamos dados sensíveis por este site.",
  },
  {
    title: "2. Para que usamos.",
    text: "Usamos esses dados exclusivamente para responder sua solicitação, agendar a demonstração e manter contato comercial. Não vendemos nem compartilhamos seus dados com terceiros para fins de marketing de terceiros.",
  },
  {
    title: "3. Base legal.",
    text: "Tratamos seus dados com base no seu consentimento (ao preencher o formulário) e no nosso legítimo interesse em responder ao contato comercial que você iniciou.",
  },
  {
    title: "4. Com quem compartilhamos.",
    text: "Podemos compartilhar dados com prestadores de serviço de tecnologia que operam nossa infraestrutura (hospedagem, e-mail, WhatsApp Business), sempre limitado ao necessário para operar o site e responder seu contato.",
  },
  {
    title: "5. Por quanto tempo guardamos.",
    text: "Mantemos os dados de contato enquanto durar a relação comercial ou até você solicitar a exclusão, o que ocorrer primeiro.",
  },
  {
    title: "6. Seus direitos.",
    text: "Conforme a LGPD, você pode solicitar a qualquer momento: confirmação de tratamento, acesso, correção, eliminação, portabilidade dos seus dados, e revogação do consentimento. Para exercer qualquer desses direitos, entre em contato pelo e-mail contato@conforma360.com.br ou pelo WhatsApp (31) 98418-0879.",
  },
  {
    title: "7. Segurança.",
    text: "Adotamos medidas técnicas e organizacionais para proteger seus dados contra acesso não autorizado, perda ou alteração indevida.",
  },
  {
    title: "8. Cookies.",
    text: "Este site pode usar cookies essenciais ao funcionamento e, quando aplicável, cookies de análise de audiência. Você pode gerenciar cookies nas configurações do seu navegador.",
  },
  {
    title: "9. Alterações.",
    text: "Esta política pode ser atualizada periodicamente; a data no topo indica a versão mais recente.",
  },
  {
    title: "10. Contato.",
    text: "Dúvidas sobre esta política: contato@conforma360.com.br.",
  },
];

export const Route = createFileRoute("/privacidade")({
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
  component: PrivacyPage,
});

function PrivacyPage() {
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

          <h1 className="mt-6 text-3xl font-extrabold text-graphite sm:text-4xl">
            Política de Privacidade
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">(Última atualização: 22/09/2026)</p>

          <div className="prose-conforma mt-10 grid gap-5">
            <p className="leading-relaxed text-muted-foreground">
              A Conforma360 — operada por José Emílio Rodrigues (JER Engenharia &amp; Projetos), CNPJ
              15.087.536/0001-63 (&quot;Conforma360&quot;, &quot;nós&quot;) — respeita sua privacidade e trata os dados
              pessoais coletados neste site em conformidade com a Lei Geral de Proteção de Dados (Lei
              13.709/2018 — LGPD).
            </p>

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