import { companyEvolutionData } from "./evolution-data";

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-24 grid grid-cols-2 gap-16 items-start">
        <h1 className="text-[clamp(2.8rem,5vw,4.2rem)] font-black leading-tight tracking-tight text-black">
          Global Infrastructure.
          <br />
          Silent Excellence.
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed mt-4">
          EG Company는 국제 무역과 물류, 그리고 민간 보안 분야를 뒷받침하는 핵심 시스템과
          기반 구조를 구축하고 운영하는 기업입니다.
        </p>
      </section>

      {/* Director section */}
      <section className="max-w-5xl mx-auto px-6 pb-24 grid grid-cols-[280px_1fr] gap-16 items-start">
        {/* Portrait */}
        <div>
          <div className="w-full aspect-4/5 bg-gray-800 overflow-hidden">
            {/* public/images/director.jpg 로 교체 가능 */}
            <div className="w-full h-full bg-gradient-linear-to-b from-gray-700 to-gray-900" />
          </div>
          <p className="mt-3 text-sm font-semibold text-black">Director E.G.</p>
          <p className="text-xs text-gray-400 uppercase tracking-widest mt-0.5">EG Company 대표이사</p>
        </div>

        {/* Quote */}
        <div className="pt-4">
          <span className="text-5xl text-gray-300 font-serif leading-none select-none">&#34;</span>
          <blockquote className="text-[1.35rem] font-semibold leading-snug text-black mt-2">
            &#34;정밀함은 순간의 결과가 아니라, 과정입니다.
            우리는 드러나지 않는 영역에서 움직이며,
            세상의 핵심 시스템들이 어떤 상황에서도
            무너지지 않도록 합니다.&#34;
          </blockquote>
          <div className="mt-8 space-y-4 text-sm text-gray-600 leading-relaxed">
            <p>
              이 조직을 설립했을 때 목표는 단순했습니다. 신뢰라는 이름의 유산을 남기는 것.
              우리는 주목받기 위해 움직이지 않아요. 문제를 해결하기 위해 움직입니다.
              작은 지역 물류 회사에서 시작해서 다국적 기업으로 성장해온 시간,
              완벽함과 절제된 규칙을 끝까지 고수한 우리의 태도를 증명합니다.
            </p>
            <p>
              복잡한 21세기 속에서도, EG Company는 운영 보안과 산업 혁신 분야에서 흔들림 없는
              회사로 함께 할 것입니다.
            </p>
            <p>우리는 과거를 망각하지 않으며, 그 위에 미래를 구축해 나갑니다.</p>
          </div>
          <p className="mt-8 text-xs tracking-[0.25em] text-gray-400 uppercase flex items-center gap-3">
            <span className="inline-block w-10 h-px bg-gray-400" />
            Director E.G.
          </p>
        </div>
      </section>

      {/* Company Evolution */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-14">Company Evolution</h2>
          <div className="divide-y divide-gray-300">
            {companyEvolutionData.map(({ year, title, desc }) => (
              <div key={year} className="py-10 grid grid-cols-[140px_220px_1fr] gap-8 items-start">
                <span className="text-4xl font-black text-gray-300">{year}</span>
                <p className="text-xs tracking-widest uppercase text-gray-500 pt-2">{title}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
