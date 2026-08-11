import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoDialog } from "./DemoDialog";
import { WHATSAPP_URL } from "./contact";

export function FinalCta() {
  return (
    <section id="contato" className="px-5 py-20 lg:px-8 lg:py-24">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-primary px-6 py-16 text-center shadow-elevated sm:px-12">
        <div className="grid-blueprint pointer-events-none absolute inset-0 opacity-30" />
        <div className="relative mx-auto max-w-3xl">
          <h2 className="text-3xl font-extrabold text-primary-foreground sm:text-4xl">
            Pronto para transformar a gestão da sua empresa?
          </h2>
          <p className="mt-5 text-lg text-primary-foreground/85">
            Solicite uma demonstração gratuita e descubra como o Conforma360 pode elevar a
            conformidade, reduzir riscos e aumentar a eficiência operacional.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <DemoDialog>
              <Button
                size="lg"
                variant="secondary"
                className="h-12 px-7 text-base font-semibold text-primary shadow-card"
              >
                Solicitar Demonstração
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </DemoDialog>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 border-primary-foreground/40 bg-transparent px-7 text-base text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer noopener">
                <MessageCircle className="mr-1 h-4 w-4" />
                Falar no WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
