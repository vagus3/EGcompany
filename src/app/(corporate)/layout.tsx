import CorporateShell from "@/components/layout/CorporateShell";

export default function CorporateLayout({ children }: { children: React.ReactNode }) {
  return <CorporateShell>{children}</CorporateShell>;
}
