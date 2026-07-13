import "server-only";

// 터미널 챌린지 정답. 클라이언트 컴포넌트에서 이 파일을 import하면 "server-only"가
// 빌드를 실패시켜, 정답이 실수로라도 클라이언트 JS 번들에 포함되는 걸 막는다.
// 실제 정답 비교는 반드시 src/lib/terminal-state.ts(서버 전용)에서만 이루어진다.

export const PIN_CHALLENGE_ANSWER = ["OBSERVE", "OPEN", "ARCHIVE", "CHANNEL"] as const;

export const CUBE_CHALLENGE_ANSWER_FACE = "TRACE";

export const CORRUPTED_COMMAND_ANSWER = "RAOMTNI";

export const PRETEXT_CHALLENGE_ANSWER = ["S", "T", "O", "P"] as const;
