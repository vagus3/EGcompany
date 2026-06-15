import { notFound } from "next/navigation";
import { articles, getArticle } from "@/lib/news-data";
import ArticleView from "./ArticleView";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) notFound();

  return <ArticleView article={article} />;
}
