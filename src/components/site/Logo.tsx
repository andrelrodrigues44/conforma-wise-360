import logoAsset from "@/assets/logo-conforma360.png.asset.json";

export function Logo({ variant = "dark" }: { variant?: "dark" | "light" }) {
  return (
    <img
      src={logoAsset.url}
      alt="Conforma360 — Tecnologia, Segurança e Gestão"
      className={`h-11 w-auto shrink-0 ${variant === "light" ? "brightness-0 invert" : ""}`}
      loading="lazy"
      decoding="async"
    />
  );
}
