import { companyEvolutionData } from "@/lib/evolution-data";
import Image from "next/image";

export default function Page() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="mx-auto grid max-w-5xl items-start gap-8 px-4 pt-14 pb-16 sm:px-6 md:grid-cols-2 md:gap-16 md:pt-20 md:pb-24">
        <h1 className="text-[clamp(2.8rem,5vw,4.2rem)] leading-tight font-black tracking-tight text-black">
          Global Infrastructure.
          <br />
          Silent Excellence.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-gray-500">
          EG Company는 국제 무역과 물류, 그리고 민간 보안 분야를 뒷받침하는 핵심 시스템과 기반
          구조를 구축하고 운영하는 기업입니다.
        </p>
      </section>

      {/* Director section */}
      <section className="mx-auto grid max-w-5xl items-start gap-10 px-4 pb-16 sm:px-6 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr] lg:gap-16 lg:pb-24">
        {/* Portrait */}
        <div>
          <div className="relative aspect-4/5 w-full max-w-72 overflow-hidden bg-gray-800 md:max-w-none">
            <Image
              src="/eg_png/egcompany_picture/AboutUs/AboutUs.png"
              alt="Director E.G. portrait"
              fill
              sizes="(min-width: 768px) 280px, 288px"
              className="object-cover"
              priority
            />
          </div>
          <p className="mt-3 text-sm font-semibold text-black">Director E.G.</p>
          <p className="mt-0.5 text-xs tracking-widest text-gray-400 uppercase">
            EG Company 대표이사
          </p>
        </div>

        {/* Quote */}
        <div className="pt-4">
          <span className="font-serif text-5xl leading-none text-gray-300 select-none">&#34;</span>
          <blockquote className="mt-2 text-[1.35rem] leading-snug font-semibold text-black">
            &#34;정밀함은 순간의 결과가 아니라, 과정입니다. 우리는 드러나지 않는 영역에서 움직이며,
            세상의 핵심 시스템들이 어떤 상황에서도 무너지지 않도록 합니다.&#34;
          </blockquote>
          <div className="mt-8 space-y-4 text-sm leading-relaxed text-gray-600">
            <p>
              이 조직을 설립했을 때 목표는 단순했습니다. 신뢰라는 이름의 유산을 남기는 것. 우리는
              주목받기 위해 움직이지 않아요. 문제를 해결하기 위해 움직입니다. 작은 지역 물류
              회사에서 시작해서 다국적 기업으로 성장해온 시간, 완벽함과 절제된 규칙을 끝까지 고수한
              우리의 태도를 증명합니다.
            </p>
            <p>
              복잡한 21세기 속에서도, EG Company는 운영 보안과 산업 혁신 분야에서 흔들림 없는 회사로
              함께 할 것입니다.
            </p>
            <p>우리는 과거를 망각하지 않으며, 그 위에 미래를 구축해 나갑니다.</p>
            <p className="font-semibold text-black">
              진실은 언제나 관찰의 반대편에 있습니다.
            </p>
          </div>
          <p className="mt-8 flex items-center gap-3 text-xs tracking-[0.25em] text-gray-400 uppercase">
            <span className="inline-block h-px w-10 bg-gray-400" />
            Director E.G.
          </p>
        </div>
      </section>

      {/* Company Evolution */}
      <section className="bg-gray-100 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-14 text-xs tracking-[0.3em] text-gray-400 uppercase">
            Company Evolution
          </h2>
          <div className="divide-y divide-gray-300">
            {companyEvolutionData.map(({ year, title, desc }) => (
              <div
                key={year}
                className="grid items-start gap-3 py-8 sm:grid-cols-[120px_1fr] lg:grid-cols-[140px_220px_1fr] lg:gap-8 lg:py-10"
              >
                <span className="text-4xl font-black text-gray-300">{year}</span>
                <p className="pt-2 text-xs tracking-widest text-gray-500 uppercase">{title}</p>
                <p className="text-sm leading-relaxed text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
