export type TerminalStage =
  | "intro"
  | "pin-select"
  | "cube-hold"
  | "corrupted-command"
  | "pretext-ending"
  | "completed";

export type TerminalChallengeType =
  | "pin-select"
  | "cube-hold"
  | "corrupted-command"
  | "pretext-ending"
  | "completed";

export interface TerminalMail {
  id: string;
  level: string;
  time: string;
  title: string;
  sender: string;
  to: string;
  body: string[];
  preview: string;
  tags: string[];
  unlockedStage: TerminalStage;
  challengeType: TerminalChallengeType;
}

export interface TerminalProgress {
  currentStage: TerminalStage;
  unlockedMailIds: string[];
  selectedMailId: string;
  completedChallengeIds: string[];
}

export interface TerminalObjectEntry {
  id: string;
  label: string;
  classCode: string;
  note: string;
}

export const TERMINAL_PROGRESS_STORAGE_KEY = "eg-terminal-progress-v1";

export const pinChallengeAnswer = ["OBSERVE", "TRACE", "KEY", "LOCK"] as const;

export const terminalObjects: TerminalObjectEntry[] = [
  {
    id: "OBSERVE",
    label: "OBSERVE",
    classCode: "VISUAL-02",
    note: "관찰 대상. 직접 응시 기록이 반복됩니다.",
  },
  {
    id: "TRACE",
    label: "TRACE",
    classCode: "EVIDENCE-11",
    note: "이동 경로와 접근 로그를 역추적합니다.",
  },
  {
    id: "KEY",
    label: "KEY",
    classCode: "ACCESS-03",
    note: "잠금 해제 권한과 인증 흔적을 보관합니다.",
  },
  {
    id: "LOCK",
    label: "LOCK",
    classCode: "SEAL-09",
    note: "격리 절차 중단을 방지하는 잠금 장치입니다.",
  },
  {
    id: "OPEN",
    label: "OPEN",
    classCode: "BREACH-04",
    note: "개방 상태가 감지되면 즉시 보고해야 합니다.",
  },
  {
    id: "FALSE",
    label: "FALSE",
    classCode: "SIGNAL-00",
    note: "허위 신호가 실제 기록처럼 보일 수 있습니다.",
  },
  {
    id: "ARCHIVE",
    label: "ARCHIVE",
    classCode: "DOC-19",
    note: "보관 문서와 승인 이력을 열람합니다.",
  },
  {
    id: "CHANNEL",
    label: "CHANNEL",
    classCode: "COMMS-07",
    note: "내부 송신 채널과 긴급 메일 큐입니다.",
  },
];

export const terminalMails: TerminalMail[] = [
  {
    id: "transport-request",
    level: "INTERNAL // LOGISTICS",
    time: "16:45:12 ZULU",
    title: "[업무 요청] SCP 개체 정보 전달 요청",
    sender: "제이크 (수송팀 리더)",
    to: "ADMIN_L5@SITE-19.TERMINAL",
    preview: "캐나다 지부에서 샌프란시스코 지부로 예정된 수송 정보를 요청합니다.",
    tags: ["TRANSPORT", "REQUEST"],
    unlockedStage: "pin-select",
    challengeType: "pin-select",
    body: [
      "안녕하세요, 수송팀 리더 제이크입니다.",
      "금일 캐나다 지부에서 샌프란시스코 지부로 총 4건의 SCP 개체 수송이 예정되어 있습니다. 현재 수송 준비 과정에서 일부 개체의 세부 정보 확인이 지연되고 있어, 안전한 수송을 위해 각 개체에 대한 최신 정보를 요청드립니다.",
      "아래 항목을 포함하여 회신 부탁드립니다.",
      "개체 등급, 격리 절차, 주요 특성 및 위험 요소, 수송 시 유의점",
    ],
  },
  {
    id: "cube-warning",
    level: "URGENT // LEVEL 5",
    time: "16:51:03 ZULU",
    title: "[긴급] 승인되지 않은 정육면체 문서 접근",
    sender: "UNKNOWN_RELAY",
    to: "ADMIN_L5@SITE-19.TERMINAL",
    preview: "정육면체는 마주보는 면 관계가 중요합니다.",
    tags: ["URGENT", "CUBE"],
    unlockedStage: "cube-hold",
    challengeType: "cube-hold",
    body: [
      "메일 하단의 경고 버튼을 누르면 격리 문서가 열립니다.",
      "정육면체는 마주보는 면 관계가 중요합니다. 진실은 관찰의 반대편에 있습니다.",
      "앞면 OBSERVE, 뒷면 TRACE, 윗면 KEY, 아랫면 LOCK, 왼쪽면 OPEN, 오른쪽면 FALSE",
    ],
  },
  {
    id: "corrupted-command",
    level: "ENCRYPTED // SOURCE UNKNOWN",
    time: "16:57:44 ZULU",
    title: "[발신 출처 불명] 언어 해석 실패",
    sender: "NO_ORIGIN",
    to: "ADMIN_L5@SITE-19.TERMINAL",
    preview: "특수문자로 치환된 빈칸을 복구해 명령어를 입력하십시오.",
    tags: ["UNKNOWN", "COMMAND"],
    unlockedStage: "corrupted-command",
    challengeType: "corrupted-command",
    body: [
      "특수 문자로 바뀐 빈칸에 알맞은 알파벳들을 나열하십시오.",
      "TR@CE / OB$ERVE / LO?K / KE! / OP#N / FAL%E",
      "복구된 명령어가 확인되면 다음 문서가 자동으로 열립니다.",
    ],
  },
  {
    id: "empty-face",
    level: "SCP FILE // VISUAL ANOMALY",
    time: "17:03:18 ZULU",
    title: "[SCP 파일] 빈 얼굴",
    sender: "ARCHIVE_GHOST",
    to: "ADMIN_L5@SITE-19.TERMINAL",
    preview: "문서 내부 텍스트가 커서 움직임에 반응합니다.",
    tags: ["SCP", "PRETEXT"],
    unlockedStage: "pretext-ending",
    challengeType: "pretext-ending",
    body: [
      "해당 SCP 파일은 정상적인 문단 구조로 열람되지 않습니다.",
      "커서 위치에 따라 문서 조각이 밀려나며, 비어 있는 얼굴 형태를 발견하면 클릭하십시오.",
      "보고서 하단에는 접근자가 뒤돌아보지 말아야 한다는 반복 문구가 남아 있습니다.",
    ],
  },
  {
    id: "completed",
    level: "SYSTEM // COMPLETED",
    time: "17:06:00 ZULU",
    title: "[처리 완료] 기념 사원증 발송 예약",
    sender: "EG_COMPANY_ID_SERVICE",
    to: "ADMIN_L5@SITE-19.TERMINAL",
    preview: "모든 관리자 테스트가 종료되었습니다.",
    tags: ["COMPLETE", "ID_CARD"],
    unlockedStage: "completed",
    challengeType: "completed",
    body: [
      "모든 관리자 테스트가 종료되었습니다.",
      "기념 사원증 발송이 예약되었습니다. 실제 발송 연동은 후속 알림 시스템에서 처리됩니다.",
    ],
  },
];

export const initialTerminalProgress: TerminalProgress = {
  currentStage: "pin-select",
  unlockedMailIds: ["transport-request"],
  selectedMailId: "transport-request",
  completedChallengeIds: [],
};
