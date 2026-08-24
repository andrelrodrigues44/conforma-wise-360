import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { blogPosts } from "@/lib/blog-posts";

const SITE_URL = "https://www.conforma360.com.br/blog";
const title = "Blog | Conforma360";
const description =
  "Conteúdo prático sobre Segurança do Trabalho, Meio Ambiente, Compliance e ESG — direto ao ponto, sem enrolação.";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
  }),
  component: BlogPage,
});

function formatarData(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="px-5 pb-20 pt-32 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-bold tracking-[0.2em] text-primary">BLOG</span>
          <h1 className="mt-3 text-4xl font-extrabold text-graphite sm:text-5xl">
            Conteúdo prático sobre SSMA e Compliance
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Sem enrolação: o que muda na prática da gestão de riscos, conformidade legal e ESG.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl gap-6">
          {blogPosts
            .slice()
            .sort((a, b) => b.dataPublicacao.localeCompare(a.dataPublicacao))
            .map((post) => (
              <Link
                key={post.slug}
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="group rounded-2xl border border-border bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card"
              >
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="rounded-full bg-accent px-2.5 py-1 font-semibold text-accent-foreground">
                    {post.categoria}
                  </span>
                  <span>{formatarData(post.dataPublicacao)}</span>
                  <span>·</span>
                  <span>{post.tempoLeitura} de leitura</span>
                </div>
                <h2 className="mt-3 text-xl font-bold text-graphite group-hover:text-primary sm:text-2xl">
                  {post.titulo}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">{post.resumo}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Ler artigo
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
