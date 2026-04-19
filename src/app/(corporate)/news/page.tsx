import Link from "next/link";

const articles = [
  {
    id: 1,
    category: "CORPORATE",
    date: "OCTOBER 24, 2024",
    title: "Q3 전략 보고서: 전략적 성장, 예상 뛰어넘다",
    excerpt:
      "EG Company는 연구 및 운송 부문의 확장에 힘입어, 분기 실적이 전년 대비 14% 상승했다고 밝혔다. 이사회는 특히 자동화 물류 시스템의 성공적인 도입과 정착을 주요 성과로 강조했다.",
    featured: true,
  },
  {
    id: 2,
    date: "OCTOBER 21, 2024",
    title: "싱가포르 지역 거점 신설",
    excerpt: "",
    featured: false,
  },
  {
    id: 3,
    date: "OCTOBER 19, 2024",
    title: "IT 시스템 유지보수로 인한 운영 중단",
    excerpt: "",
    featured: false,
  },
];

const departments = [
  { icon: "👥", label: "HR" },
  { icon: "💰", label: "FINANCE" },
  { icon: "🔬", label: "RESEARCH" },
  { icon: "🚚", label: "TRANSPORT" },
  { icon: "🔒", label: "SECURITY" },
];

export default function NewsPage() {
  const [featured, ...rest] = articles;

  return (
    <div className="max-w-5xl mx-auto px-6 py-14">
      <div className="grid grid-cols-[1fr_280px] gap-12">
        {/* Left: Articles */}
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 mb-4">Corporate Updates</p>
          <h1 className="text-3xl font-bold text-black mb-10">Company News & Announcements</h1>

          {/* Featured article */}
          <article className="mb-12">
            <div className="w-full aspect-[16/9] bg-gray-300 mb-4 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-400" />
            </div>
            <div className="flex items-center gap-3 mb-2">
              {featured.category && (
                <span className="text-[10px] tracking-widest uppercase bg-black text-white px-2 py-0.5">
                  {featured.category}
                </span>
              )}
              <span className="text-[11px] text-gray-400 tracking-wider">{featured.date}</span>
            </div>
            <h2 className="text-xl font-bold text-black mb-2">{featured.title}</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-3">{featured.excerpt}</p>
            <Link
              href="#"
              className="text-[11px] tracking-widest uppercase text-black font-semibold inline-flex items-center gap-1 hover:gap-2 transition-all"
            >
              Read Full Report →
            </Link>
          </article>

          {/* Smaller articles */}
          <div className="grid grid-cols-2 gap-6">
            {rest.map((article) => (
              <article key={article.id}>
                <div className="w-full aspect-[4/3] bg-gray-300 mb-3 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-400" />
                </div>
                <p className="text-[11px] text-gray-400 tracking-wider mb-1">{article.date}</p>
                <h3 className="text-base font-bold text-black leading-snug">{article.title}</h3>
              </article>
            ))}
          </div>
        </div>

        {/* Right: Sidebar */}
        <aside className="space-y-6">
          {/* Department Portals */}
          <div className="border border-gray-200 p-5">
            <p className="text-sm font-bold text-black mb-0.5">Department Portals</p>
            <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-5">Internal Access Only</p>
            <ul className="space-y-1">
              {departments.map(({ icon, label }) => (
                <li key={label}>
                  <Link
                    href="#"
                    className="flex items-center gap-3 py-2 px-3 text-xs tracking-widest uppercase text-gray-600 hover:bg-gray-50 hover:text-black transition-colors"
                  >
                    <span className="text-base">{icon}</span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Internal Support */}
          <div className="border border-gray-200 p-5">
            <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-1">Internal Support</p>
            <p className="text-xs text-gray-500 mb-4">개발팀에게 커피 한 잔 사 주기.</p>
            <button className="w-full bg-black text-white text-[11px] tracking-widest uppercase py-2.5 hover:bg-gray-800 transition-colors">
              Get Support
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
