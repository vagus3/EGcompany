import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getPortal, portals } from "@/lib/portal-data";

export function generateStaticParams() {
  return portals.filter((portal) => !portal.isSecurity).map((portal) => ({ dept: portal.slug }));
}

interface PageProps {
  params: Promise<{ dept: string }>;
}

const localImages = {
  office: "/eg_png/egcompany_picture/main.png",
  building: "/eg_png/egcompany_picture/News/01.png",
  logistics: "/eg_png/egcompany_picture/News/04.png",
  fiscal: "/eg_png/egcompany_picture/News/03.png",
  research: "/eg_png/egcompany_picture/P/P03_cube.png",
  portraitA: "/eg_png/egcompany_picture/card/card_a.png",
  portraitB: "/eg_png/egcompany_picture/card/card_b.png",
  portraitS: "/eg_png/egcompany_picture/card/card_s.png",
  hq: "/eg_png/egcompany_picture/Company%20Information.png",
};

export default async function Page({ params }: PageProps) {
  const { dept } = await params;
  const portal = getPortal(dept);

  if (!portal) notFound();
  if (portal.isSecurity) redirect("/portals/security/terminal");

  return (
    <main className="min-h-screen bg-[#f9f9f9] text-black">
      <CorporateNav portalSlug={portal.slug} />
      {portal.slug === "hr" && <HumanPage />}
      {portal.slug === "finance" && <FiscalPage />}
      {portal.slug === "research" && <StrategicPage />}
      {portal.slug === "transport" && <LogisticsPage />}
      <CorporateFooter />
    </main>
  );
}

function CorporateNav({ portalSlug }: { portalSlug: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-[1920px] items-center justify-between px-5 sm:px-12">
        <Link href="/" className="text-xl font-bold tracking-[-0.05em] uppercase">
          Corporate Ops
        </Link>
        <nav className="hidden items-center gap-8 text-xs font-semibold tracking-[-0.025em] text-neutral-500 uppercase md:flex">
          <Link href="/about">About Us</Link>
          <Link href="/information">Services</Link>
          <Link href="/news">News</Link>
          <Link href="/contact" className="border-b border-black pb-1 text-black">
            Contact
          </Link>
        </nav>
        <Link
          href={`/portals/${portalSlug}`}
          className="bg-black px-5 py-3 text-xs font-semibold tracking-[-0.025em] text-neutral-200 uppercase"
        >
          Client Portal
        </Link>
      </div>
    </header>
  );
}

function FiscalPage() {
  return (
    <div className="mx-auto max-w-[1920px] px-5 py-20 sm:px-12 sm:py-24">
      <EditorialHero
        eyebrow="EG Company Internal Structuring"
        title="Fiscal Control"
        body="The authoritative center for corporate financial governance, strategic resource allocation, and rigorous operational auditing."
        large
      />

      <TwoColumn className="mt-28">
        <AsideCard
          title="Department Liaison"
          blocks={[
            ["Executive Tower, North Wing", "Level 42, Suite 4200\nFinancial District"],
            ["fiscal.control@egcompany.com", "+1 (800) 555-0199 ext. 402"],
          ]}
          directive="Q4 focuses on maximizing asset liquidity while finalizing the annual internal audit sweep."
        />
        <section>
          <SectionTitle>Core Objectives</SectionTitle>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            <ObjectiveCard
              title="Financial Auditing"
              body="Execution of rigorous, impartial internal reviews. We ensure absolute compliance with global regulatory standards, identifying operational inefficiencies before they impact the ledger."
            />
            <ObjectiveCard
              title="Resource Allocation"
              body="Strategic distribution of capital across divisions. Predictive analytics deploy funds where they generate maximal long-term institutional value."
            />
            <ObjectiveCard
              title="Risk Management"
              body="Proactive identification, assessment, and mitigation of systemic financial vulnerabilities. Complex stress-test models safeguard EG Company assets against market volatility."
              wide
            />
          </div>
        </section>
      </TwoColumn>

      <SplitSection
        title="Quarterly Financial Insights"
        body="Quarterly financial insights track revenue movement, temporal governance, and the standards that keep management decisions auditable."
        image={localImages.fiscal}
      />

      <TwoColumn>
        <SectionIntro
          title="Compliance & Governance"
          body="Regulatory standards ensure continuity and promote consistent financial practices across jurisdictions."
        />
        <div className="grid gap-x-12 gap-y-12 md:grid-cols-2">
          {[
            "Sarbanes-Oxley (SOX) Compliance",
            "Data Privacy (GDPR/CCPA) Framework",
            "Global Anti-Bribery & Corruption Policies",
            "Internal Control (COSO) Framework",
          ].map((item) => (
            <MiniItem key={item} title={item} body={`${item} standards are monitored through internal controls and quarterly governance checks.`} />
          ))}
        </div>
      </TwoColumn>

      <PeopleSection
        title="Lead Partners"
        people={[
          ["Eleanor Vance", "Chief Compliance Officer", localImages.portraitS],
          ["David Chen", "Head of Auditing", localImages.portraitB],
          ["Maria Rodriguez", "Director of Financial Strategy", localImages.portraitA],
        ]}
      />

      <ImageBand image={localImages.office} />
    </div>
  );
}

