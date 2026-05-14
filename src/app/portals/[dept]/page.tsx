import { notFound } from "next/navigation";
import { portals, getPortal } from "@/lib/portal-data";
import PortalClient from "./PortalClient";

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

  return <PortalClient portal={portal} />;
}
