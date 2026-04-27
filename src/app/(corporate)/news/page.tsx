import Link from "next/link";
import { articles } from "@/lib/news-data";
import DepartmentSidebar from "@/components/layout/DepartmentSidebar";

export default function NewsPage() {
  const featured = articles.find((a) => a.featured)!;
  const rest = articles.filter((a) => !a.featured);

  return (
    <div className="max-w-5xl mx-auto px-6 py-14">
      <div className="grid grid-cols-[1fr_280px] gap-12">
        {/* Left: Articles */}
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 mb-4">Corporate Updates</p>
          <h1 className="text-3xl font-bold text-black mb-10">Company News & Announcements</h1>

          {/* Featured article */}
          <article className="mb-12">
            <Link href={`/news/${featured.slug}`} className="group block">
              <div className="w-full aspect-4/3 bg-gradient-linear-to-br from-gray-200 to-gray-400 mb-4 overflow-hidden group-hover:opacity-90 transition-opacity" />
            </Link>
            <div className="flex items-center gap-3 mb-2">
              {featured.category && (
                <span className="text-[10px] tracking-widest uppercase bg-black text-white px-2 py-0.5">
                  {featured.category}
                </span>
              )}
              <span className="text-[11px] text-gray-400 tracking-wider">{featured.dateDisplay}</span>
            </div>
            <Link href={`/news/${featured.slug}`} className="group">
              <h2 className="text-xl font-bold text-black mb-2 group-hover:underline underline-offset-2">
                {featured.title}
              </h2>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed mb-3">{featured.excerpt}</p>
            <Link
              href={`/news/${featured.slug}`}
              className="text-[11px] tracking-widest uppercase text-black font-semibold inline-flex items-center gap-1 hover:gap-2 transition-all"
            >
              Read Full Report →
            </Link>
          </article>

          {/* Smaller articles */}
          <div className="grid grid-cols-2 gap-6">
            {rest.map((article) => (
              <article key={article.slug}>
                <Link href={`/news/${article.slug}`} className="group block">
                  <div className="w-full aspect-4/3 bg-gradient-linear-to-br from-gray-200 to-gray-400 mb-3 overflow-hidden group-hover:opacity-90 transition-opacity" />
                  <p className="text-[11px] text-gray-400 tracking-wider mb-1">{article.dateDisplay}</p>
                  <h3 className="text-base font-bold text-black leading-snug group-hover:underline underline-offset-2">
                    {article.title}
                  </h3>
                </Link>
              </article>
            ))}
          </div>
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-6">
          <DepartmentSidebar />

          {/* Internal Support */}
          <div className="border border-gray-200 p-5">
            <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-1">Internal Support</p>
            <p className="text-xs text-gray-500 mb-4">개발팀에게 커피 한 잔 사 주기.</p>
            <button className="w-full bg-black text-white text-[11px] tracking-widest uppercase py-2.5 hover:bg-gray-800 transition-colors">
              Get Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
