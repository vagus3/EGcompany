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
  symbol: string;
  classCode: string;
  title: string;
  safetyLevel: number;
  note: string;
  description: string[];
  containment: string[];
  status: string;
}

export const TERMINAL_PROGRESS_STORAGE_KEY = "eg-terminal-progress-v3";

export const pinChallengeAnswer = ["OBSERVE", "TRACE", "KEY", "LOCK"] as const;

export const terminalObjects: TerminalObjectEntry[] = [
  {
    id: "WESEN-096",
    label: "WESEN-096",
    symbol: "FALSE",
    title: "The Unseen Witness",
    safetyLevel: 4,
    classCode: "VISUAL-02",
    note: "관찰 대상. 직접 응시 기록이 반복됩니다.",
    description: [
      "WESEN-096은 직접적인 시선 접촉 기록에 반응하는 관찰형 개체다.",
      "기록자는 대상이 시야에서 사라진 후에도 관찰이 계속되는 느낌을 보고했다.",
    ],
    containment: ["직접 응시 금지", "시각 자료는 저해상도 사본으로만 열람"],
    status: "시각 접촉 기록 3건 보류 중",
  },
  {
    id: "WESEN-783",
    label: "WESEN-783",
    symbol: "OBSERVE",
    title: "The Static Observer",
    safetyLevel: 2,
    classCode: "OBSERVE-04",
    note: "고정 카메라와 관찰 로그에만 반응합니다.",
    description: [
      "WESEN-783은 감시 장비가 켜져 있을 때만 위치가 확정되는 관찰형 개체다.",
      "관찰이 중단되면 이전 프레임과 현재 프레임 사이의 기록이 비어 있게 된다.",
    ],
    containment: ["감시 장비 2대 이상 동시 운용", "관찰 로그 30초 이상 공백 금지"],
    status: "카메라 02-B 동기화 필요",
  },
  {
    id: "WESEN-1744",
    label: "WESEN-1744",
    symbol: "KEY",
    title: "The Borrowed Key",
    safetyLevel: 1,
    classCode: "ACCESS-03",
    note: "잠금 해제 권한과 인증 흔적을 보관합니다.",
    description: [
      "WESEN-1744는 금속 재질의 고전식 열쇠 형태의 개체이다. 외형은 단순하지만, 존재하지 않는 잠금장치에도 대응하는 특성을 가진다.",
      "이 개체는 사용자가 인식하고 있는 '열려야 하는 대상'에 반응하여 해당 대상의 잠금 상태를 해제한다.",
    ],
    containment: [
      "실제 자물쇠가 없어도 작동하며, 디지털 시스템에도 적용된다.",
      "사용 시, 열리는 대상은 항상 하나로 고정되지 않는다.",
    ],
    status: "현재 EG Log 03-27 창고에 보관 중",
  },
  {
    id: "WESEN-0491",
    label: "WESEN-0491",
    symbol: "LOCK",
    title: "The Sealed Door",
    safetyLevel: 3,
    classCode: "SEAL-09",
    note: "격리 절차 중단을 방지하는 잠금 장치입니다.",
    description: [
      "WESEN-0491은 열 수 없는 문처럼 보이지만, 잠금의 원인이 문이 아니라 접근자에게 있는 개체다.",
      "허가되지 않은 접근자는 같은 복도를 반복해서 통과하게 된다.",
    ],
    containment: ["승인된 관리자 카드 없이 접근 금지", "물리적 개방 시도 금지"],
    status: "잠금 루프 안정",
  },
  {
    id: "WESEN-106",
    label: "WESEN-106",
    symbol: "OPEN",
    title: "The Open Place",
    safetyLevel: 2,
    classCode: "BREACH-04",
    note: "개방 상태가 감지되면 즉시 보고해야 합니다.",
    description: [
      "WESEN-106은 닫힌 공간을 열린 장소로 오인하게 만드는 인지형 개체다.",
      "대상 주변의 표지판과 방향 감각이 동시에 불안정해진다.",
    ],
    containment: ["출입문 2중 잠금 유지", "개방 상태 보고 자동화"],
    status: "개방 감지 없음",
  },
  {
    id: "WESEN-392",
    label: "WESEN-392",
    symbol: "TRACE",
    classCode: "TRACE-11",
    title: "The Red Trail",
    safetyLevel: 3,
    note: "이동 경로와 접근 로그를 역추적합니다.",
    description: [
      "WESEN-392는 접근자의 경로 뒤에만 나타나는 잔류 기록형 개체다.",
      "실제 이동하지 않은 경로도 로그에는 남을 수 있다.",
    ],
    containment: ["접근 로그 실시간 비교", "동일 경로 2회 반복 금지"],
    status: "추적 로그 검증 대기",
  },
  {
    id: "WESEN-9428",
    label: "WESEN-9428",
    symbol: "ARCHIVE",
    classCode: "DOC-19",
    title: "The Missing Index",
    safetyLevel: 2,
    note: "보관 문서와 승인 이력을 열람합니다.",
    description: [
      "WESEN-9428은 존재하지 않는 문서 색인을 생성하는 기록형 개체다.",
      "색인된 문서 중 일부는 실제 문서보다 먼저 발견된다.",
    ],
    containment: ["색인 자동 동기화 중지", "수동 승인 후 열람"],
    status: "문서 8건 격리",
  },
  {
    id: "WESEN-0101",
    label: "WESEN-0101",
    symbol: "CHANNEL",
    classCode: "COMMS-07",
    title: "The Return Channel",
    safetyLevel: 5,
    note: "내부 송신 채널과 긴급 메일 큐입니다.",
    description: [
      "WESEN-0101은 발신자가 사라진 뒤에도 답장을 계속 생성하는 통신형 개체다.",
      "회신 내용은 수신자가 아직 알지 못하는 정보를 포함할 수 있다.",
    ],
    containment: ["자동 회신 차단", "긴급 큐 격리"],
    status: "송신 채널 안정",
  },
];

