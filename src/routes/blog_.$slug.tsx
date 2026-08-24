import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { DemoDialog } from "@/components/site/DemoDialog";
import { Button } from "@/components/ui/button";
import { WHATSAPP_URL } from "@/components/site/contact";
import { getBlogPost } from "@/lib/blog-posts";

export const Route = createFileRoute("/blog_/$slug")({
  loader: ({ params }) => {
    const post = getBlogPost(params.slug);
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const url = `https://www.conforma360.com.br/blog/${loaderData.slug}`;
    return {
      meta: [
        { title: `${loaderData.titulo} | Conforma360` },
        { name: "description", content: loaderData.resumo },
        { property: "og:title", content: loaderData.titulo },
        { property: "og:description", content: loaderData.resumo },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: BlogPostPage,
});

function formatarData(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function BlogPostPage() {
  const post = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="px-5 pb-20 pt-32 lg:px-8">
        <article className="mx-auto max-w-2xl">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao blog
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="rounded-full bg-accent px-2.5 py-1 font-semibold text-accent-foreground">
              {post.categoria}
            </span>
            <span>{formatarData(post.dataPublicacao)}</span>
            <span>·</span>
            <span>{post.tempoLeitura} de leitura</span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold text-graphite sm:text-4xl">{post.titulo}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{post.resumo}</p>

          <div className="prose-conforma mt-10 grid gap-5">
            {post.blocks.map((block, i) => {
              if (block.type === "h2") {
                return (
                  <h2 key={i} className="mt-4 text-2xl font-bold text-graphite">
                    {block.text}
                  </h2>
                );
              }
              if (block.type === "ul") {
                return (
                  <ul key={i} className="grid gap-2.5 pl-1">
                    {block.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-muted-foreground">
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={i} className="leading-relaxed text-muted-foreground">
                  {block.text}
                </p>
              );
            })}
          </div>

          <div className="mt-14 rounded-2xl border border-border bg-surface p-7 text-center">
            <h3 className="text-lg font-bold text-graphite">
              Quer ver isso funcionando na sua operação?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              O Conforma360 estrutura gestão de riscos, conformidade e SST numa única plataforma.
            </p>
            <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
              <DemoDialog>
                <Button size="lg">
                  Solicitar Demonstração
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </DemoDialog>
              <Button asChild size="lg" variant="outline">
                <a href={WHATSAPP_URL} target="_blank" rel="noreferrer noopener">
                  <MessageCircle className="mr-1 h-4 w-4" />
                  Falar no WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
