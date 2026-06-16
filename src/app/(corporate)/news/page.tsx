"use client";

import Link from "next/link";
import Image from "next/image";
import { articles } from "@/lib/news-data";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/hooks/useLanguage";

export default function Page() {
  const lang = useLanguage();
  const featured = articles.find((a) => a.featured) ?? articles[0];
  const rest = articles.filter((a) => a.slug !== featured.slug);

  const featuredTitle = lang === "en" ? (featured.title_en ?? featured.title) : featured.title;
  const featuredExcerpt =
    lang === "en" ? (featured.excerpt_en ?? featured.excerpt) : featured.excerpt;

  return (
    <div className="bg-white">
      <section className="mx-auto max-w-5xl px-4 pt-14 pb-24 sm:px-6 md:pt-20">
        <p className="mb-5 text-[10px] tracking-[0.35em] text-gray-400 uppercase">
          {t("news_eyebrow", lang)}
        </p>

        <h1 className="mb-16 text-[clamp(2.4rem,4vw,3.6rem)] leading-tight font-medium tracking-tight text-black">
          {t("news_heading", lang)}
        </h1>

        {/* Featured Article */}
        <article className="mb-20">
          <Link href={`/news/${featured.slug}`} className="group block">
            <div className="relative mb-6 aspect-16/7 w-full overflow-hidden bg-gray-300">
              <Image
                src={featured.imageSrc}
                alt={featuredTitle}
                fill
                sizes="(min-width: 1024px) 1024px, 100vw"
                className="object-cover grayscale transition-opacity group-hover:opacity-90"
                priority
              />
            </div>
          </Link>

          <div className="mb-4 flex items-center gap-4">
            {featured.category && (
              <span className="bg-black px-3 py-1 text-[10px] font-bold tracking-[0.18em] text-white uppercase">
                {featured.category}
              </span>
            )}
            <span className="text-[10px] font-semibold tracking-[0.15em] text-gray-500 uppercase">
              {featured.dateDisplay}
            </span>
          </div>

          <Link href={`/news/${featured.slug}`} className="group">
            <h2 className="mb-5 text-2xl font-medium text-black underline-offset-2 group-hover:underline">
              {featuredTitle}
            </h2>
          </Link>

          {featuredExcerpt && (
            <p className="mb-8 max-w-3xl text-sm leading-7 text-gray-500">{featuredExcerpt}</p>
          )}

          <Link
            href={`/news/${featured.slug}`}
            className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-black uppercase transition-all hover:gap-3"
          >
            {t("news_read_full", lang)}
          </Link>
        </article>

        {/* Other Articles */}
        <div className="grid gap-x-14 gap-y-20 border-t border-gray-200 pt-14 sm:grid-cols-2">
          {rest.map((article) => {
            const articleTitle =
              lang === "en" ? (article.title_en ?? article.title) : article.title;
            return (
              <article key={article.slug}>
                <Link href={`/news/${article.slug}`} className="group block">
                  <div className="relative mb-5 aspect-video w-full overflow-hidden bg-gray-300">
                    <Image
                      src={article.imageSrc}
                      alt={articleTitle}
                      fill
                      sizes="(min-width: 640px) 480px, 100vw"
                      className="object-cover grayscale transition-opacity group-hover:opacity-90"
                    />
                  </div>
                  <p className="mb-5 text-[10px] font-semibold tracking-[0.15em] text-gray-500 uppercase">
                    {article.dateDisplay}
                  </p>
                  <h3 className="text-xl font-medium text-black underline-offset-2 group-hover:underline">
                    {articleTitle}
                  </h3>
                </Link>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
