import { notFound } from "next/navigation";
import Link from "next/link";
import { articles, getArticle } from "@/lib/news-data";
import type { Block } from "@/lib/news-data";
import DepartmentSidebar from "@/components/layout/DepartmentSidebar";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

function renderBlock(block: Block, idx: number) {
  switch (block.type) {
    case "image":
      return (
        <figure key={idx} className="my-6">
          <div className="w-full aspect-[16/9] bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500" />
          {block.caption && (
            <figcaption className="mt-2 text-[10px] tracking-widest uppercase text-gray-400">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case "blockquote":
      return (
        <blockquote
          key={idx}
          className="my-6 pl-4 border-l-2 border-gray-400 text-[15px] text-gray-700 leading-relaxed italic"
        >
          {block.text}
        </blockquote>
      );

    case "paragraph":
      return (
        <p key={idx} className="my-4 text-sm text-gray-600 leading-[1.85]">
          {block.text}
        </p>
      );

    case "hr":
      return <hr key={idx} className="my-6 border-gray-200" />;

    case "maintenance-table":
      return (
        <div key={idx} className="my-6 border border-gray-200 bg-gray-50 p-5">
          <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-4">작업 세부 사항</p>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-200">
              {block.rows.map(({ label, value }) => (
                <tr key={label}>
                  <td className="py-3 pr-8 font-medium text-black w-24 align-top">{label}</td>
                  <td className="py-3 text-gray-500 text-right">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "stats":
      return (
        <div key={idx} className="my-8 border border-gray-200 p-6">
          <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-6">{block.title}</p>
          <div className="flex gap-16">
            {block.metrics.map(({ value, label }) => (
              <div key={label}>
                <p className="text-4xl font-black text-black tracking-tight">{value}</p>
                <p className="text-[10px] tracking-widest uppercase text-gray-400 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      );
  }
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="grid grid-cols-[1fr_260px] gap-16">
        {/* Left: Article */}
        <article>
          {/* Breadcrumb */}
          {article.breadcrumb ? (
            <nav className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-gray-400 mb-6">
              {article.breadcrumb.map((crumb, i) => (
                <span key={crumb} className="flex items-center gap-2">
                  {i > 0 && <span>›</span>}
                  <span className={i === article.breadcrumb!.length - 1 ? "text-black font-semibold" : ""}>
                    {crumb}
                  </span>
                </span>
              ))}
            </nav>
          ) : article.category ? (
            <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-4">
              {article.category}
            </p>
          ) : null}

          {/* Title */}
          <h1 className="text-[clamp(1.8rem,4vw,2.8rem)] font-black leading-tight tracking-tight text-black mb-4">
            {article.title}
          </h1>

          {/* Date */}
          <p className="text-xs tracking-widest uppercase text-gray-400 mb-6">
            {article.dateDisplay}
          </p>

          {/* Content blocks */}
          {article.blocks.map((block, idx) => renderBlock(block, idx))}

          {/* Share / Bookmark */}
          <div className="mt-10 flex items-center gap-3 pt-6 border-t border-gray-200">
            <button
              aria-label="공유"
              className="w-8 h-8 border border-gray-300 flex items-center justify-center text-gray-500 hover:border-black hover:text-black transition-colors text-sm"
            >
              ↗
            </button>
            <button
              aria-label="북마크"
              className="w-8 h-8 border border-gray-300 flex items-center justify-center text-gray-500 hover:border-black hover:text-black transition-colors text-sm"
            >
              🔖
            </button>
          </div>
        </article>

        {/* Right: Sidebar */}
        <DepartmentSidebar />
      </div>
    </div>
  );
}
