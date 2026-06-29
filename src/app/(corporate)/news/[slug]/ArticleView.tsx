"use client";

import Image from "next/image";
import type { Article, Block } from "@/lib/news-data";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/hooks/useLanguage";

function renderBlock(block: Block, idx: number, workDetailsLabel: string) {
  switch (block.type) {
    case "image":
      return (
        <figure key={idx} className="my-12">
          <div className="relative aspect-16/7 w-full overflow-hidden bg-gray-300">
            {block.imageSrc && (
              <Image
                src={block.imageSrc}
                alt={block.caption ?? "EG Company news image"}
                fill
                sizes="(min-width: 1024px) 900px, 100vw"
                className="object-cover grayscale"
                priority={idx === 0}
              />
            )}
          </div>
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
          className="my-10 border-l-4 border-black py-2 pl-8 text-[17px] leading-9 text-gray-500"
        >
          {block.text}
        </blockquote>
      );

    case "paragraph":
      return (
        <p key={idx} className="my-7 text-sm leading-8 text-gray-500">
          {block.text}
        </p>
      );

    case "hidden-note":
      return (
        <div
          key={idx}
          className="my-8 bg-gray-200 px-4 py-3 text-sm leading-8 text-transparent selection:bg-gray-400 selection:text-black"
        >
          {block.text}
        </div>
      );

    case "hr":
      return <hr key={idx} className="my-8 border-gray-200" />;

    case "maintenance-table":
      return (
        <div key={idx} className="my-8 border border-gray-200 bg-gray-50 p-6">
          <p className="mb-4 text-[10px] tracking-widest text-gray-400 uppercase">
            {workDetailsLabel}
          </p>
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
        <div key={idx} className="my-10 bg-gray-100 px-10 py-8">
          <p className="mb-5 text-[10px] font-bold tracking-[0.35em] text-gray-400 uppercase">
            {block.title}
          </p>
          <div className="flex flex-wrap gap-10">
            {block.metrics.map(({ value, label }) => (
              <div key={label}>
                <p className="text-4xl font-bold tracking-tight text-black">{value}</p>
                <p className="mt-1 text-[10px] tracking-[0.25em] text-gray-400 uppercase">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
  }
}

export default function ArticleView({ article }: { article: Article }) {
  const lang = useLanguage();
  const title = lang === "en" ? (article.title_en ?? article.title) : article.title;
  const blocks = lang === "en" && article.blocks_en ? article.blocks_en : article.blocks;

  return (
    <div className="bg-white">
      <main className="mx-auto max-w-232.5 px-6 py-20">
        <article>
          <h1 className="mb-12 text-[clamp(2.8rem,5vw,4.5rem)] leading-tight font-medium tracking-tight text-black">
            {title}
          </h1>

          <div className="mb-14 border-y border-gray-200 py-5">
            <p className="text-[10px] font-bold tracking-[0.12em] text-black uppercase">
              {article.dateDisplay}
            </p>
          </div>

          {blocks.map((block, idx) =>
            renderBlock(block, idx, t("news_detail_work_details", lang))
          )}

          <div className="mt-12 border-t border-gray-200 pt-8">
            <div className="flex gap-3">
              <button
                aria-label={t("news_detail_share", lang)}
                className="flex h-8 w-8 items-center justify-center border border-gray-300 text-sm text-gray-500"
              >
                ↗
              </button>
              <button
                aria-label={t("news_detail_bookmark", lang)}
                className="flex h-8 w-8 items-center justify-center border border-gray-300 text-sm text-gray-500"
              >
                🔖
              </button>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
