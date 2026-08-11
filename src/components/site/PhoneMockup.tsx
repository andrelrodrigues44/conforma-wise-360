import appMobile from "@/assets/app-mobile.png.asset.json";

export function PhoneMockup({ className = "" }: { className?: string }) {
  return (
    <div
      className={`w-[236px] overflow-hidden rounded-[2.2rem] border-[7px] border-graphite bg-graphite shadow-elevated ${className}`}
    >
      <img
        src={appMobile.url}
        alt="Aplicativo mobile Conforma360 exibindo índice de conformidade e resumo do dia"
        className="block w-full rounded-[1.6rem]"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
