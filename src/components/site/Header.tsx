import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { DemoDialog } from "./DemoDialog";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/#modulos", label: "Módulos" },
  { href: "/precos", label: "Preços" },
  { href: "/#segmentos", label: "Segmentos" },
  { href: "/blog", label: "Blog" },
  { href: "/#contato", label: "Contato" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-background/90 shadow-soft backdrop-blur-xl"
          : "bg-background/60 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3 lg:px-8">
        <a href="#top" className="flex min-w-0 items-center">
          <Logo />
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
          <DemoDialog>
            <Button className="ml-3 shadow-soft">Solicitar Demonstração</Button>
          </DemoDialog>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menu"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border text-foreground lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-border bg-background px-5 pb-5 pt-2 lg:hidden">
          <nav className="grid gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <DemoDialog>
            <Button className="mt-3 w-full">Solicitar Demonstração</Button>
          </DemoDialog>
        </div>
      ) : null}
    </header>
  );
}
