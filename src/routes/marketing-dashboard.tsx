import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BarChart3,
  Bot,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Flame,
  LogOut,
  Megaphone,
  MessageSquareText,
  RefreshCw,
  Target,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/marketing-dashboard")({
  head: () => ({
    meta: [
      { title: "Centro de Marketing AI | Conforma360" },
      { name: "description", content: "Painel privado de marketing, leads, campanhas e Sales Engine da Conforma360." },
    ],
  }),
  component: MarketingDashboardPage,
});

type DashboardData = {
  stats: {
    leads: number; hot: number; warm: number; open: number; pendingFollowups: number;
    reviewContents: number; activeCampaigns: number; conversionRate: number;
    byLine: Record<string, number>; byStage: Record<string, number>; byTemperature: Record<string, number>;
  };
  leads: Array<Record<string, any>>;
  followups: Array<Record<string, any>>;
  contents: Array<Record<string, any>>;
  campaigns: Array<Record<string, any>>;
  activities: Array<Record<string, any>>;
};

const tabs = [
  ["visao-geral", "Visão geral", BarChart3],
  ["leads", "Leads", Users],
  ["conteudos", "Conteúdos", FileText],
  ["campanhas", "Campanhas", Megaphone],
  ["followups", "Follow-ups", MessageSquareText],
] as const;

function moneyLabel(value: string) {
  return value === "consultoria" ? "Consultoria" : value === "plataforma" ? "Plataforma" : "Ambos";
}

function MarketingDashboardPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<(typeof tabs)[number][0]>("visao-geral");

  async function checkSession() {
    const response = await fetch("/api/admin/login", { credentials: "include" });
    const json = await response.json().catch(() => ({}));
    setAuthenticated(Boolean(json.authenticated));
    return Boolean(json.authenticated);
  }

  async function loadDashboard() {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/admin/dashboard", { credentials: "include" });
      if (response.status === 401) { setAuthenticated(false); return; }
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Não foi possível carregar o painel.");
      setData(json); setAuthenticated(true);
    } catch (e) { setError(e instanceof Error ? e.message : "Erro ao carregar o painel."); }
    finally { setLoading(false); }
  }

  useEffect(() => { checkSession().then((ok) => { if (ok) loadDashboard(); }); }, []);

  async function login(event: React.FormEvent) {
    event.preventDefault(); setError(""); setLoading(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST", credentials: "include", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(json.error || "Não foi possível entrar.");
      setPassword(""); setAuthenticated(true); await loadDashboard();
    } catch (e) { setError(e instanceof Error ? e.message : "Erro ao entrar."); }
    finally { setLoading(false); }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    setAuthenticated(false); setData(null);
  }

  if (authenticated === null) return <div className="grid min-h-screen place-items-center bg-[#f5f7f6] text-sm text-muted-foreground">Carregando Centro de Marketing…</div>;

  if (!authenticated) return (
    <div className="min-h-screen bg-[#f5f7f6] px-5 py-10">
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center">
        <div className="w-full rounded-3xl border border-border bg-white p-8 shadow-elevated">
          <div className="mb-8 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-white"><Bot className="h-6 w-6" /></div>
            <div><p className="text-xs font-extrabold tracking-[0.16em] text-primary">CONFORMA360</p><h1 className="text-2xl font-extrabold text-graphite">Marketing AI</h1></div>
          </div>
          <h2 className="text-xl font-bold text-graphite">Centro privado</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Acesse o painel comercial, leads, conteúdos e follow-ups.</p>
          <form onSubmit={login} className="mt-7 space-y-4">
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha administrativa" autoComplete="current-password" />
            {error && <p className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
            <Button type="submit" className="h-11 w-full" disabled={loading || !password}>{loading ? "Entrando…" : "Entrar no painel"}</Button>
          </form>
          <Link to="/" className="mt-6 block text-center text-xs font-semibold text-muted-foreground hover:text-primary">Voltar ao site</Link>
        </div>
      </div>
    </div>
  );

  const stats = data?.stats;
  const hotLeads = useMemo(() => (data?.leads || []).filter((lead) => lead.temperatura === "hot"), [data]);

  return (
    <div className="min-h-screen bg-[#f5f7f6] text-graphite">
      <header className="sticky top-0 z-30 border-b border-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-5 lg:px-8">
          <div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-white"><Bot className="h-5 w-5" /></div><div><p className="text-[10px] font-extrabold tracking-[0.18em] text-primary">CONFORMA360</p><p className="font-bold">Marketing AI</p></div></div>
          <div className="flex items-center gap-2"><Button variant="outline" size="sm" onClick={loadDashboard} disabled={loading}><RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />Atualizar</Button><Button variant="ghost" size="sm" onClick={logout}><LogOut className="mr-2 h-4 w-4" />Sair</Button></div>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-5 py-8 lg:px-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div><p className="text-xs font-extrabold tracking-[0.2em] text-primary">CENTRO DE COMANDO</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Marketing & Sales Intelligence</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Uma operação integrada para vender as duas linhas da Conforma360: Consultoria e Plataforma.</p></div>
          <div className="flex items-center gap-2 rounded-2xl border border-primary/15 bg-white px-4 py-3 text-xs font-semibold"><span className="h-2 w-2 rounded-full bg-primary" />Sales Engine conectado</div>
        </div>

        <nav className="mt-8 flex gap-1 overflow-x-auto rounded-2xl border border-border bg-white p-1.5 shadow-soft">
          {tabs.map(([id, label, Icon]) => <button key={id} onClick={() => setTab(id)} className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${tab === id ? "bg-primary text-white" : "text-muted-foreground hover:bg-surface hover:text-graphite"}`}><Icon className="h-4 w-4" />{label}</button>)}
        </nav>

        {error && <div className="mt-5 flex items-center justify-between rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive"><span>{error}</span><button onClick={() => setError("")}><X className="h-4 w-4" /></button></div>}

        {tab === "visao-geral" && <>
          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["Leads ativos", stats?.open ?? 0, Users, "base comercial"],
              ["Hot leads", stats?.hot ?? 0, Flame, "prioridade máxima"],
              ["Follow-ups", stats?.pendingFollowups ?? 0, MessageSquareText, "fila de aprovação"],
              ["Conversão", `${stats?.conversionRate ?? 0}%`, Target, "leads convertidos"],
            ].map(([label, value, Icon, note]) => <div key={String(label)} className="rounded-2xl border border-border bg-white p-5 shadow-soft"><div className="flex items-center justify-between"><div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div><span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{note}</span></div><p className="mt-5 text-3xl font-extrabold">{String(value)}</p><p className="mt-1 text-sm text-muted-foreground">{String(label)}</p></div>)}
          </section>

          <section className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
            <div className="rounded-3xl border border-border bg-white p-6 shadow-soft"><div className="flex items-center justify-between"><div><p className="text-xs font-extrabold tracking-[0.16em] text-primary">OPORTUNIDADES</p><h2 className="mt-1 text-xl font-extrabold">Leads que merecem atenção</h2></div><Flame className="h-5 w-5 text-primary" /></div><div className="mt-5 divide-y divide-border">{hotLeads.slice(0, 6).map((lead) => <div key={lead.id} className="flex items-center justify-between gap-4 py-4"><div className="min-w-0"><p className="truncate font-bold">{lead.nome}</p><p className="mt-1 truncate text-xs text-muted-foreground">{lead.empresa} · {lead.cargo || "Cargo não informado"}</p></div><div className="flex items-center gap-3"><span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-extrabold text-primary">{lead.score}/100</span><span className="hidden rounded-full bg-surface px-2.5 py-1 text-xs font-semibold sm:inline">{moneyLabel(lead.linha_comercial)}</span></div></div>)}{hotLeads.length === 0 && <div className="py-10 text-center text-sm text-muted-foreground">Nenhum HOT no momento.</div>}</div></div>
            <div className="rounded-3xl border border-border bg-white p-6 shadow-soft"><p className="text-xs font-extrabold tracking-[0.16em] text-primary">SAÚDE DA OPERAÇÃO</p><h2 className="mt-1 text-xl font-extrabold">Marketing → Vendas</h2><div className="mt-6 space-y-4">{[["Conteúdos para revisar", stats?.reviewContents ?? 0, FileText], ["Campanhas ativas", stats?.activeCampaigns ?? 0, Megaphone], ["Leads no funil", stats?.leads ?? 0, Users]].map(([label, value, Icon]) => <div key={String(label)} className="flex items-center justify-between rounded-2xl bg-surface p-4"><div className="flex items-center gap-3"><Icon className="h-4 w-4 text-primary" /><span className="text-sm font-semibold">{String(label)}</span></div><span className="text-xl font-extrabold">{String(value)}</span></div>)}</div><div className="mt-5 rounded-2xl border border-primary/15 bg-primary/5 p-4 text-xs leading-5 text-muted-foreground"><CheckCircle2 className="mb-2 h-4 w-4 text-primary" />A IA prepara conteúdo e follow-ups. Publicações e comunicações externas permanecem sob aprovação.</div></div>
          </section>
        </>}

        {tab === "leads" && <DataList title="Leads" subtitle="Base comercial priorizada pelo Lead Scoring" items={data?.leads || []} empty="Nenhum lead encontrado." render={(item) => <div className="grid gap-3 md:grid-cols-[1.3fr_1fr_auto_auto] md:items-center"><div><p className="font-bold">{item.nome}</p><p className="text-xs text-muted-foreground">{item.empresa} · {item.cargo || "—"}</p></div><div className="text-sm"><span className="font-semibold">{moneyLabel(item.linha_comercial)}</span><p className="text-xs text-muted-foreground">{item.segmento || "Segmento —"}</p></div><span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-extrabold text-primary">{item.score}/100 · {String(item.temperatura).toUpperCase()}</span><span className="text-xs font-semibold text-muted-foreground">{item.etapa}</span></div>} />}
        {tab === "conteudos" && <DataList title="Conteúdos" subtitle="Produção editorial e fila de aprovação" items={data?.contents || []} empty="Nenhum conteúdo criado." render={(item) => <div className="grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-center"><div><p className="font-bold">{item.titulo}</p><p className="text-xs text-muted-foreground">{item.canal} · {item.formato} · {moneyLabel(item.linha_comercial)}</p></div><span className="rounded-full bg-surface px-3 py-1 text-xs font-bold">{item.status}</span><ChevronRight className="hidden h-4 w-4 text-muted-foreground md:block" /></div>} />}
        {tab === "campanhas" && <DataList title="Campanhas" subtitle="Planejamento e execução comercial" items={data?.campaigns || []} empty="Nenhuma campanha criada." render={(item) => <div className="grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-center"><div><p className="font-bold">{item.nome}</p><p className="text-xs text-muted-foreground">{item.objetivo} · {moneyLabel(item.linha_comercial)}</p></div><span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{item.status}</span><ChevronRight className="hidden h-4 w-4 text-muted-foreground md:block" /></div>} />}
        {tab === "followups" && <DataList title="Follow-ups" subtitle="Mensagens geradas pela IA para aprovação" items={data?.followups || []} empty="Nenhum follow-up pendente." render={(item) => <div className="grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-center"><div><p className="font-bold">{item.assunto || "Próximo contato Conforma360"}</p><p className="line-clamp-2 text-xs leading-5 text-muted-foreground">{item.mensagem}</p></div><span className="rounded-full bg-surface px-3 py-1 text-xs font-bold">{item.canal}</span><span className="text-xs font-bold text-primary">{item.status}</span></div>} />}
      </main>
    </div>
  );
}

function DataList({ title, subtitle, items, empty, render }: { title: string; subtitle: string; items: Array<Record<string, any>>; empty: string; render: (item: Record<string, any>) => React.ReactNode }) {
  return <section className="mt-6 rounded-3xl border border-border bg-white p-6 shadow-soft"><div><p className="text-xs font-extrabold tracking-[0.16em] text-primary">CENTRO DE OPERAÇÃO</p><h2 className="mt-1 text-2xl font-extrabold">{title}</h2><p className="mt-1 text-sm text-muted-foreground">{subtitle}</p></div><div className="mt-6 divide-y divide-border">{items.length ? items.map((item) => <div key={item.id} className="py-4">{render(item)}</div>) : <div className="py-14 text-center text-sm text-muted-foreground"><Clock3 className="mx-auto mb-3 h-5 w-5" />{empty}</div>}</div></section>;
}
