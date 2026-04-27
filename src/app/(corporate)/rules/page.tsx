import { rules } from "./rules-data";

export default function RulesPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16">
        <h1 className="text-[clamp(2.2rem,4.5vw,3.5rem)] font-black leading-tight tracking-tight text-black mb-6">
          Employee Conduct
          <br />& Workplace Safety
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
          EG 컴퍼니 임직원의 안전과 효율적인 업무 환경 조성을 위한 기본 행동 수칙 및
          보건 가이드라인입니다. 본 규정은 사내 보안 등급에 따라 엄격히 준수되어야 합니다.
        </p>
        <hr className="mt-10 border-gray-200" />
      </section>

      {/* Rules list */}
      <section className="max-w-4xl mx-auto px-6 pb-20 space-y-12">
        {rules.map(({ num, title, body }) => (
          <div key={num} className="grid grid-cols-[72px_1fr] gap-6">
            <span className="text-4xl font-black text-gray-200 leading-none pt-1 select-none">{num}</span>
            <div>
              <h2 className="text-base font-bold text-black mb-2">{title}</h2>
              <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Notice box */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="border border-gray-300 rounded p-6 flex gap-4">
          <span className="text-gray-400 mt-0.5">ⓘ</span>
          <div>
            <p className="text-xs font-bold text-black mb-2">Notice</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              위 지침은 모든 임직원의 안전을 보장하기 위한 최소한의 조치입니다. 지침 미준수로
              발생하는 &#39;존재적 불일치&#39;나 &#39;물리적 소실&#39;에 대해 EG 컴퍼니는 법적 책임을 지지 않습니다.
              모든 임직원은 본 문서를 숙지했음을 서명으로 갈음합니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
