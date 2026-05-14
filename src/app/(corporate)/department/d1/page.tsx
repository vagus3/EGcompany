import Link from "next/link";

type TechItem = {
  icon: IconName;
  title: string;
};

type IconName =
  | "building"
  | "badge"
  | "diamond"
  | "radar"
  | "camera"
  | "fingerprint"
  | "chip"
  | "lock"
  | "glonpmbe"
  | "pin";

type Directive = {
  title: string;
  description: string;
  label: string;
  icon: IconName;
  wide?: boolean;
};

type ContactInfoProps = {
  label: string;
  main: string;
  sub?: string;
  large?: boolean;
};

const directives: Directive[] = [
  {
    title: "Facility Integrity",
    description:
      "Comprehensive access control systems, 24/7 centralized monitoring, and systematic perimeter hardening to ensure the absolute sanctity of global corporate assets.",
    label: "DIRECTIVE ALPHA",
    icon: "building",
    wide: true,
  },
  {
    title: "Personnel Safety",
    description:
      "Executive protection details, travel risk mitigation, and continuous employee safety training protocols.",
    label: "DIRECTIVE BETA",
    icon: "badge",
  },
];

const threatItems: string[] = [
  "Cyber-physical Convergence",
  "Supply Chain Vulnerabilities",
  "Insider Threat Mitigation",
  "Geopolitical Risk Analysis",
];

const techStack: TechItem[] = [
  { icon: "camera", title: "Advanced Surveillance Systems" },
  { icon: "fingerprint", title: "Biometric Access Control" },
  { icon: "chip", title: "AI-Driven Anomaly Detection" },
  { icon: "lock", title: "Secure Communications Platforms" },
];

const responseUnits: string[] = [
  "North America: New York, London",
  "Europe: Berlin, Paris",
  "Asia-Pacific: Tokyo, Singapore",
  "Middle East: Dubai",
];

export default function Page() {
  return (
    <main className="min-h-screen bg-neutral-100 text-black">
      <Header />
      <Hero />
      <OperationalDirectives />
      <ContactSection />
      <Footer />
    </main>
  );
}

function Header() {
  return (
    <header className="h-[61px] border-b border-neutral-200 bg-neutral-50">
      <div className="mx-auto flex h-[60px] max-w-screen-2xl items-center justify-between px-12">
        <Link
          href="/"
          className="text-xl font-bold tracking-[-1px] text-neutral-900"
        >
          EG Company
        </Link>

        <nav className="flex items-center gap-12 text-sm font-medium tracking-[-0.35px] text-neutral-500">
          <Link href="/about">About Us</Link>
          <Link href="/rules">Rules</Link>
          <Link href="/news">News</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        <div className="flex items-center gap-6">
          <Link href="/login" className="text-xs font-medium text-neutral-500">
            Sign In
          </Link>
          <Link
            href="/register"
            className="rounded-sm bg-black px-4 py-1.5 text-xs font-bold text-white"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="bg-neutral-50 px-6 py-28">
      <div className="mx-auto w-full max-w-screen-2xl px-6">
        <div className="mb-10 flex items-center gap-4 text-[11px] font-bold uppercase leading-4 tracking-[1.65px] text-neutral-500">
          <span className="h-px w-8 bg-neutral-500" />
          Department of Security
        </div>

        <h1 className="max-w-[672px] text-[96px] font-black leading-none tracking-[-4.8px]">
          Asset
          <br />
          Protection.
        </h1>

        <p className="mt-10 max-w-[672px] text-xl font-medium leading-7 tracking-[-0.5px] text-neutral-500">
          Safeguarding human capital and physical infrastructure through rigorous
          protocol, continuous threat assessment, and immediate tactical response.
        </p>
      </div>
    </section>
  );
}

function OperationalDirectives() {
  return (
    <section className="bg-neutral-100 px-6 py-24">
      <div className="mx-auto w-full max-w-[1080px] px-6">
        <h2 className="mb-16 text-3xl font-black tracking-[-1.5px]">
          Operational Directives
        </h2>

        <div className="grid grid-cols-3 gap-6">
          {directives.map((directive) => (
            <DirectiveCard key={directive.title} directive={directive} />
          ))}

          <EmergencyCard />
          <ThreatLandscape />
          <TechnologyStack />
          <GlobalResponseUnits />
        </div>
      </div>
    </section>
  );
}

