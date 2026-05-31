export interface PortalConfig {
  slug: string;
  name: string;
  category: string;
  nodeId: string;
  sessionLabel: string;
  clearanceLabel: string;
  // CSS classes applied to the full-screen background wrapper
  bgStyle: string;
  // Security portal has a unique layout (no card, pure black, extra codes)
  isSecurity?: boolean;
  // Cryptic codes shown under the input (security only)
  codes?: string[];
  detail?: PortalDetailConfig;
}

export interface PortalDetailConfig {
  displayName: string;
  title: string;
  subtitle: string;
  summary: string;
  imageSrc: string;
  imageAlt: string;
  accent: string;
  commandLabel: string;
  metrics: { value: string; label: string }[];
  systems: { label: string; value: string; status: string }[];
  operations: { title: string; body: string }[];
  logs: { time: string; message: string }[];
}

export const portals: PortalConfig[] = [
  {
    slug: "hr",
    name: "HR",
    category: "Human Resources",
    nodeId: "EG_HQ_HR_02",
    sessionLabel: "ENCRYPTED HR TERMINAL SESSION",
    clearanceLabel: "PERSONNEL RECORDS ACCESS REQUIRED",
    bgStyle:
      "bg-[radial-gradient(ellipse_at_top,#3a3a3a_0%,#1a1a1a_40%,#0d0d0d_100%)]",
    detail: {
      displayName: "Human",
      title: "Human",
      subtitle: "Personnel Continuity Office",
      summary:
        "HR maintains the internal personnel registry, clearance routing, welfare review, and executive staffing pipeline for every EG Company facility.",
      imageSrc: "/eg_png/egcompany_picture/card/card_s.png",
      imageAlt: "EG Company personnel access card",
      accent: "#e8e1d6",
      commandLabel: "PERSONNEL_MATRIX",
      metrics: [
        { value: "84K+", label: "active personnel" },
        { value: "312", label: "sealed reviews" },
        { value: "98.7%", label: "retention index" },
      ],
      systems: [
        { label: "Roster Index", value: "EG-HR-RST-02", status: "ONLINE" },
        { label: "Welfare Queue", value: "14 PENDING", status: "REVIEW" },
        { label: "Credential Sync", value: "06:00 KST", status: "LOCKED" },
      ],
      operations: [
        {
          title: "Personnel Verification",
          body: "Cross-checks employee credentials, attendance anomalies, and facility access histories before escalation.",
        },
        {
          title: "Internal Welfare",
          body: "Routes confidential employee support cases through a sealed review channel with department-level masking.",
        },
        {
          title: "Role Assignment",
          body: "Maintains staffing rules for sensitive teams and updates role movement windows across global sites.",
        },
      ],
      logs: [
        { time: "08:10", message: "Leadership review packet sealed" },
        { time: "10:40", message: "Facility transfer list reconciled" },
        { time: "14:25", message: "Welfare queue priority adjusted" },
      ],
    },
  },
  {
    slug: "finance",
    name: "FINANCE",
    category: "Fiscal Control",
    nodeId: "EG_HQ_FIN_02",
    sessionLabel: "ENCRYPTED FINANCE TERMINAL SESSION",
    clearanceLabel: "PERSONNEL RECORDS ACCESS REQUIRED",
    bgStyle:
      "bg-[radial-gradient(ellipse_at_center,#1a2030_0%,#0e1520_50%,#050810_100%)]",
    detail: {
      displayName: "Fiscal",
      title: "Fiscal",
      subtitle: "Capital Audit Division",
      summary:
        "Finance monitors capital movement, procurement gates, audit holds, and risk exposure across EG Company's high-value operating network.",
      imageSrc: "/eg_png/egcompany_picture/News/03.png",
      imageAlt: "EG Company financial analysis display",
      accent: "#d7e4ff",
      commandLabel: "CAPITAL_LEDGER",
      metrics: [
        { value: "$12B", label: "asset coverage" },
        { value: "41", label: "audit holds" },
        { value: "0.8%", label: "variance drift" },
      ],
      systems: [
        { label: "Capital Ledger", value: "EG-FIN-LED-02", status: "ONLINE" },
        { label: "Procurement Gate", value: "7 LOCKS", status: "ACTIVE" },
        { label: "Risk Model", value: "Q4-OMEGA", status: "SYNCED" },
      ],
      operations: [
        {
          title: "Internal Audit",
          body: "Evaluates transaction patterns, facility expense drift, and abnormal procurement signatures.",
        },
        {
          title: "Capital Allocation",
          body: "Prioritizes funding windows for transport, research, and site-hardening initiatives.",
        },
        {
          title: "Risk Containment",
          body: "Maintains controlled exposure thresholds for sensitive assets and regional operating budgets.",
        },
      ],
      logs: [
        { time: "07:30", message: "Ledger checksum completed" },
        { time: "11:15", message: "Procurement hold escalated" },
        { time: "16:05", message: "Regional variance report archived" },
      ],
    },
  },
  {
    slug: "research",
    name: "RESEARCH",
    category: "Strategic Intelligence",
    nodeId: "EG_HQ_RES_04",
    sessionLabel: "ENCRYPTED RESEARCH TERMINAL SESSION",
    clearanceLabel: "PERSONNEL RECORDS ACCESS REQUIRED",
    bgStyle:
      "bg-[radial-gradient(ellipse_at_bottom_right,#1a2220_0%,#0d1512_50%,#060a08_100%)]",
    detail: {
      displayName: "Strategic",
      title: "Strategic",
      subtitle: "Research Containment Wing",
      summary:
        "Research operates the classified analysis pipeline for anomalous data, prototype systems, and sealed intelligence briefs.",
      imageSrc: "/eg_png/egcompany_picture/P/P03_cube.png",
      imageAlt: "EG Company research cube artifact",
      accent: "#d9f5e8",
      commandLabel: "INTEL_ARCHIVE",
      metrics: [
        { value: "2.4B", label: "data points" },
        { value: "19", label: "sealed projects" },
        { value: "04", label: "containment labs" },
      ],
      systems: [
        { label: "Archive Core", value: "EG-RES-ARC-04", status: "ONLINE" },
        { label: "Prototype Chain", value: "P03", status: "SEALED" },
        { label: "Signal Review", value: "DELTA", status: "WATCH" },
      ],
      operations: [
        {
          title: "Signal Analysis",
          body: "Processes high-volume telemetry and flags deviations before they surface in operational channels.",
        },
        {
          title: "Prototype Review",
          body: "Maintains internal documentation and test constraints for sealed experimental systems.",
        },
        {
          title: "Intelligence Briefing",
          body: "Condenses field reports into executive-level briefs with redacted distribution chains.",
        },
      ],
      logs: [
        { time: "03:42", message: "P03 observation window closed" },
        { time: "09:55", message: "Delta signal packet quarantined" },
        { time: "18:20", message: "Executive brief staged for review" },
      ],
    },
  },
  {
    slug: "transport",
    name: "TRANSPORT",
    category: "Logistics & Mobility",
    nodeId: "EG_HQ_TRN_03",
    sessionLabel: "ENCRYPTED TRANSPORT TERMINAL SESSION",
    clearanceLabel: "PERSONNEL RECORDS ACCESS REQUIRED",
    bgStyle:
      "bg-[radial-gradient(ellipse_at_top_left,#252015_0%,#141008_50%,#080604_100%)]",
    detail: {
      displayName: "Logistics",
      title: "Logistics",
      subtitle: "Route Control Directorate",
      summary:
        "Transport coordinates protected route planning, regional facility movement, and high-value asset transfer across controlled corridors.",
      imageSrc: "/eg_png/egcompany_picture/News/04.png",
      imageAlt: "EG Company restricted logistics gate",
      accent: "#f1dfbd",
      commandLabel: "ROUTE_CONTROL",
      metrics: [
        { value: "142", label: "active sites" },
        { value: "37", label: "live corridors" },
        { value: "99.9%", label: "continuity" },
      ],
      systems: [
        { label: "Route Mesh", value: "EG-TRN-MSH-03", status: "ONLINE" },
        { label: "Asset Queue", value: "12 MOVES", status: "ACTIVE" },
        { label: "Delay Monitor", value: "< 4 MIN", status: "NOMINAL" },
      ],
      operations: [
        {
          title: "Protected Routing",
          body: "Calculates corridor changes and escort windows for high-value movements.",
        },
        {
          title: "Facility Transfer",
          body: "Synchronizes personnel, assets, and sealed documents between regional operating sites.",
        },
        {
          title: "Incident Dispatch",
          body: "Triggers contingency handling when a route crosses a restricted or unstable operating zone.",
        },
      ],
      logs: [
        { time: "06:05", message: "North corridor cleared" },
        { time: "13:30", message: "Asset transfer batch staged" },
        { time: "22:00", message: "Restricted movement window active" },
      ],
    },
  },
  {
    slug: "security",
    name: "SECURITY",
    category: "Asset Protection",
    nodeId: "",
    sessionLabel: "ENCRYPTED TERMINAL SESSION",
    clearanceLabel: "SECURITY LEVEL 5 CLEARANCE REQUIRED",
    bgStyle: "bg-black",
    isSecurity: true,
    codes: ["1-32", "2-10/12", "5-32", "7-29"],
  },
];

export function getPortal(slug: string): PortalConfig | undefined {
  return portals.find((p) => p.slug === slug);
}
