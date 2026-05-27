import type { ReactNode } from "react";
import {
  Building2,
  CircleDollarSign,
  FileText,
  Globe2,
  Mail,
  MapPin,
  Phone,
  Scale,
  Shield,
} from "lucide-react";

const objectives = [
  {
    title: "Financial Auditing",
    copy: "Execution of rigorous, impartial internal reviews. We ensure absolute compliance with global regulatory standards, identifying operational inefficiencies before they impact the ledger.",
    icon: Building2,
  },
  {
    title: "Resource Allocation",
    copy: "Strategic distribution of capital across divisions. Utilizing predictive analytics to deploy funds where they generate maximal long-term institutional value.",
    icon: CircleDollarSign,
  },
  {
    title: "Risk Management",
    copy: "Proactive identification, assessment, and mitigation of systemic financial vulnerabilities. We design complex stress-test models to safeguard EG Company assets against market volatility and external economic friction.",
    icon: Shield,
    wide: true,
  },
];

const complianceItems = [
  {
    title: "Sarbanes-Oxley (SOX) Compliance",
    copy: "Sarbanes-Oxley (SOX) Compliance standardizes computing external regulatory standards.",
    icon: FileText,
  },
  {
    title: "Data Privacy (GDPR/CCPA) Framework",
    copy: "Data Privacy (GDPR/CCPA) framework authorization, personal information access and data Privacy framework.",
    icon: Shield,
  },
  {
    title: "Global Anti-Bribery & Corruption Policies",
    copy: "Global Anti-Bribery & Corruption Policies, manages count to Global Anti-Bribery & Corruption Policies.",
    icon: Globe2,
  },
  {
    title: "Internal Control (COSO) Framework",
    copy: "Internal Control (COSO) Framework and mitigation ensures for internal Control COSO standards.",
    icon: Scale,
  },
];

const partners = [
  {
    name: "Eleanor Vance",
    role: "CHIEF COMPLIANCE OFFICER",
    copy: "Eleanor Vance is officer and compliance officer with out the name of compliance officer.",
  },
  {
    name: "David Chen",
    role: "HEAD OF AUDITING",
    copy: "David Chen is a of auditing, and professional accessional mental authentists ceural staff.",
  },
  {
    name: "Maria Rodriguez",
    role: "DIRECTOR OF FINANCIAL STRATEGY",
    copy: "Maria Rodriguez is a lorl strategy or meeting the director of financial strategy strunuats.",
  },
];

const bars = [66, 45, 57, 78, 67, 48, 58, 72, 58, 73, 36, 43, 50, 63];