function LogisticsPage() {
  return (
    <div className="mx-auto max-w-[1920px] px-5 py-20 sm:px-12 sm:py-24">
      <EditorialHero
        eyebrow="Department Profile"
        title="Logistics & Mobility"
        body="Engineering the arteries of global commerce. We provide strategic oversight and operational excellence in transport architecture, ensuring frictionless movement across international supply chains."
        divider
      />
      <FeatureImage image={localImages.logistics} className="mt-20" />

      <TwoColumn className="mt-24" leftNarrow>
        <AsideCard
          title="Department Directory"
          blocks={[
            ["Global Headquarters", "400 Financial District Blvd.\nSuite 8400\nNew York, NY 10005"],
            ["Operations Desk", "+1 (800) 555-0199\nlogistics@eg-company.com"],
          ]}
          button="Contact Transport Team"
        />
        <section>
          <SectionTitle>Strategic Imperatives</SectionTitle>
          <NumberedList
            items={[
              ["Global Supply Chain Resilience", "Architecting supply networks capable of withstanding geopolitical volatility and macro-economic shocks with redundant routing algorithms."],
              ["Autonomous Fleet Management", "Transitioning legacy logistical assets to predictive, automated systems with telemetry-led optimization and real-time re-routing."],
              ["Rapid Response Logistics", "Deploying targeted mobility assets for high-value extraction, emergency resupply, and immediate personnel movement."],
            ]}
          />
          <MetricSection
            title="Global Supply Chain Metrics"
            metrics={[
              ["99.9%", "On-Time Delivery", "Large scale delivery and route reliability across active corridors."],
              ["45+", "Countries Served", "Multi-country network operations and customs coverage."],
              ["1.2M", "Annual Shipments", "Annual shipments across commercial and protected transport channels."],
            ]}
          />
          <ListSection
            title="Sustainability & Innovation"
            subtitle="Green Fleet Initiatives"
            items={["Electric Vehicle Integration", "Carbon Reduction Targets"]}
          />
          <StoryGrid
            title="Client Success Stories"
            stories={[
              ["Major Retailer: Optimized Distribution", "Regional distribution routes were consolidated and stabilized through corridor analysis."],
              ["Pharma Corp: Cold Chain Solutions", "Temperature-sensitive shipments were protected through route assurance and timed logistics."],
              ["Automotive Giant: Just-In-Time Logistics", "Critical part movement was synchronized to reduce idle time and line disruption."],
            ]}
          />
        </section>
      </TwoColumn>
    </div>
  );
}

