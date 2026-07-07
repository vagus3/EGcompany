import { HINT_PROMPT_COUNT_STORAGE_KEY } from "@/lib/employee-card";
import {
  PRETEXT_LETTER_POSITIONS_STORAGE_KEY,
  TERMINAL_PROGRESS_STORAGE_KEY,
} from "@/lib/terminal-data";

export function clearClientGameProgress() {
  window.localStorage.removeItem(TERMINAL_PROGRESS_STORAGE_KEY);
  window.localStorage.removeItem(HINT_PROMPT_COUNT_STORAGE_KEY);
  window.sessionStorage.removeItem(PRETEXT_LETTER_POSITIONS_STORAGE_KEY);
}