function DirectiveCard({ directive }: { directive: Directive }) {
  return (
    <article
      className={[
        "min-h-[330px] bg-white px-14 py-16",
        directive.wide ? "col-span-2" : "col-span-1",
      ].join(" ")}
    >
      <Icon name={directive.icon} />

      <h3 className="mt-8 mb-5 text-2xl font-black leading-7 tracking-[-1px]">
        {directive.title}
      </h3>

      <p className="max-w-[560px] text-base font-medium leading-7 tracking-[-0.4px] text-neutral-500">
        {directive.description}
      </p>

      <p className="mt-14 text-[10px] font-bold uppercase leading-[15px] tracking-[1px]">
        {directive.label}
      </p>
    </article>
  );
}

function EmergencyCard() {
  return (
    <article className="col-span-3 grid min-h-[290px] grid-cols-[1.4fr_0.75fr] items-center gap-16 bg-white px-14 py-14">
      <div>
        <Icon name="diamond" />

        <h3 className="mt-8 mb-5 text-2xl font-black leading-7 tracking-[-1px]">
          Emergency Resolution Protocols
        </h3>

        <p className="max-w-[620px] text-base font-medium leading-7 tracking-[-0.4px] text-neutral-500">
          Rapid-response escalation frameworks designed for immediate containment
          and neutralization of active threats, localized crises, or widespread
          systemic failures.
        </p>
      </div>

      <ServerImage />
    </article>
  );
}