function HumanPage() {
  return (
    <div>
      <section className="mx-auto grid max-w-[1920px] gap-12 px-5 py-20 sm:px-24 sm:py-28 lg:grid-cols-[544px_1fr] lg:items-start">
        <EditorialHero
          eyebrow="Departments > Operations"
          title="Human Resources."
          body="We engineer the organizational architecture that sustains elite performance. Our focus is on precision talent acquisition, uncompromising welfare standards, and structural development."
        />
        <FeatureImage image={localImages.office} className="lg:mt-0" />
      </section>

      <section className="bg-[#f3f3f3] px-5 py-24 sm:px-24 sm:py-32">
        <div className="mx-auto max-w-[1920px]">
          <SectionTitle>Strategic Directives</SectionTitle>
          <div className="mt-16 grid gap-12 md:grid-cols-3">
            <ObjectiveCard title="Talent Acquisition" body="Identifying and securing top-tier professionals capable of executing complex strategies in high-stakes environments." />
            <ObjectiveCard title="Employee Welfare" body="Maintaining rigorous standards for physical and psychological safety, ensuring sustained operational readiness across all divisions." />
            <ObjectiveCard title="Organizational Dev" body="Structuring hierarchy and communication flows to eliminate friction and maximize cross-departmental efficiency." />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1920px] gap-16 border-t border-black/10 bg-white px-5 py-24 sm:px-24 sm:py-32 lg:grid-cols-2 lg:items-center">
        <FeatureImage image={localImages.building} tall />
        <SectionIntro
          title="Company Culture & Values"
          body="Collaboration and team-oriented community are central to our operating model. We provide standards that enable development, mentorship, sustained energy, and broad experience."
        />
      </section>

      <section className="mx-auto max-w-[1920px] px-5 py-24 sm:px-24 sm:py-32">
        <SectionTitle>Career Development</SectionTitle>
        <div className="mt-20 grid gap-8 md:grid-cols-4">
          {["Junior Analyst", "Senior Strategist", "Team Lead", "Director"].map((role) => (
            <MiniItem key={role} title={role} body={`${role} path with structured learning, mentorship, and progressive responsibility.`} borderTop />
          ))}
        </div>
      </section>

      <section className="bg-[#f3f3f3] px-5 py-24 sm:px-24 sm:py-32">
        <div className="mx-auto max-w-[1920px]">
          <SectionTitle>Employee Experience</SectionTitle>
          <div className="mt-12 grid gap-12 md:grid-cols-2">
            <Testimonial name="Sarah Chen" role="Senior Manager" image={localImages.portraitS} />
            <Testimonial name="Mark Davis" role="Lead Engineer" image={localImages.portraitB} />
          </div>
        </div>
      </section>

      <ContactBlock
        title="Get in Touch."
        rows={[
          ["Global Headquarters", "100 Strategic Plaza, Floor 44\nFinancial District, NY 10005"],
          ["Direct Inquiries", "hr.ops@egcompany.com\n+1 (555) 019-2834"],
        ]}
      />
    </div>
  );
}

