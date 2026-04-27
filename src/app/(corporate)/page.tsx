import EGShieldLogo from "@/components/ui/EGShieldLogo";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero: logo + title */}
      <section className="w-full flex flex-col items-center pt-28 pb-16 gap-12">
        <EGShieldLogo className="w-44 h-44" />
        <h1 className="text-[clamp(4rem,12vw,9rem)] font-black tracking-tight text-black leading-none uppercase">
          EG COMPANY
        </h1>
      </section>

      {/* Building image */}
      <section className="w-full max-w-[87%] mx-auto mb-28">
        <div className="w-full aspect-16/7 bg-gray-400 overflow-hidden">
          {/* public/images/hq-building.jpg 로 교체 가능 */}
          <div className="w-full h-full bg-gradient-linear-to-br from-gray-300 via-gray-400 to-gray-500 flex items-center justify-center">
            <span className="text-gray-200 text-sm tracking-widest uppercase select-none">
              Corporate Headquarters
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