function ThreatLandscape() {
  return (
    <article className="min-h-[370px] bg-white px-12 py-14">
      <Icon name="radar" />

      <h3 className="mt-8 mb-9 text-2xl font-black leading-7 tracking-[-1px]">
        Threat Landscape
      </h3>

      <ul className="space-y-4 text-center text-sm font-bold leading-5 tracking-[-0.35px]">
        {threatItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}

function TechnologyStack() {
  return (
    <article className="min-h-[370px] bg-white px-12 py-14">
      <h3 className="mb-10 text-2xl font-black leading-7 tracking-[-1px]">
        Technology Stack
      </h3>

      <div className="grid grid-cols-2 gap-x-10 gap-y-10">
        {techStack.map((item) => (
          <div key={item.title}>
            <Icon name={item.icon} small />
            <p className="mt-4 text-xs font-black leading-4 tracking-[-0.4px]">
              {item.title}
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}

function GlobalResponseUnits() {
  return (
    <article className="min-h-[370px] bg-white px-12 py-14">
      <Icon name="glonpmbe" />

      <h3 className="mt-8 mb-8 text-2xl font-black leading-7 tracking-[-1px]">
        Global Response
        <br />
        Units
      </h3>

      <ul className="space-y-6 text-xs font-black leading-5 tracking-[-0.4px]">
        {responseUnits.map((unit) => (
          <li key={unit} className="flex gap-3">
            <Icon name="pin" tiny />
            <span>{unit}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function ServerImage() {
  return (
    <div className="h-[150px] w-full max-w-[300px] justify-self-end overflow-hidden bg-neutral-300">
      <div className="grid h-full grid-cols-5 gap-px opacity-70">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="bg-[repeating-linear-gradient(0deg,#1f1f1f_0px,#1f1f1f_4px,#545454_5px,#252525_9px)]"
          />
        ))}
      </div>
    </div>
  );
}

function ContactSection() {
  return (
    <section className="bg-neutral-50 px-6 py-36">
      <div className="mx-auto grid w-full max-w-[1080px] grid-cols-2 gap-32 border-t border-neutral-300 px-6 pt-16">
        <div>
          <h2 className="mb-10 text-4xl font-black leading-10 tracking-[-1.8px]">
            Direct Line.
          </h2>

          <p className="mb-8 max-w-[370px] text-base font-medium leading-7 tracking-[-0.4px] text-neutral-500">
            For immediate security concerns or to schedule a comprehensive risk
            assessment, contact the global dispatch center.
          </p>

          <Link
            href="/contact"
            className="inline-flex bg-black px-9 py-5 text-[11px] font-bold uppercase leading-4 tracking-[1.65px] text-white"
          >
            Initiate Contact&nbsp;&nbsp;→
          </Link>
        </div>

        <div className="space-y-10">
          <ContactInfo
            label="Global Operations Center"
            main="+1 (800) 555-0199"
            sub="Available 24/7/365"
            large
          />
          <ContactInfo
            label="Internal Communications"
            main="security.dispatch@egcompany.corp"
          />
          <ContactInfo
            label="HQ Location"
            main={`100 Corporate Plaza
Tower C, Sub-Level 2
Metropolis, NY 10001`}
          />
        </div>
      </div>
    </section>
  );
}

function ContactInfo({ label, main, sub, large = false }: ContactInfoProps) {
  return (
    <div>
      <p className="mb-2 text-[10px] font-bold uppercase leading-[15px] tracking-[1px] text-neutral-500">
        {label}
      </p>

      <p
        className={[
          "whitespace-pre-line tracking-[-0.5px] text-black",
          large ? "text-2xl font-black leading-8" : "text-lg font-medium leading-7",
        ].join(" ")}
      >
        {main}
      </p>

      {sub && <p className="text-sm font-medium text-neutral-500">{sub}</p>}
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 py-12">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-12">
        <p className="text-[10px] uppercase leading-[15px] tracking-[1px] text-neutral-500">
          © 2026 EG Company. Corporate Headquarters.
        </p>

        <nav className="flex gap-8 text-[10px] uppercase leading-[15px] tracking-[1px] text-neutral-500">
          <Link href="/company">Company Information</Link>
          <Link href="/contact">Contact Us</Link>
        </nav>
      </div>
    </footer>
  );
}

function Icon({
  name,
  small = false,
  tiny = false,
}: {
  name: IconName;
  small?: boolean;
  tiny?: boolean;
}) {
  const size = tiny ? 13 : small ? 18 : 26;
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "shrink-0 text-neutral-300",
  };

  switch (name) {
    case "building":
      return (
        <svg {...common}>
          <path d="M4 21V7h8v14" />
          <path d="M12 11h8v10" />
          <path d="M7 10h2M7 14h2M7 18h2M15 14h2M15 18h2" />
        </svg>
      );
    case "badge":
      return (
        <svg {...common}>
          <path d="M9 4h6l1 4H8l1-4Z" />
          <path d="M5 8h14v12H5z" />
          <path d="M9 13h6M9 16h4" />
          <circle cx="12" cy="11" r="1" />
        </svg>
      );
    case "diamond":
      return (
        <svg {...common}>
          <path d="M12 3 21 12 12 21 3 12 12 3Z" />
          <path d="M12 8v5" />
          <path d="M12 16h.01" />
        </svg>
      );
    case "radar":
      return (
        <svg {...common}>
          <circle cx="12" cy="13" r="7" />
          <circle cx="12" cy="13" r="3" />
          <path d="M12 13V3" />
          <path d="M7 5a9 9 0 0 0 10 0" />
        </svg>
      );
    case "camera":
      return (
        <svg {...common}>
          <path d="M4 8h12v9H4z" />
          <path d="M16 11l4-2v7l-4-2" />
        </svg>
      );
    case "fingerprint":
      return (
        <svg {...common}>
          <path d="M7 12a5 5 0 0 1 10 0" />
          <path d="M9 12a3 3 0 0 1 6 0c0 4-2 5-2 8" />
          <path d="M7 16c1 1 2 2 2 4" />
          <path d="M12 12c0 3-1 4-1 8" />
          <path d="M5 9a8 8 0 0 1 14 0" />
        </svg>
      );
    case "chip":
      return (
        <svg {...common}>
          <rect x="7" y="7" width="10" height="10" rx="1" />
          <path d="M9 3v4M15 3v4M9 17v4M15 17v4M3 9h4M3 15h4M17 9h4M17 15h4" />
        </svg>
      );
    case "lock":
      return (
        <svg {...common}>
          <rect x="5" y="10" width="14" height="10" rx="1" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          <path d="M12 14v2" />
        </svg>
      );
    case "glonpmbe":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3a13 13 0 0 1 0 18" />
          <path d="M12 3a13 13 0 0 0 0 18" />
        </svg>
      );
    case "pin":
      return (
        <svg {...common}>
          <path d="M12 21s6-5.2 6-11a6 6 0 0 0-12 0c0 5.8 6 11 6 11Z" />
          <circle cx="12" cy="10" r="2" />
        </svg>
      );
  }
}