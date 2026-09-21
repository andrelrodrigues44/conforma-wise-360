import { createFileRoute, redirect } from "@tanstack/react-router";

// A página de apresentação do "Marketing AI" era pública e mostrava números de exemplo como se
// fossem reais. Saiu do ar: quem chegar por um link antigo cai na home. O painel privado
// (/marketing-dashboard, com senha) não mudou.
export const Route = createFileRoute("/marketing-ai")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
