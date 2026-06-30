export type TerminalStage =
  | "intro"
  | "pin-select"
  | "cube-hold"
  | "corrupted-command"
  | "pretext-ending"
  | "completed";

export type TerminalChallengeType =
  | "none"
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
  title_en?: string;
  sender: string;
  sender_en?: string;
  to: string;
  body: string[];
  body_en?: string[];
  preview: string;
  preview_en?: string;
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

export interface SecurityReadoutRow {
  label: string;
  value: string;
  danger?: boolean;
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
  description_en?: string[];
  containment: string[];
  containment_en?: string[];
  status: string[];
  status_en?: string[];
  imageLabel: string;
  securityReadout: SecurityReadoutRow[];
}

export const pinChallengeAnswer = ["OBSERVE", "OPEN", "ARCHIVE", "CHANNEL"] as const;

export const terminalObjects: TerminalObjectEntry[] = [
  {
    id: "WESEN-096",
    label: "WESEN-096",
    symbol: "FALSE",
    title: "The Hollow Breath",
    safetyLevel: 4,
    classCode: "VISUAL-02",
    note: "관찰 대상. 직접 응시 기록이 반복됩니다.",
    description: [
      "WESEN-096은  검은 유리 앰플 형태로 보관되는 미확인 독성 개체다.",
      "내부 물질은 액체처럼 보이지만, 실제로는 끊임없이 미세 증발을 반복하는 반기체 상태에 가깝다.",
      " ",
      "해당 개체의 가장 위험한 특징은 \"흡입 사실을 인지할 수 없다\" 는 점이다. 노출자는 대부분 자신이 오염되었다는 사실을 자각하지 못하며, 초기 단계에서는 단순 피로, 금속 냄새, 호흡 곤란 정도만 보고된다. 그러나 일정 시간이 경과하면 감염자는 주변 인물들에게 동일 증상을 확산시키기 시작한다.",
      " ",
      "현재까지 정확한 감염 원리는 밝혀지지 않았다",
    ],
    containment: [
      "WESEN-096 보관 구역은 허가되지 않은 환기 시스템 접근 금지",
      "노출 의심자는 격리 후 최소 12시간 관찰한다",
      "보호 장비 제거는 지정된 소독실 내부에서만 허용된다",
    ],
    status: [
      "현재 EG Bio Sector-09 내부 특수 밀폐 캐비닛에 보관 중.",
      "3차 누출 사고 이후 관련 연구 자료 대부분 폐기 처리되었으며, 현재 연구 접근 권한은 SENIOR 이상 인원으로 제한된다.",
    ],
    description_en: [
      "WESEN-096 is an unidentified toxic entity stored in a black glass ampoule.",
      "The internal substance appears liquid, but is actually closer to a semi-gaseous state that continuously undergoes microscopic evaporation.",
      " ",
      "The most dangerous characteristic of this entity is that 'inhalation cannot be perceived.' Most exposed individuals are unaware they have been contaminated, and in early stages only mild fatigue, a metallic smell, and respiratory difficulty are reported. However, after a certain period of time, infected individuals begin spreading the same symptoms to those around them.",
      " ",
      "The exact mechanism of infection has not yet been identified.",
    ],
    containment_en: [
      "Unauthorized access to ventilation systems in the WESEN-096 storage area is prohibited.",
      "Suspected exposure individuals must be quarantined and observed for a minimum of 12 hours.",
      "Removal of protective equipment is permitted only inside designated decontamination rooms.",
    ],
    status_en: [
      "Currently stored in a specialized sealed cabinet inside EG Bio Sector-09.",
      "Following the third containment breach, most related research materials were destroyed. Current research access is restricted to SENIOR-level personnel and above.",
    ],
    imageLabel: "WES_096.JPG",
    securityReadout: [
      { label: "LAST KNOWN LOCATION", value: "SEOUL" },
      { label: "BEHAVIOR_PROFILE", value: "AIRBORNE-TOXIC", danger: true },
      { label: "COGNITIVE_THREAT", value: "NONE_DETECTED" },
      { label: "ACCESS_ANOMALY", value: "CONFIRMED", danger: true },
    ],
  },
  {
    id: "WESEN-783",
    label: "WESEN-783",
    symbol: "OBSERVE",
    title: "The Watcher's Eye",
    safetyLevel: 3,
    classCode: "OBSERVE-04",
    note: "고정 카메라와 관찰 로그에만 반응합니다.",
    description: [
      "WESEN-783은 인간의 안구와 유사한 형태의 감시성 개체다.",
      "표면은 유리처럼 매끄럽지만 실제 촉감은 생체 조직과 유사하며, 빛을 받지 않아도 내부 동공이 미세하게 움직이는 현상이 보고된다.",
      " ",
      "해당 개체는 &quot;관측&quot; 자체에 반응한다. 누군가 WESEN-783을 일정 시간 이상 바라볼 경우, 이후 주변 &quot;전자기기&quot; &quot;거울&quot; &quot;CCTV&quot; 화면 등에서 동일한 눈 형태가 반복적으로 출현하기 시작한다.",
      " ",
      "현재까지 직접적인 물리 피해는 확인되지 않았으나, 장기 노출자 다수가 심각한 수면 장애와 피해망상 증세를 보였다."
    ],
    containment: [
      "WESEN-783 보관실 내부에는 반사 가능한 재질 사용 금지",
      "개체 이동 시 반드시 암전 상태 유지",
    ],
    status: [
      "최근 보관실 로그에서 무인 상태임에도 내부 감시 카메라 초점이 자동으로 개체 방향으로 조정되는 현상이 확인됨.",
      "원인 불명, 추후 연구 필요.",
    ],
    description_en: [
      "WESEN-783 is a surveillance-type entity with a form similar to a human eyeball.",
      "The surface is smooth like glass but has a texture similar to biological tissue, and reports indicate the internal pupil moves faintly even without receiving light.",
      " ",
      "This entity reacts to 'observation' itself. If someone stares at WESEN-783 for a certain period of time, the same eye shape begins to appear repeatedly on nearby electronic devices, mirrors, and CCTV screens.",
      " ",
      "No direct physical harm has been confirmed to date, though multiple long-term exposed individuals have shown severe sleep disorders and paranoid symptoms.",
    ],
    containment_en: [
      "Reflective materials are prohibited inside the WESEN-783 containment room.",
      "The area must remain in complete darkness during entity transfer.",
    ],
    status_en: [
      "A phenomenon was recently confirmed in containment room logs where the internal surveillance camera focus automatically adjusted toward the entity despite no personnel being present.",
      "Cause unknown; further research required.",
    ],
    imageLabel: "WES_783.JPG",
    securityReadout: [
      { label: "LAST KNOWN LOCATION", value: "CANADA" },
      { label: "BEHAVIOR_PROFILE", value: "OBSERVATION-REACTIVE", danger: true },
      { label: "COGNITIVE_THREAT", value: "MODERATE" },
      { label: "ACCESS_ANOMALY", value: "CONFIRMED", danger: true },
    ],
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
      "사용 시, 열리는 대상은 항상 하나로 고정되지 않는다. 사용 시 주의를 요함",
    ],
    status: [
      "현재 EG Log 03-27 창고에 보관 중 필요 시 담당자에게 권한 요청 바람.",
      "(하급 사원이 해당 개체를 이용해서 부적절한 상급 부서 접촉 적발 시, 징계 처리함.)"
    ],
    description_en: [
      "WESEN-1744 is a metal-made classical key-shaped entity. Though simple in appearance, it has the characteristic of responding to locks that do not physically exist.",
      "This entity reacts to the 'target that should be opened' as perceived by the user, unlocking the locked state of that target.",
    ],
    containment_en: [
      "Operates even without an actual lock, including digital systems.",
      "The target that opens upon use is not always fixed to one object. Exercise caution during use.",
    ],
    status_en: [
      "Currently stored in EG Log 03-27 warehouse. Contact the administrator for access permission if needed.",
      "(Junior employees caught using this entity to make inappropriate contact with senior departments will be subject to disciplinary action.)",
    ],
    imageLabel: "WES_1744.JPG",
    securityReadout: [
      { label: "LAST KNOWN LOCATION", value: "SEOUL" },
      { label: "BEHAVIOR_PROFILE", value: "KEY-RESPONSIVE", danger: true },
      { label: "COGNITIVE_THREAT", value: "NONE_DETECTED" },
      { label: "ACCESS_ANOMALY", value: "CONFIRMED", danger: true },
    ],
  },
  {
    id: "WESEN-0491",
    label: "WESEN-0491",
    symbol: "LOCK",
    title: "The Silent Lock",
    safetyLevel: 3,
    classCode: "SEAL-09",
    note: "격리 절차 중단을 방지하는 잠금 장치입니다.",
    description: [
      "WESEN-0491은 오래된 산업용 자물쇠 형태의 개체다.",
      "표면에는 제조사 정보나 열쇠 구멍 구조가 존재하지 않으며, 강한 부식 흔적에도 불구하고 물리적 손상이 발생하지 않는다.",
      " ",
      "해당 개체는 단순 문이나 금고뿐 아니라 파일, 기억, 공간, 통신 기록 등 사용자가 \"숨기고 싶다\"고 인식한 대상에도 영향을 미친다.",
      "일부 실험에서는 특정 데이터 자체가 완전히 소실되는 현상이 확인되었다.",
    ],
    containment: [
      "개체 사용 기록은 반드시 아날로그 문서로 별도 보관할 것",
      "실험 시 봉인 대상 지정 오류 발생 가능성 존재. 사용 전 대상 명칭을 반복 확인할 것.",
    ],
    status: [
      "직전 실험 도중 방탈출 경험이 다수한 연구원 앞에서 자동으로 봉인이 해제된 사례가 있음.",
      "긴급해제가 필요할 시 해당 사원 호출 요망"
    ],
    description_en: [
      "WESEN-0491 is an old industrial padlock-shaped entity.",
      "The surface has no manufacturer information or key hole structure, and despite strong corrosion marks, no physical damage occurs.",
      " ",
      "This entity affects not only simple doors and safes, but also files, memories, spaces, and communication records — any target that the user 'wants to hide.'",
      "Some experiments have confirmed cases where specific data itself was completely lost.",
    ],
    containment_en: [
      "Access without an approved administrator card is prohibited.",
      "Possibility of error in specifying the sealing target during testing. Repeatedly confirm the target name before use.",
    ],
    status_en: [
      "During a previous experiment, there was a case where the seal automatically released in front of a researcher with extensive escape room experience.",
      "Contact that employee if emergency release is needed.",
    ],
    imageLabel: "WES_0491.JPG",
    securityReadout: [
      { label: "LAST KNOWN LOCATION", value: "SAN FRANCISCO" },
      { label: "BEHAVIOR_PROFILE", value: "SEAL-ACTIVE", danger: true },
      { label: "COGNITIVE_THREAT", value: "NONE_DETECTED" },
      { label: "ACCESS_ANOMALY", value: "CONFIRMED", danger: true },
    ],
  },
  {
    id: "WESEN-106",
    label: "WESEN-106",
    symbol: "OPEN",
    title: "The Last Exposure",
    safetyLevel: 3,
    classCode: "BREACH-04",
    note: "개방 상태가 감지되면 즉시 보고해야 합니다.",
    description: [
      "WESEN-106은 구형 필름 카메라 형태의 기록형 개체다.",
      "이형은 손상된 80년대 휴대용 카메라와 유사하지만, &quot;내부 필름&quot; &quot;배터리&quot; &quot;저장 장치&quot;는 존재하지 않는다.",
      " ",
      "해당 개체로 촬영된 대상은 단순 이미지가 아닌 \"정보 자체\"가 기록된다. 사진을 열람한 인원은 대상의 이름, 구조, 상태, 일부 기억 등을 직관적으로 인지하게 되며, 경우에 따라 대상이 숨기고 있던 정보까지 노출되는 사례가 보고되었다."
    ],
    containment: [
      "WESEN-106으로 촬영된 사진은 비인가 인원의 열람 금지.",
      "개체 사용 이후 촬영자는 반드시 기억 안정화 검사를 실시한다.",
    ],
    status: [
      "실험 도중 연구원 1명이 동료를 촬영하였으며, 이후 사진을 확인한 모든 인원이 대상의 어린 시절 기억 일부를 동일하게 진술했다.",
      " ",
      "문제는 진술 내용 중 당사자 본인조차 기억하지 못하던 정보가 포함되어 있었다는 점이다.",
      " ",
      "현재 해당 사진은 폐기 처리되었으나, 관련 인원 일부가 동일한 꿈을 반복 보고 중."
    ],
    description_en: [
      "WESEN-106 is a recording-type entity in the form of an old film camera.",
      "The form is similar to a damaged 1980s portable camera, but internal film, battery, and storage devices do not exist.",
      " ",
      "Subjects photographed with this entity have 'information itself' recorded, not simply images. Personnel who view the photographs intuitively perceive the subject's name, structure, condition, and some memories, with cases reported where information the subject had hidden was also exposed.",
    ],
    containment_en: [
      "Photographs taken with WESEN-106 are prohibited from being viewed by unauthorized personnel.",
      "After using the entity, the photographer must undergo a memory stabilization examination.",
    ],
    status_en: [
      "During an experiment, a researcher photographed a colleague, and afterwards, all personnel who viewed the photograph uniformly testified to the same portion of the subject's childhood memories.",
      " ",
      "The problem was that the testimonies included information that even the subject themselves could not remember.",
      " ",
      "The photograph has since been destroyed, but some related personnel continue to report the same recurring dreams.",
    ],
    imageLabel: "WES_106.JPG",
    securityReadout: [
      { label: "LAST KNOWN LOCATION", value: "CANADA" },
      { label: "BEHAVIOR_PROFILE", value: "RECORD-ACTIVE", danger: true },
      { label: "COGNITIVE_THREAT", value: "HIGH" },
      { label: "ACCESS_ANOMALY", value: "CONFIRMED", danger: true },
    ],
  },
  {
    id: "WESEN-392",
    label: "WESEN-392",
    symbol: "TRACE",
    classCode: "TRACE-11",
    title: "The Bastion",
    safetyLevel: 5,
    note: "이동 경로와 접근 로그를 역추적합니다.",
    description: [
      "WESEN-392는 방패 형태의 대형 금속 개체다.",
      "표면은 정체 불명의 흑색 합금으로 구성되어 있으며, 충격·화염·고열·폭발 등 대부분의 물리적 손상에 영향을 받지 않는다.",
      " ",
      "해당 개체는 사용자가 &quot;지켜야 한다&quot; 고 인식한 대상을 중심으로 주변 공간 자체를 방어구조로 재구성한다. 실험 과정에서 출입문이 봉쇄되거나, 복도가 변형되며, 감시 시스템 접근이 차단되는 현상이 반복 보고되었다.",
    ],
    containment: [
      "개체 활성화 이후 비정상적인 방법으로 내부 진입 시도 금지. 자동 적대 판정 가능성 존재",
      "주 관리 부서를 보안팀으로 지정할 것",
    ],
    status: [
      "WESEN-392는 현재 EG Company 본사 보안 시스템 일부에 실제 활용 중이다.",
      " ",
      "본사 지하 Defense Sector에서는 WESEN-392 기반 공간 방어 프로토콜이 상시 활성화되어 있으며, Level-4 이상 보안 경보 발생 시 자동으로 주요 복도 및 출입구 구조가 재배치된다.",
      " ",
      "외부인 오인 방지를 위해 모든 사원은 반드시 등록 절차를 거쳐야 함."
    ],
    description_en: [
      "WESEN-392 is a large metal entity in the form of a shield.",
      "The surface is composed of an unidentified black alloy and is unaffected by most physical damage including impact, fire, extreme heat, and explosions.",
      " ",
      "This entity reconstructs the surrounding space into a defensive structure centered on the target the user 'wants to protect.' Repeated reports of doors being sealed, corridors being deformed, and surveillance system access being blocked have been documented during experiments.",
    ],
    containment_en: [
      "Attempting to enter the interior through abnormal means after entity activation is prohibited. Possibility of automatic hostile designation.",
      "The primary management department should be designated as the Security Team.",
    ],
    status_en: [
      "WESEN-392 is currently being actively utilized as part of EG Company's headquarters security system.",
      " ",
      "In the headquarters underground Defense Sector, WESEN-392-based spatial defense protocols are continuously activated, and key corridors and entrance structures are automatically rearranged when a Level-4 or higher security alert occurs.",
      " ",
      "All employees must go through a registration procedure to prevent misidentification of outsiders.",
    ],
    imageLabel: "WES_392.JPG",
    securityReadout: [
      { label: "LAST KNOWN LOCATION", value: "SEOUL" },
      { label: "BEHAVIOR_PROFILE", value: "DEFENSE-ACTIVE", danger: true },
      { label: "COGNITIVE_THREAT", value: "NONE_DETECTED" },
      { label: "ACCESS_ANOMALY", value: "CONFIRMED", danger: true },
    ],
  },
  {
    id: "WESEN-9428",
    label: "WESEN-9428",
    symbol: "ARCHIVE",
    classCode: "DOC-19",
    title: "The Red Zone",
    safetyLevel: 8,
    note: "보관 문서와 승인 이력을 열람합니다.",
    description: [
      "WESEN-9428은 특정 형태가 존재하지 않는 재난성 개체다.",
      "현재까지 관측 기록에 따르면 경고 표식, 비상 방송, 안전 프로토콜, 재난 안내 체계 내부에서 반복적으로 출현한다.",
      " ",
      "목적이 없는 위험 경고를 주변으로 전파하는 특성을 가지고 있다. 경고를 인지한 대상은 일정 시간 이후 동일한 경고 문구를 반복 생성하기 시작하며, 주변 시스템 역시 연쇄적으로 오작동한다.",
    ],
    containment: [
      "WESEN-9428 관련 경고 문구는 반드시 승인된 수화 방식으로만 전달할 것.",
      "자동 경보 시스템 연결 금지.",
      "반드시 형태가 있는 물체에 담아서 이동시켜야 함.",
    ],
    status: [
      "WESEN-9428은 위험도가 지나치게 높아 모든 연구가 중단된 상태다.",
      "임시로 플라스틱 사이렌에 담아서 보관 중. 절대 사내 시스템에 연결하지 말 것."
    ],
    description_en: [
      "WESEN-9428 is a disaster-type entity with no specific physical form.",
      "According to observation records to date, it repeatedly appears inside warning signs, emergency broadcasts, safety protocols, and disaster guidance systems.",
      " ",
      "It has the characteristic of propagating purposeless hazard warnings to its surroundings. Those who perceive the warning begin repeatedly generating the same warning text after a certain period of time, and surrounding systems also malfunction in a chain reaction.",
    ],
    containment_en: [
      "Warning messages related to WESEN-9428 must be conveyed only through approved sign language methods.",
      "Connection to automatic alarm systems is prohibited.",
      "Must be transported inside a physical container at all times.",
    ],
    status_en: [
      "WESEN-9428's hazard level is excessively high and all research has been suspended.",
      "Currently stored in a plastic siren on a temporary basis. Do not connect to internal systems under any circumstances.",
    ],
    imageLabel: "WES_9428.JPG",
    securityReadout: [
      { label: "LAST KNOWN LOCATION", value: "CANADA" },
      { label: "BEHAVIOR_PROFILE", value: "BROADCAST-HAZARD", danger: true },
      { label: "COGNITIVE_THREAT", value: "CRITICAL" },
      { label: "ACCESS_ANOMALY", value: "CONFIRMED", danger: true },
    ],
  },
  {
    id: "WESEN-0101",
    label: "WESEN-0101",
    symbol: "CHANNEL",
    classCode: "COMMS-07",
    title: "CoMpUtEr",
    safetyLevel: 10,
    note: "내부 송신 채널과 긴급 메일 큐입니다.",
    description: [
      "WESEN-0101은 인간과 유사한 크기의 개체로, 신체가 다양한 컴퓨터 부품으로 구성되어 있다.",
      " ",
      "[확인된 구성 요소]",
      "두부: 중앙 처리 장치(CPU) 구조", 
      "상지: 메모리 모듈(RAM) 형태", 
      "흉부: 그래픽 처리 장치(GPU) 유사 구조", 
      "척추: 케이블 및 회로 형태",
      " ",
      "해당 개체는 물리적 개체이면서 동시에 디지털 네트워크 상에서의 존재를 인식할 수 있는 특성을 가진다. 0101에 대한 정보를 검색, 열람, 또는 추적하려는 행위가 발생할 경우, 해당 행위자의 위치를 역으로 추적한다.",
      "네트워크가 연결된 모든 장치를 통해 빠른 속도로 접근할 수 있으니 주의 요망.",
    ],
    containment: [
      "관련된 데이터에 접근하는 모든 인원은 SENIOR 이상의 승인을 필요로 하며, 접속 로그는 실시간으로 모니터링 되어야한다.",
      "모든 관련 기록은 오프라인 서버로만 전달되어야 한다.",
      "또한 연구팀의 도움 없이 열람을 금지한다"
    ],
    status: ["접근 단계",
      "1단계: 로그 이상 발생",
      "2단계: 장치 오작동",
      "3단계: 시각적 노이즈 발생",
      "4단계: 물리적 접근",
    ],
    description_en: [
      "WESEN-0101 is an entity of human-comparable size, with its body composed of various computer components.",
      " ",
      "[Confirmed Components]",
      "Head: CPU structure / Upper limbs: RAM module form / Chest: GPU-similar structure / Spine: Cable and circuit form",
      " ",
      "This entity can recognize its existence on digital networks while also being a physical entity. When any act of searching, viewing, or tracking information about 0101 occurs, it reversely tracks the location of the actor.",
      "Access is possible at high speed through any network-connected device. Extreme caution is advised.",
    ],
    containment_en: [
      "All personnel accessing relevant data require approval above SENIOR, and access logs must be monitored in real time,",
      "All relevant records should only be forwarded to offline servers. age media completely separated from the internal network.",
    ],
    status_en: [
      "Access step",
      "Step 1: Log Abnormalities",
      "Step 2: Device malfunction",
      "Step 3: Visual Noise Generating",
      "Step 4: Physical Approach,"
    ],
    imageLabel: "WES_0101.JPG",
    securityReadout: [
      { label: "LAST KNOWN LOCATION", value: "CANADA" },
      { label: "BEHAVIOR_PROFILE", value: "TRACE-ACTIVE", danger: true },
      { label: "COGNITIVE_THREAT", value: "EXTREME" },
      { label: "ACCESS_ANOMALY", value: "CONFIRMED", danger: true },
    ],
  },
];

