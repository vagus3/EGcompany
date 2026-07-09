import { adminTestPassedKey, adminTestRequiredKey } from "@/lib/admin-test";
import { HINT_PROMPT_COUNT_STORAGE_KEY } from "@/lib/employee-card";
import { PRETEXT_LETTER_POSITIONS_STORAGE_KEY } from "@/lib/terminal-data";

export function clearClientGameProgress() {
  window.localStorage.removeItem(HINT_PROMPT_COUNT_STORAGE_KEY);
  window.sessionStorage.removeItem(PRETEXT_LETTER_POSITIONS_STORAGE_KEY);
  // 이 브라우저에서 이전 계정이 phase1(서명 테스트)을 통과했던 기록이 남아있으면
  // 새 계정으로 가입/로그인해도 Admin 탭·홈 웰컴 모달 생략 등이 그대로 새어나간다.
  // 계정 구분이 안 되는 브라우저 단위 플래그이므로 로그인/회원가입마다 함께 초기화한다.
  window.localStorage.removeItem(adminTestRequiredKey);
  window.localStorage.removeItem(adminTestPassedKey);
}