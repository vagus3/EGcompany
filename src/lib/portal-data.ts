export interface PortalConfig {
  slug: string;
  name: string;
  nodeId: string;
  sessionLabel: string;
  clearanceLabel: string;
  // CSS classes applied to the full-screen background wrapper
  bgStyle: string;
  // Security portal has a unique layout (no card, pure black, extra codes)
  isSecurity?: boolean;
  // Cryptic codes shown under the input (security only)
  codes?: string[];
}

export const portals: PortalConfig[] = [
  {
    slug: "hr",
    name: "HR",
    nodeId: "EG_HQ_HR_02",
    sessionLabel: "ENCRYPTED HR TERMINAL SESSION",
    clearanceLabel: "PERSONNEL RECORDS ACCESS REQUIRED",
    bgStyle:
      "bg-[radial-gradient(ellipse_at_top,#3a3a3a_0%,#1a1a1a_40%,#0d0d0d_100%)]",
  },
  {
    slug: "finance",
    name: "FINANCE",
    nodeId: "EG_HQ_FIN_02",
    sessionLabel: "ENCRYPTED FINANCE TERMINAL SESSION",
    clearanceLabel: "PERSONNEL RECORDS ACCESS REQUIRED",
    bgStyle:
      "bg-[radial-gradient(ellipse_at_center,#1a2030_0%,#0e1520_50%,#050810_100%)]",
  },
  {
    slug: "research",
    name: "RESEARCH",
    nodeId: "EG_HQ_RES_04",
    sessionLabel: "ENCRYPTED RESEARCH TERMINAL SESSION",
    clearanceLabel: "PERSONNEL RECORDS ACCESS REQUIRED",
    bgStyle:
      "bg-[radial-gradient(ellipse_at_bottom_right,#1a2220_0%,#0d1512_50%,#060a08_100%)]",
  },
  {
    slug: "transport",
    name: "TRANSPORT",
    nodeId: "EG_HQ_TRN_03",
    sessionLabel: "ENCRYPTED TRANSPORT TERMINAL SESSION",
    clearanceLabel: "PERSONNEL RECORDS ACCESS REQUIRED",
    bgStyle:
      "bg-[radial-gradient(ellipse_at_top_left,#252015_0%,#141008_50%,#080604_100%)]",
  },
  {
    slug: "security",
    name: "SECURITY",
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
