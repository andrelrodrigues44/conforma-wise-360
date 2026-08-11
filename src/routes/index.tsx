import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Results } from "@/components/site/Results";
import { Modules } from "@/components/site/Modules";
import { MobileSection } from "@/components/site/MobileSection";
import { Dashboards } from "@/components/site/Dashboards";
import { Segments } from "@/components/site/Segments";
import { Benefits } from "@/components/site/Benefits";
import { Comparison } from "@/components/site/Comparison";
import { Diagnostic } from "@/components/site/Diagnostic";
import { FinalCta } from "@/components/site/FinalCta";
import { Footer } from "@/components/site/Footer";

const title = "Conforma360 | Gestão de Meio Ambiente, SST, Compliance e ESG";
const description =
  "Plataforma integrada de Meio Ambiente, SST, Compliance Legal, ESG e Operações. Reduza riscos, automatize processos e decida com dados em tempo real.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Results />
        <Modules />
        <MobileSection />
        <Dashboards />
        <Segments />
        <Benefits />
        <Comparison />
        <Diagnostic />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
