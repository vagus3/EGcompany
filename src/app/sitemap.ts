import type { MetadataRoute } from "next";
import { articles } from "@/lib/news-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://egcompany.vercel.app";

const STATIC_PATHS = [
  "",
  "/about",
  "/contact",
  "/contact/report",
  "/department",
  "/HR",
  "/information",
  "/news",
  "/rules",
  "/login",
  "/signup",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries = STATIC_PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
  }));

  const newsEntries = articles.map((article) => ({
    url: `${SITE_URL}/news/${article.slug}`,
    lastModified: now,
  }));

  return [...staticEntries, ...newsEntries];
}
