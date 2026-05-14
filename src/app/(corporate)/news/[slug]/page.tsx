import { notFound } from "next/navigation";
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
          <div className="bg-gradient-linear-to-br aspect-4/3 w-full from-gray-300 via-gray-400 to-gray-500" />
          {block.caption && (
            <figcaption className="mt-2 text-[10px] tracking-widest text-gray-400 uppercase">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case "blockquote":
      return (
        <blockquote
          key={idx}
          className="my-6 border-l-2 border-gray-400 pl-4 text-[15px] leading-relaxed text-gray-700 italic"
        >
          {block.text}
        </blockquote>
      );

    case "paragraph":
      return (
        <p key={idx} className="my-4 text-sm leading-[1.85] text-gray-600">
          {block.text}
        </p>
      );

    case "hr":
      return <hr key={idx} className="my-6 border-gray-200" />;

    case "maintenance-table":
      return (
        <div key={idx} className="my-6 border border-gray-200 bg-gray-50 p-5">
          <p className="mb-4 text-[10px] tracking-widest text-gray-400 uppercase">작업 세부 사항</p>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-200">
              {block.rows.map(({ label, value }) => (
                <tr key={label}>
                  <td className="w-24 py-3 pr-8 align-top font-medium text-black">{label}</td>
                  <td className="py-3 text-right text-gray-500">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "stats":
      return (
        <div key={idx} className="my-8 border border-gray-200 p-6">
          <p className="mb-6 text-[10px] tracking-widest text-gray-400 uppercase">{block.title}</p>
          <div className="flex gap-16">
            {block.metrics.map(({ value, label }) => (
              <div key={label}>
                <p className="text-4xl font-black tracking-tight text-black">{value}</p>
                <p className="mt-1 text-[10px] tracking-widest text-gray-400 uppercase">{label}</p>
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

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="grid grid-cols-[1fr_260px] gap-16">
        {/* Left: Article */}
        <article>
          {/* Breadcrumb */}
          {article.breadcrumb ? (
            <nav className="mb-6 flex items-center gap-2 text-[10px] tracking-widest text-gray-400 uppercase">
              {article.breadcrumb.map((crumb, i) => (
                <span key={crumb} className="flex items-center gap-2">
                  {i > 0 && <span>›</span>}
                  <span
                    className={
                      i === article.breadcrumb!.length - 1 ? "font-semibold text-black" : ""
                    }
                  >
                    {crumb}
                  </span>
                </span>
              ))}
            </nav>
          ) : article.category ? (
            <p className="mb-4 text-[10px] tracking-widest text-gray-400 uppercase">
              {article.category}
            </p>
          ) : null}

          {/* Title */}
          <h1 className="mb-4 text-[clamp(1.8rem,4vw,2.8rem)] leading-tight font-black tracking-tight text-black">
            {article.title}
          </h1>

          {/* Date */}
          <p className="mb-6 text-xs tracking-widest text-gray-400 uppercase">
            {article.dateDisplay}
          </p>

          {/* Content blocks */}
          {article.blocks.map((block, idx) => renderBlock(block, idx))}

          {/* Share / Bookmark */}
          <div className="mt-10 flex items-center gap-3 border-t border-gray-200 pt-6">
            <button
              aria-label="공유"
              className="flex h-8 w-8 items-center justify-center border border-gray-300 text-sm text-gray-500 transition-colors hover:border-black hover:text-black"
            >
              ↗
            </button>
            <button
              aria-label="북마크"
              className="flex h-8 w-8 items-center justify-center border border-gray-300 text-sm text-gray-500 transition-colors hover:border-black hover:text-black"
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
