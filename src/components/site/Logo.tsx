export function Logo({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const wordmark = variant === "light" ? "text-primary-foreground" : "text-graphite";
  const accent = variant === "light" ? "text-primary-foreground/70" : "text-primary";

  return (
    <div className="flex items-center gap-2.5">
      <svg
        viewBox="0 0 48 56"
        className="h-9 w-auto shrink-0"
        aria-hidden="true"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M24 1.5 45 8.2v20.4C45 41.3 36.2 50.7 24 54.5 11.8 50.7 3 41.3 3 28.6V8.2L24 1.5Z"
          className="fill-primary-dark"
        />
        <path
          d="M24 6.5 40 11.6v17.1c0 9.9-6.7 17.4-16 20.6-9.3-3.2-16-10.7-16-20.6V11.6L24 6.5Z"
          className="fill-background"
        />
        <path
          d="M32 16c0 11.5-5.9 20-14.5 24.5C15.4 33 17.6 24.8 24 20c-4.7 1.2-8.3 4.1-10.7 8.3C11.7 22 15.5 16.9 22 15.2c3.6-.9 7-.6 10 .8Z"
          className="fill-primary"
        />
      </svg>
      <div className="leading-none">
        <div className={`font-display text-[1.35rem] font-extrabold tracking-tight ${wordmark}`}>
          CONFORMA<span className="text-primary">360</span>
        </div>
        <div className={`mt-1 text-[0.55rem] font-semibold tracking-[0.22em] ${accent}`}>
          TECNOLOGIA · SEGURANÇA · GESTÃO
        </div>
      </div>
    </div>
  );
}
