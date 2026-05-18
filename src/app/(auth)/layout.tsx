import CorporateShell from "@/components/layout/CorporateShell";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <CorporateShell>{children}</CorporateShell>;
}
