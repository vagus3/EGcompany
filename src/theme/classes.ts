type ClassValue = string | false | null | undefined;

export function cx(...classes: ClassValue[]) {
  return classes.filter(Boolean).join(" ");
}

export const corporateTheme = {
  page: "bg-corporate-bg text-corporate-text",
  surface: "bg-corporate-surface",
  surfaceMuted: "bg-corporate-surface-muted",
  surfaceSubtle: "bg-corporate-surface-subtle",
  border: "border-corporate-border",
  borderStrong: "border-corporate-border-strong",
  text: "text-corporate-text",
  textMuted: "text-corporate-text-muted",
  textSubtle: "text-corporate-text-subtle",
  linkMuted: "text-corporate-text-muted transition-colors hover:text-corporate-text",
  buttonPrimary:
    "bg-corporate-text text-corporate-bg transition-colors hover:bg-corporate-text-muted",
  input:
    "border-corporate-border bg-corporate-surface-muted text-corporate-text placeholder:text-corporate-text-subtle focus:border-corporate-border-strong focus:outline-none",
} as const;

export const terminalTheme = {
  page: "terminal-theme-lock bg-terminal-bg text-terminal-text",
  panel: "bg-terminal-panel",
  panelDeep: "bg-terminal-panel-deep",
  panelMuted: "bg-terminal-panel-muted",
  panelSoft: "bg-terminal-panel-soft",
  tile: "bg-terminal-tile text-terminal-text-dim transition-colors hover:bg-terminal-tile-hover hover:text-white",
  border: "border-terminal-border",
  borderWarm: "border-terminal-border-warm",
  borderAlert: "border-terminal-border-alert",
  textMuted: "text-terminal-text-muted",
  textDim: "text-terminal-text-dim",
  copy: "text-terminal-copy",
  copyStrong: "text-terminal-copy-strong",
  accent: "text-terminal-accent",
  accentBg: "bg-terminal-accent-strong",
  accentActiveBg: "bg-terminal-accent-active",
  accentSoftBg: "bg-terminal-accent-soft",
  accentText: "text-terminal-accent-text",
  accentMuted: "text-terminal-accent-muted",
  inverseButton: "bg-terminal-text text-terminal-bg",
} as const;
