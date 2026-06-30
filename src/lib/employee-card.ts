export type EmployeeCardRank = "S" | "A" | "B";

export type EmployeeCardPayload = {
  email: string;
  employeeCode: string;
  hintPromptCount: number;
  name: string;
  rank: EmployeeCardRank;
};

export const HINT_PROMPT_COUNT_STORAGE_KEY = "eg-hint-prompt-count";
export const HINT_PROMPT_COUNT_COOKIE_NAME = "eg-hint-prompt-count";

export function getEmployeeCardRank(hintPromptCount: number): EmployeeCardRank {
  if (hintPromptCount <= 0) return "S";
  if (hintPromptCount <= 3) return "A";
  return "B";
}

export function normalizeHintPromptCount(value: unknown) {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return Math.floor(parsed);
}
