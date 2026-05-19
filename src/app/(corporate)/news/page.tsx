import Link from "next/link";
import { articles } from "@/lib/news-data";
import DepartmentSidebar from "@/components/layout/DepartmentSidebar";

export default function Page() {
  const featured = articles.find((a) => a.featured)!;
  const rest = articles.filter((a) => !a.featured);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-14">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-12">
        {/* Left: Articles */}
        <div>
          <p className="mb-4 text-[10px] tracking-[0.3em] text-gray-400 uppercase">
            Corporate Updates
          </p>
          <h1 className="mb-10 text-3xl font-bold text-black">Company News & Announcements</h1>

          {/* Featured article */}
          <article className="mb-12">
            <Link href={`/news/${featured.slug}`} className="group block">
              <div className="bg-gradient-linear-to-br mb-4 aspect-4/3 w-full overflow-hidden from-gray-200 to-gray-400 transition-opacity group-hover:opacity-90" />
            </Link>
            <div className="mb-2 flex items-center gap-3">
              {featured.category && (
                <span className="bg-black px-2 py-0.5 text-[10px] tracking-widest text-white uppercase">
                  {featured.category}
                </span>
              )}
              <span className="text-[11px] tracking-wider text-gray-400">
                {featured.dateDisplay}
              </span>
            </div>
            <Link href={`/news/${featured.slug}`} className="group">
              <h2 className="mb-2 text-xl font-bold text-black underline-offset-2 group-hover:underline">
                {featured.title}
              </h2>
            </Link>
            <p className="mb-3 text-sm leading-relaxed text-gray-500">{featured.excerpt}</p>
            <Link
              href={`/news/${featured.slug}`}
              className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-widest text-black uppercase transition-all hover:gap-2"
            >
              Read Full Report →
            </Link>
          </article>

          {/* Smaller articles */}
          <div className="grid gap-6 sm:grid-cols-2">
            {rest.map((article) => (
              <article key={article.slug}>
                <Link href={`/news/${article.slug}`} className="group block">
                  <div className="bg-gradient-linear-to-br mb-3 aspect-4/3 w-full overflow-hidden from-gray-200 to-gray-400 transition-opacity group-hover:opacity-90" />
                  <p className="mb-1 text-[11px] tracking-wider text-gray-400">
                    {article.dateDisplay}
                  </p>
                  <h3 className="text-base leading-snug font-bold text-black underline-offset-2 group-hover:underline">
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
            <p className="mb-1 text-[10px] tracking-widest text-gray-400 uppercase">
              Internal Support
            </p>
            <p className="mb-4 text-xs text-gray-500">개발팀에게 커피 한 잔 사 주기.</p>
            <button className="w-full bg-black py-2.5 text-[11px] tracking-widest text-white uppercase transition-colors hover:bg-gray-800">
              Get Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