function StrategicPage() {
  return (
    <div className="mx-auto max-w-[1920px]">
      <section className="px-5 py-24 sm:px-12 sm:py-32">
        <EditorialHero
          eyebrow="EG Company / Departments"
          title="Strategic Intelligence"
          body="Operating at the vanguard of informational architecture. The Research Department synthesizes complex global data streams into actionable operational directives, ensuring EG Company maintains decisive informational superiority."
        />
      </section>

      <section className="bg-[#f3f3f3] px-5 py-24 sm:px-12 sm:py-32">
        <TwoColumn>
          <SectionTitle>Core Vectors</SectionTitle>
          <div className="grid gap-8 md:grid-cols-2">
            <ObjectiveCard title="Global Market Analysis" body="Continuous monitoring of macroeconomic indicators and geopolitical shifts to construct predictive models of emerging opportunities." />
            <ObjectiveCard title="Experimental Technology" body="Evaluation and incubation of nascent technological frameworks before widespread market adoption." />
            <ObjectiveCard title="Intelligence Synthesis" body="Translation of disparate, unstructured data sets into coherent operational intelligence for executive-level execution." wide />
          </div>
        </TwoColumn>
      </section>

      <TwoColumn className="px-5 py-24 sm:px-12 sm:py-32">
        <SectionTitle>Recent Intelligence Reports</SectionTitle>
        <div className="grid gap-8 md:grid-cols-3">
          {["Q3 Global Economic Shifts", "Emerging AI Architectures", "Supply Chain Vulnerability Assessment"].map((title, index) => (
            <ReportCard key={title} date={["08.15.2024", "08.22.2024", "08.05.2024"][index]} title={title} />
          ))}
        </div>
      </TwoColumn>

      <section className="bg-[#f3f3f3] px-5 py-24 sm:px-12 sm:py-32">
        <TwoColumn>
          <SectionTitle>Global Presence</SectionTitle>
          <div className="grid gap-12 md:grid-cols-[1fr_260px] md:items-center">
            <div className="relative aspect-square max-w-xl bg-[radial-gradient(circle_at_center,transparent_0_35%,rgba(0,0,0,0.08)_36%,transparent_37%),repeating-linear-gradient(0deg,rgba(0,0,0,0.12)_0_1px,transparent_1px_24px),repeating-linear-gradient(90deg,rgba(0,0,0,0.12)_0_1px,transparent_1px_24px)] opacity-60" />
            <ul className="space-y-5 text-lg">
              {["New York", "London", "Singapore", "Tokyo"].map((city) => (
                <li key={city} className="flex items-center gap-4">
                  <span className="h-2 w-2 rounded-full bg-black" />
                  {city}
                </li>
              ))}
            </ul>
          </div>
        </TwoColumn>
      </section>

      <PeopleSection
        title="Advisory Board"
        people={[
          ["Dr. Anya Sharma", "Geopolitical Strategy", localImages.portraitS],
          ["Marcus Chen", "Advanced Technology & Innovation", localImages.portraitB],
          ["Elena Petrova", "Cyber Intelligence Defense", localImages.portraitA],
        ]}
      />

      <TwoColumn className="px-5 py-24 sm:px-12 sm:py-32">
        <SectionTitle>Direct Access</SectionTitle>
        <div className="grid gap-12 md:grid-cols-2">
          <ContactPanel title="Dr. Aris Thorne" eyebrow="Director of Intelligence" body="Executive Oversight & Strategy" email="A.THORNE@EGCOMPANY.COM" />
          <ContactPanel title="Operations Desk" eyebrow="Secure Communications" body="General Inquiries & Data Requests" email="INTEL.OPS@EGCOMPANY.COM" />
        </div>
      </TwoColumn>
      <div className="px-5 pb-32 sm:px-12">
        <ImageBand image={localImages.hq} />
      </div>
    </div>
  );
}

function EditorialHero({
  eyebrow,
  title,
  body,
  large = false,
  divider = false,
}: {
  eyebrow: string;
  title: string;
  body: string;
  large?: boolean;
  divider?: boolean;
}) {
  return (
    <section className="max-w-5xl">
      <p className="flex items-center gap-3 text-xs font-semibold tracking-[0.05em] text-neutral-600 uppercase">
        {divider && <span className="h-px w-8 bg-black" />}
        {eyebrow}
      </p>
      <h1
        className={`mt-6 max-w-5xl font-semibold leading-none tracking-[-0.025em] ${
          large ? "text-[clamp(4rem,8vw,6rem)]" : "text-[clamp(3.4rem,7vw,4.5rem)]"
        }`}
      >
        {title}
      </h1>
      <p className="mt-8 max-w-3xl text-xl leading-8 text-neutral-600 sm:text-2xl">{body}</p>
    </section>
  );
}

