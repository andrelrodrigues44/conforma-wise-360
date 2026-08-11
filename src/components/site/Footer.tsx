import { Cloud, Globe, Headphones, Lock, Mail, Phone, RefreshCw } from "lucide-react";
import { Logo } from "./Logo";
import { EMAIL, PHONE_DISPLAY, WEBSITE } from "./contact";

const trust = [
  { icon: Cloud, title: "Tecnologia", text: "100% na nuvem" },
  { icon: Lock, title: "Segurança total", text: "Aderente à LGPD" },
  { icon: RefreshCw, title: "Atualizações", text: "Automáticas" },
  { icon: Headphones, title: "Suporte técnico", text: "Especializado" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trust.map((t) => (
            <div key={t.title} className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent text-primary">
                <t.icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-graphite">{t.title}</p>
                <p className="text-xs text-muted-foreground">{t.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-10 border-t border-border pt-12 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-sm text-sm text-muted-foreground">
              Plataforma integrada de Gestão Ambiental, Segurança do Trabalho, Compliance Legal, ESG
              e Operações.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-graphite">Contato</h3>
            <ul className="mt-4 grid gap-3 text-sm text-muted-foreground">
              <li>
                <a href="tel:+5531992293261" className="flex items-center gap-2 hover:text-primary">
                  <Phone className="h-4 w-4 text-primary" />
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 hover:text-primary">
                  <Mail className="h-4 w-4 text-primary" />
                  {EMAIL}
                </a>
              </li>
              <li>
                <a
                  href={`https://${WEBSITE}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-2 hover:text-primary"
                >
                  <Globe className="h-4 w-4 text-primary" />
                  {WEBSITE}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-graphite">Institucional</h3>
            <ul className="mt-4 grid gap-3 text-sm text-muted-foreground">
              <li>
                <a href="#modulos" className="hover:text-primary">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="#modulos" className="hover:text-primary">
                  LGPD
                </a>
              </li>
              <li>
                <a href="#modulos" className="hover:text-primary">
                  Termos de Uso
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Conforma360 · AEM Consult. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
