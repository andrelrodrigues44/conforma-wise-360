import { createFileRoute, redirect } from "@tanstack/react-router";

// Página interna de vendas que estava pública, com números de exemplo. Saiu do ar: quem chegar
// por um link antigo cai na home.
export const Route = createFileRoute("/sales-engine")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