export const terminalMails: TerminalMail[] = [
  {
    id: "transport-request",
    level: "INTERNAL // LOGISTICS",
    time: "16:45:12 ZULU",
    title: "[업무요청] WESEN 개체 정보 전달 요청",
    sender: "제이크_수송팀 리더",
    to: "(플레이어)",
    preview: "안녕하세요, 수송팀 리더 제이크입니다. 금일 캐나다 지부에서...",
    tags: ["TRANSPORT", "REQUEST"],
    unlockedStage: "pin-select",
    challengeType: "pin-select",
    body: [
      "안녕하세요, 수송팀 리더 제이크입니다.",
      "금일 캐나다 지부에서 샌프란시스코 지부로 총 4건의 Wesen 개체 수송이 예정 되어 있습니다. 현재 수송 준비 과정에서 일부 개체의 세부 정보 확인이 지연되고 있어, 안전한 수송을 위해 각 개체에 대한 최신 정보를 요청드립니다.",
      "아래 항목을 포함하여 회신 부탁드립니다.",
      "- 객체 등급 (Object Class), - 격리 절차 (Special Containment Procedures), - 주요 특성 및 위험 요소 (Key Traits/Hazards), - 수송 시 유의사항 (Transport Precautions)",
    ],
  },
  {
    id: "cube-warning",
    level: "INTERNAL // RESEARCH",
    time: "14:22:09 ZULU",
    title: "[연구팀] 2분기 실적 보고서",
    sender: "연구팀_기록관리",
    to: "(플레이어)",
    preview: "2분기 실적 보고서 pdf 첨부 드립니다. 확인하시고 추후 사내 전체 회의에...",
    tags: ["RESEARCH", "REPORT"],
    unlockedStage: "cube-hold",
    challengeType: "cube-hold",
    body: [
      "2분기 실적 보고서 pdf 첨부 드립니다.",
      "확인하시고 추후 사내 전체 회의에서 공유 부탁드립니다.",
      "첨부 문서의 일부 페이지는 내부 시스템 오류로 인해 비정상적인 정육면체 도식으로 표시될 수 있습니다.",
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
