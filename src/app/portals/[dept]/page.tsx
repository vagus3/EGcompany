import { notFound, redirect } from "next/navigation";
import { portals, getPortal } from "@/lib/portal-data";

export function generateStaticParams() {
  return portals.map((p) => ({ dept: p.slug }));
}

interface PageProps {
  params: Promise<{ dept: string }>;
}

export default async function Page({ params }: PageProps) {
  const { dept } = await params;
  const portal = getPortal(dept);
  if (!portal) notFound();

  if (portal.isSecurity) redirect("/portals/security/terminal");
  redirect(`/portals/${portal.slug}/detail`);
}
