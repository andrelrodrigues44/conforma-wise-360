import { useState, type ReactNode } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome").max(100),
  empresa: z.string().trim().min(2, "Informe a empresa").max(120),
  cargo: z.string().trim().max(80).optional(),
  email: z.string().trim().email("E-mail inválido").max(255),
  telefone: z.string().trim().min(8, "Telefone inválido").max(20),
  mensagem: z.string().trim().max(600).optional(),
});

export function DemoDialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const result = schema.safeParse(data);
    if (!result.success) {
      const next: Record<string, string> = {};
      for (const issue of result.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    setOpen(false);
    toast.success("Solicitação enviada!", {
      description: "Nossa equipe entrará em contato em até 1 dia útil.",
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">Solicitar demonstração</DialogTitle>
          <DialogDescription>
            Apresentação guiada de 30 minutos com um especialista, focada na realidade da sua
            operação.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 pt-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nome" name="nome" error={errors["nome"]} />
            <Field label="Empresa" name="empresa" error={errors["empresa"]} />
            <Field label="Cargo" name="cargo" error={errors["cargo"]} />
            <Field label="Telefone" name="telefone" type="tel" error={errors["telefone"]} />
          </div>
          <Field label="E-mail corporativo" name="email" type="email" error={errors["email"]} />
          <div className="grid gap-2">
            <Label htmlFor="mensagem">Como podemos ajudar? (opcional)</Label>
            <Textarea id="mensagem" name="mensagem" rows={3} maxLength={600} />
          </div>
          <Button type="submit" size="lg" className="mt-1 w-full">
            Enviar solicitação
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Seus dados são tratados conforme a LGPD.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  name,
  type = "text",
  error,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string | undefined;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} maxLength={255} aria-invalid={!!error} />
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