export default function Page() {
  return (
    <div className="d2-fiscal-page min-h-screen bg-[#f4f4f4] text-[#000]">
      <D2Header />
      <main>
        <section className="mx-auto max-w-[1170px] px-8 pt-24 pb-28">
          <p className="text-[10px] tracking-[0.18em] uppercase">EG Company Internal Structuring</p>
          <h1 className="mt-7 text-[clamp(4rem,8vw,6.7rem)] leading-[0.86] font-black tracking-normal">
            Fiscal Control
          </h1>
          <p className="mt-10 max-w-[700px] text-[21px] leading-[1.35] font-light tracking-[0.02em] text-neutral-700">
            The authoritative center for corporate financial governance, strategic resource
            allocation, and rigorous operational auditing.
          </p>
        </section>

        <section className="mx-auto grid max-w-[1170px] gap-24 px-8 pb-32 lg:grid-cols-[300px_1fr]">
          <aside className="space-y-16">
            <div className="bg-[#ededed] p-9">
              <h2 className="mb-8 text-[15px] font-bold">Department Liaison</h2>
              <div className="space-y-5 text-[11px] text-neutral-700">
                <ContactLine icon={MapPin}>
                  <strong className="block text-[#000]">Executive Tower, North Wing</strong>
                  <span className="block pl-0 text-neutral-500">Level 42, Suite 4200</span>
                  <span className="block text-neutral-500">Financial District</span>
                </ContactLine>
                <ContactLine icon={Mail}>fiscal.control@egcompany.com</ContactLine>
                <ContactLine icon={Phone}>+1 (800) 555-6738 ext. 402</ContactLine>
              </div>
            </div>

            <div className="border-l border-neutral-300 pl-6">
              <p className="text-[10px] tracking-[0.24em] text-neutral-500 uppercase">
                Current Directive
              </p>
              <p className="mt-4 max-w-[210px] text-[11px] leading-5 text-neutral-600">
                Q4 focuses on maximizing asset liquidity, while finalizing the annual internal
                audit sweep.
              </p>
            </div>
          </aside>

          <div>
            <h2 className="mb-12 text-[28px] leading-none font-bold">Core Objectives</h2>
            <div className="grid gap-5 md:grid-cols-2">
              {objectives.map((item) => (
                <article
                  key={item.title}
                  className={`bg-[#fff] p-10 ${item.wide ? "md:col-span-2" : ""}`}
                >
                  <item.icon className="mb-8 h-6 w-6 stroke-[2.2]" aria-hidden="true" />
                  <h3 className="mb-5 text-[16px] font-bold">{item.title}</h3>
                  <p className="max-w-[610px] text-[12px] leading-6 text-neutral-600">{item.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1170px] items-center gap-24 px-8 pb-32 lg:grid-cols-[300px_1fr]">
          <div>
            <h2 className="text-[28px] leading-[1.05] font-bold">
              Quarterly Financial
              <br />
              Insights
            </h2>
            <p className="mt-8 max-w-[230px] text-[12px] leading-6 text-neutral-600">
              Quarterly financial insights to revenue its across temporal governance, and
              moderning personity and standard management.
            </p>
          </div>
          <FinancialChart />
        </section>

        <section className="mx-auto grid max-w-[1170px] gap-24 px-8 pb-36 lg:grid-cols-[300px_1fr]">
          <div>
            <h2 className="text-[28px] leading-[1.05] font-bold">
              Compliance &
              <br />
              Governance
            </h2>
            <p className="mt-8 max-w-[240px] text-[12px] leading-6 text-neutral-600">
              Regulatory standards are ensure continuity to promote regulatory standards and mixed
              practices financial and regulatory standards.
            </p>
          </div>
          <div className="grid gap-x-20 gap-y-20 md:grid-cols-2">
            {complianceItems.map((item) => (
              <article key={item.title}>
                <div className="flex items-start gap-3">
                  <item.icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <h3 className="text-[14px] leading-tight font-bold">{item.title}</h3>
                </div>
                <p className="mt-5 text-[11px] leading-5 text-neutral-600">{item.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1170px] px-8 pb-36">
          <h2 className="mb-14 text-[28px] font-bold">Lead Partners</h2>
          <div className="grid gap-16 md:grid-cols-3">
            {partners.map((partner, index) => (
              <article key={partner.name}>
                <Portrait index={index} />
                <h3 className="mt-7 text-[13px] font-bold">{partner.name}</h3>
                <p className="mt-1 text-[9px] tracking-[0.13em] text-neutral-500 uppercase">
                  {partner.role}
                </p>
                <p className="mt-4 max-w-[250px] text-[11px] leading-5 text-neutral-600">
                  {partner.copy}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1170px] px-8 pb-24">
          <OfficeView />
        </section>
      </main>
      <D2Footer />
    </div>
  );
}

function D2Header() {
  return (
    <header className="bg-[#fff]">
      <nav className="mx-auto grid h-[72px] max-w-[1280px] grid-cols-[1fr_auto_1fr] items-center px-12">
        <div className="text-[14px] font-black tracking-tight uppercase">Corporate Ops</div>
        <div className="hidden items-center gap-12 text-[9px] font-medium tracking-[0.08em] uppercase md:flex">
          <span>About Us</span>
          <span>Services</span>
          <span>News</span>
          <span>Contact</span>
        </div>
        <div className="justify-self-end text-[9px] font-black tracking-[0.08em] uppercase">
          Client Portal
        </div>
      </nav>
    </header>
  );
}

function ContactLine({
  icon: Icon,
  children,
}: {
  icon: typeof MapPin;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-4">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 fill-neutral-300 text-neutral-300" aria-hidden="true" />
      <div>{children}</div>
    </div>
  );
}

function FinancialChart() {
  return (
    <div className="relative aspect-square min-h-[420px] overflow-hidden bg-[#303030] text-white grayscale">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgb(255_255_255_/_0.12),transparent_42%),repeating-radial-gradient(circle_at_center,rgb(255_255_255_/_0.04)_0_1px,transparent_1px_10px)]" />
      <div className="relative z-10 flex h-full flex-col items-center px-16 pt-32 pb-24">
        <h3 className="text-center text-[28px] leading-[1.1] font-bold text-white">
          Quartely Finaaancial Insights
          <br />
          Safte work
        </h3>
        <div className="mt-7 text-[10px] text-white/70">Global Bank</div>
        <div className="mt-16 grid w-full max-w-[560px] grid-cols-[46px_1fr] items-end gap-4">
          <div className="flex h-[210px] flex-col justify-between text-[9px] text-white/65">
            <span>77.6%</span>
            <span>68.4%</span>
            <span>60.1%</span>
            <span>51.0%</span>
          </div>
          <div className="relative h-[210px] border-b border-white/20">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0_49px,rgb(255_255_255_/_0.12)_50px)]" />
            <div className="relative z-10 flex h-full items-end gap-4 px-2">
              {bars.map((height, index) => (
                <div key={index} className="flex flex-1 flex-col items-center gap-2">
                  <span className="w-full bg-white/55" style={{ height: `${height}%` }} />
                  <span className="text-[7px] text-white/70">{String.fromCharCode(65 + index)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Portrait({ index }: { index: number }) {
  const gradients = [
    "radial-gradient(circle at 50% 34%, #d5d5d5 0 18%, transparent 19%), radial-gradient(ellipse at 50% 73%, #cfcfcf 0 26%, transparent 27%), linear-gradient(135deg, #060606, #3b3b3b)",
    "radial-gradient(circle at 50% 32%, #bdbdbd 0 17%, transparent 18%), radial-gradient(ellipse at 50% 78%, #1f1f1f 0 28%, transparent 29%), linear-gradient(135deg, #111, #555)",
    "radial-gradient(circle at 50% 31%, #c7c7c7 0 17%, transparent 18%), radial-gradient(ellipse at 50% 78%, #2a2a2a 0 30%, transparent 31%), linear-gradient(135deg, #4a4a4a, #111)",
  ];

  return (
    <div
      className="h-[62px] w-[92px] rounded-[8px] bg-neutral-800 grayscale"
      style={{ backgroundImage: gradients[index] }}
    />
  );
}

function OfficeView() {
  return (
    <div className="h-[350px] overflow-hidden bg-[#d8d8d8]" aria-label="Image placeholder" />
  );
}

function D2Footer() {
  return (
    <footer className="border-t border-neutral-300 bg-[#f4f4f4]">
      <div className="mx-auto flex max-w-[1170px] flex-col gap-5 px-8 py-14 text-[9px] tracking-[0.16em] text-neutral-500 uppercase sm:flex-row sm:items-center sm:justify-between">
        <p>© 2024 Fiscal Ops Consulting Group. All Rights Reserved.</p>
        <div className="flex gap-10">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Cookie Settings</span>
        </div>
      </div>
    </footer>
  );
}