function TwoColumn({
  children,
  className = "",
  leftNarrow = false,
}: {
  children: React.ReactNode;
  className?: string;
  leftNarrow?: boolean;
}) {
  return (
    <div
      className={`grid gap-16 lg:gap-24 ${
        leftNarrow ? "lg:grid-cols-[260px_1fr]" : "lg:grid-cols-[minmax(220px,0.34fr)_1fr]"
      } ${className}`}
    >
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">{children}</h2>;
}

function SectionIntro({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <SectionTitle>{title}</SectionTitle>
      <p className="mt-6 max-w-xl text-base leading-7 text-neutral-600 sm:text-lg">{body}</p>
    </div>
  );
}

function ObjectiveCard({ title, body, wide = false }: { title: string; body: string; wide?: boolean }) {
  return (
    <article className={`bg-white p-10 sm:p-14 ${wide ? "md:col-span-2" : ""}`}>
      <div className="mb-8 h-8 w-8 border-l-2 border-t-2 border-black/45" />
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-4 text-base leading-7 text-neutral-600">{body}</p>
    </article>
  );
}

function AsideCard({
  title,
  blocks,
  directive,
  button,
}: {
  title: string;
  blocks: [string, string][];
  directive?: string;
  button?: string;
}) {
  return (
    <aside className="self-start bg-white p-8">
      <h3 className="text-lg font-bold tracking-[-0.025em]">{title}</h3>
      <div className="mt-8 space-y-7">
        {blocks.map(([label, value]) => (
          <div key={label}>
            <p className="text-xs font-semibold tracking-[0.1em] uppercase">{label}</p>
            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-neutral-600">{value}</p>
          </div>
        ))}
      </div>
      {directive && (
        <div className="mt-10 border-l-2 border-black/20 pl-6">
          <p className="text-xs tracking-[0.1em] text-neutral-500 uppercase">Current Directive</p>
          <p className="mt-3 text-sm leading-6 text-neutral-600">{directive}</p>
        </div>
      )}
      {button && <button className="mt-8 w-full bg-black px-5 py-4 text-sm font-semibold text-white">{button}</button>}
    </aside>
  );
}

function FeatureImage({ image, className = "", tall = false }: { image: string; className?: string; tall?: boolean }) {
  return (
    <div className={`overflow-hidden bg-[#f3f3f3] ${tall ? "aspect-[4/5]" : "aspect-[16/7]"} ${className}`}>
      <img src={image} alt="" className="h-full w-full object-cover grayscale" />
    </div>
  );
}

function SplitSection({ title, body, image }: { title: string; body: string; image: string }) {
  return (
    <TwoColumn className="mt-32 items-center">
      <SectionIntro title={title} body={body} />
      <FeatureImage image={image} className="aspect-square" />
    </TwoColumn>
  );
}

function MiniItem({ title, body, borderTop = false }: { title: string; body: string; borderTop?: boolean }) {
  return (
    <article className={borderTop ? "border-t border-black/20 pt-6" : ""}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-neutral-600">{body}</p>
    </article>
  );
}

function NumberedList({ items }: { items: [string, string][] }) {
  return (
    <div className="mt-14 space-y-16">
      {items.map(([title, body], index) => (
        <div key={title} className="grid gap-6 sm:grid-cols-[70px_1fr]">
          <p className="text-5xl font-black tracking-[-0.05em] text-neutral-200">{String(index + 1).padStart(2, "0")}</p>
          <div>
            <h3 className="text-2xl font-bold">{title}</h3>
            <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-600">{body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function MetricSection({ title, metrics }: { title: string; metrics: [string, string, string][] }) {
  return (
    <section className="mt-24 border-t border-black/10 pt-10">
      <SectionTitle>{title}</SectionTitle>
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {metrics.map(([value, label, body]) => (
          <div key={label}>
            <p className="text-5xl font-bold tracking-[-0.05em]">{value}</p>
            <h3 className="mt-4 text-lg font-bold">{label}</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ListSection({ title, subtitle, items }: { title: string; subtitle: string; items: string[] }) {
  return (
    <section className="mt-24 border-t border-black/10 pt-10">
      <SectionTitle>{title}</SectionTitle>
      <h3 className="mt-10 text-xl font-bold">{subtitle}</h3>
      <ul className="mt-6 space-y-5">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-6 text-neutral-600">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
            <span>
              <strong className="text-black">{item}</strong>
              <br />
              {item} is managed through measurable targets and operational review.
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function StoryGrid({ title, stories }: { title: string; stories: [string, string][] }) {
  return (
    <section className="mt-24 border-t border-black/10 pt-10">
      <SectionTitle>{title}</SectionTitle>
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {stories.map(([storyTitle, body]) => (
          <MiniItem key={storyTitle} title={storyTitle} body={body} />
        ))}
      </div>
    </section>
  );
}

function PeopleSection({ title, people }: { title: string; people: [string, string, string][] }) {
  return (
    <section className="mx-auto max-w-[1920px] px-5 py-24 sm:px-12 sm:py-32">
      <SectionTitle>{title}</SectionTitle>
      <div className="mt-12 grid gap-12 md:grid-cols-3">
        {people.map(([name, role, image]) => (
          <article key={name}>
            <div className="h-24 w-24 overflow-hidden rounded-xl bg-neutral-200 md:h-48 md:w-48">
              <img src={image} alt={name} className="h-full w-full object-cover grayscale" />
            </div>
            <h3 className="mt-6 text-lg font-semibold">{name}</h3>
            <p className="mt-1 text-sm leading-5 text-neutral-600">{role}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Testimonial({ name, role, image }: { name: string; role: string; image: string }) {
  return (
    <article className="grid overflow-hidden bg-white shadow-sm sm:grid-cols-[1fr_208px]">
      <div className="flex min-h-80 flex-col justify-between p-10">
        <p className="text-4xl leading-none">&#34;</p>
        <p className="mt-6 text-base leading-7 text-neutral-600">
          EG Company fosters a focused environment with clear growth opportunities and strong operational standards.
        </p>
        <div className="mt-8">
          <h3 className="text-sm font-semibold">{name}</h3>
          <p className="text-xs text-neutral-600">{role}</p>
        </div>
      </div>
      <img src={image} alt={name} className="h-full min-h-80 w-full object-cover grayscale" />
    </article>
  );
}

function ContactBlock({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <section className="mx-auto grid max-w-[1920px] gap-12 px-5 py-24 sm:px-24 sm:py-32 lg:grid-cols-[360px_1fr]">
      <SectionTitle>{title}</SectionTitle>
      <div className="space-y-12">
        {rows.map(([label, value]) => (
          <div key={label}>
            <p className="text-xs tracking-[0.05em] uppercase">{label}</p>
            <p className="mt-3 whitespace-pre-line text-lg leading-8 text-neutral-600">{value}</p>
          </div>
        ))}
        <button className="bg-black px-8 py-4 text-sm tracking-[0.05em] text-white uppercase">Secure Transmission</button>
      </div>
    </section>
  );
}

function ReportCard({ date, title }: { date: string; title: string }) {
  return (
    <article className="border border-neutral-200 bg-white p-10">
      <p className="text-[10px] tracking-[0.1em] text-neutral-600 uppercase">{date}</p>
      <h3 className="mt-4 text-lg font-semibold leading-7">{title}</h3>
      <p className="mt-5 text-sm leading-6 text-neutral-600">
        Ongoing analysis package prepared for executive review and operational planning.
      </p>
    </article>
  );
}

function ContactPanel({ eyebrow, title, body, email }: { eyebrow: string; title: string; body: string; email: string }) {
  return (
    <article className="border-l-4 border-neutral-200 bg-[#f3f3f3] px-10 py-9">
      <p className="text-[10px] tracking-[0.1em] text-neutral-600 uppercase">{eyebrow}</p>
      <h3 className="mt-3 text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-base text-neutral-600">{body}</p>
      <p className="mt-8 inline-block border-b border-black/30 pb-1 text-xs tracking-[0.1em] uppercase">{email}</p>
    </article>
  );
}

function ImageBand({ image }: { image: string }) {
  return (
    <div className="h-[400px] overflow-hidden bg-[#f3f3f3]">
      <img src={image} alt="" className="h-full w-full object-cover grayscale opacity-90" />
    </div>
  );
}

function CorporateFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-[#fafafa] px-5 py-12 sm:px-12">
      <div className="mx-auto flex max-w-[1920px] flex-col gap-6 text-[10px] tracking-[0.1em] text-neutral-400 uppercase sm:flex-row sm:items-center sm:justify-between">
        <p>© 2024 Stratos Consulting Group. All rights reserved.</p>
        <div className="flex gap-6">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Cookie Settings</span>
        </div>
      </div>
    </footer>
  );
}
