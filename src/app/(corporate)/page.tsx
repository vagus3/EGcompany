import EGShieldLogo from "@/components/ui/EGShieldLogo";

export default function Page() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero: logo + title */}
      <section className="flex w-full flex-col items-center gap-12 pt-28 pb-16">
        <EGShieldLogo className="h-44 w-44" />
        <h1 className="text-[clamp(4rem,12vw,9rem)] leading-none font-black tracking-tight text-black uppercase">
          EG COMPANY
        </h1>
      </section>

      {/* Building image */}
      <section className="mx-auto mb-28 w-full max-w-[87%]">
        <div className="aspect-16/7 w-full overflow-hidden bg-gray-400">
          {/* public/images/hq-building.jpg 로 교체 가능 */}
          <div className="bg-gradient-linear-to-br flex h-full w-full items-center justify-center from-gray-300 via-gray-400 to-gray-500">
            <span className="text-sm tracking-widest text-gray-200 uppercase select-none">
              Corporate Headquarters
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