export const terminalMails: TerminalMail[] = [
  {
    id: "transport-request",
    level: "INTERNAL // LOGISTICS",
    time: "16:45:12 ZULU",
    title: "[업무요청] WESEN 개체 정보 전달 요청",
    title_en: "[Work Request] WESEN Object Information Transfer Request",
    sender: "제이크_수송팀 리더",
    sender_en: "Jake_Transport Lead",
    to: "(플레이어)",
    preview: "안녕하세요, 수송팀 리더 제이크입니다. 금일 캐나다 지부에서...",
    preview_en: "Hello, this is Jake, Transport Team Lead. Today, a transfer from the Canada branch...",
    tags: ["TRANSPORT", "REQUEST"],
    unlockedStage: "pin-select",
    challengeType: "pin-select",
    body: [
      "안녕하세요, 수송팀 리더 제이크입니다.",
      "금일 캐나다 지부에서 샌프란시스코 지부로 총 4건의 Wesen 개체 수송이 예정 되어 있습니다. 현재 수송 준비 과정에서 일부 개체의 세부 정보 확인이 지연되고 있어, 안전한 수송을 위해 각 개체에 대한 최신 정보를 요청드립니다.",
      "아래 항목을 포함하여 회신 부탁드립니다.",
      "- 객체 등급 (Object Class), - 격리 절차 (Special Containment Procedures), - 주요 특성 및 위험 요소 (Key Traits/Hazards), - 수송 시 유의사항 (Transport Precautions)",
    ],
    body_en: [
      "Hello, this is Jake, Transport Team Lead.",
      "A transfer of 4 WESEN objects from the Canada branch to the San Francisco branch is scheduled for today. There are currently delays in confirming detailed information on some objects during transport preparation. To ensure safe transport, I am requesting the latest information on each object.",
      "Please reply with the following items.",
      "- Object Class, - Special Containment Procedures, - Key Traits/Hazards, - Transport Precautions",
    ],
  },
  {
    id: "cube-warning",
    level: "INTERNAL // RESEARCH",
    time: "14:22:09 ZULU",
    title: "[연구팀] 2분기 실적 보고서",
    title_en: "[Research Team] Q2 Performance Report",
    sender: "연구팀_기록관리",
    sender_en: "ResearchTeam_Records",
    to: "(플레이어)",
    preview: "2분기 실적 보고서 pdf 첨부 드립니다. 확인하시고 추후 사내 전체 회의에...",
    preview_en: "Attaching the Q2 performance report PDF. Please review and share at the upcoming all-hands meeting...",
    tags: ["RESEARCH", "REPORT"],
    unlockedStage: "intro",
    challengeType: "none",
    body: [
      "2분기 실적 보고서 pdf 첨부 드립니다.",
      "확인하시고 추후 사내 전체 회의에서 공유 부탁드립니다.",
      "첨부 문서의 일부 페이지는 내부 시스템 오류로 인해 비정상적인 이미지 손상이 발생할 수 있습니다.",
      "사내 전체 회의 전 확인 부탁드립니다.",
    ],
    body_en: [
      "Attaching the Q2 performance report PDF.",
      "Please review and share at the upcoming company-wide meeting.",
      "Some pages of the attached document may show abnormal image corruption due to internal system errors.",
      "Please verify before the all-hands meeting.",
    ],
  },
  {
    id: "urgent-containment",
    level: "SECURITY // URGENT",
    time: "18:00:27 ZULU",
    title: "[긴급] 알립니다.",
    title_en: "[URGENT] Notice.",
    sender: "제이크_수송팀 리더",
    sender_en: "Jake_Transport Lead",
    to: "(플레이어)",
    preview: "보안팀 열람 요망_기밀 사항",
    preview_en: "SECURITY TEAM ACCESS REQUIRED_CONFIDENTIAL MATTER",
    tags: ["URGENT", "SECURITY"],
    unlockedStage: "cube-hold",
    challengeType: "cube-hold",
    body: [
      "보안팀 열람 요망_기밀 사항",
      "운송 도중 개체가 차량을 탈출했으며, 현재 이동 경로상의 통신 지연 및 시스템 로그 누락 현상이 관찰되고 있습니다.",
      "해당 개체의 문서를 연구팀의 도움 없이 열람하셨나요?",
    ],
    body_en: [
      "SECURITY TEAM ACCESS REQUIRED_CONFIDENTIAL MATTER",
      "The object escaped the vehicle during transport, and communication delays and missing system logs are currently being observed along the travel route.",
      "Did you view the object's documents without the assistance of the research team?",
    ],
  },
  {
    id: "corrupted-command",
    level: "ENCRYPTED // SOURCE UNKNOWN",
    time: "-0-=0-----10",
    title: "■■■■■■■■",
    sender: "UNKNOWN_SOURCE",
    to: "ADMIN_L5@SITE-19.TERMINAL",
    preview: "--------------",
    tags: ["UNKNOWN", "COMMAND"],
    unlockedStage: "corrupted-command",
    challengeType: "corrupted-command",
    body: [
      "시각 로그의 문자 잔상을 복구하십시오.",
      "복구된 명령어가 확인되면 다음 문서가 자동으로 열립니다.",
    ],
    body_en: [
      "Recover the character residue from the visual log.",
      "Once the recovered command is confirmed, the next document will open automatically.",
    ],
  },
  {
    id: "empty-face",
    level: "SCP FILE // VISUAL ANOMALY",
    time: "17:03:18 ZULU",
    title: "[SCP 파일] 빈 얼굴",
    title_en: "[SCP FILE] The Empty Face",
    sender: "ARCHIVE_GHOST",
    to: "ADMIN_L5@SITE-19.TERMINAL",
    preview: "문서 내부 텍스트가 커서 움직임에 반응합니다.",
    preview_en: "Document internal text responds to cursor movement.",
    tags: ["SCP", "PRETEXT"],
    unlockedStage: "pretext-ending",
    challengeType: "pretext-ending",
    body: [
      "해당 SCP 파일은 정상적인 문단 구조로 열람되지 않습니다.",
      "커서 위치에 따라 문서 조각이 밀려나며, 비어 있는 얼굴 형태를 발견하면 클릭하십시오.",
      "보고서 하단에는 접근자가 뒤돌아보지 말아야 한다는 반복 문구가 남아 있습니다.",
    ],
    body_en: [
      "This SCP file cannot be viewed in a normal paragraph structure.",
      "Document fragments shift according to cursor position. When an empty face shape is discovered, click on it.",
      "At the bottom of the report, there is a repeated phrase stating that the accessor must not look back.",
    ],
  },
  {
    id: "completed",
    level: "SYSTEM // COMPLETED",
    time: "17:06:00 ZULU",
    title: "[처리 완료] 기념 사원증 발송 예약",
    title_en: "[COMPLETED] Employee ID Card Delivery Scheduled",
    sender: "EG_COMPANY_ID_SERVICE",
    to: "ADMIN_L5@SITE-19.TERMINAL",
    preview: "모든 관리자 테스트가 종료되었습니다.",
    preview_en: "All administrator tests have been completed.",
    tags: ["COMPLETE", "ID_CARD"],
    unlockedStage: "completed",
    challengeType: "completed",
    body: [
      "모든 관리자 테스트가 종료되었습니다.",
      "기념 사원증 발송이 예약되었습니다. 실제 발송 연동은 후속 알림 시스템에서 처리됩니다.",
    ],
    body_en: [
      "All administrator tests have been completed.",
      "Employee ID card delivery has been scheduled. Actual delivery integration will be handled by the follow-up notification system.",
    ],
  },
];

export const initialTerminalProgress: TerminalProgress = {
  currentStage: "pin-select",
  unlockedMailIds: ["transport-request"],
  selectedMailId: "transport-request",
  completedChallengeIds: [],
};
