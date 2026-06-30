export type Block =
  | { type: "paragraph"; text: string }
  | { type: "blockquote"; text: string }
  | { type: "image"; caption?: string; imageSrc?: string }
  | { type: "hr" }
  | { type: "hidden-note"; text: string }
  | {
      type: "maintenance-table";
      rows: { label: string; value: string }[];
    }
  | {
      type: "stats";
      title: string;
      metrics: { value: string; label: string }[];
    };

export interface Article {
  slug: string;
  category?: string;
  breadcrumb?: string[];
  dateDisplay: string;
  title: string;
  title_en?: string;
  excerpt: string;
  excerpt_en?: string;
  featured: boolean;
  imageSrc: string;
  blocks: Block[];
  blocks_en?: Block[];
}

export const articles: Article[] = [
  {
    slug: "q3-strategy-report",
    breadcrumb: ["NEWS", "REPORTS", "Q3 REVENUE"],
    dateDisplay: "OCTOBER 24, 2024",
    title: "Q3 전략 보고서: 전략적 성장, 예상 뛰어넘다",
    title_en: "Q3 Strategy Report: Strategic Growth Exceeds Expectations",
    excerpt:
      "EG Company는 연구 및 운송 부문의 확장에 힘입어, 분기 실적이 전년 대비 14% 상승했다고 밝혔다. 이사회는 특히 자동화 물류 시스템의 성공적인 도입과 정착을 주요 성과로 강조했다.",
    excerpt_en:
      "EG Company reported a 14% increase in quarterly performance compared to the previous year, driven by expansion in the research and transport sectors. The board particularly highlighted the successful implementation of automated logistics systems as a key achievement.",
    featured: true,
    imageSrc: "/eg_png/egcompany_picture/News/01.png",
    blocks: [
      { type: "image", imageSrc: "/eg_png/egcompany_picture/News/01.png" },
      {
        type: "blockquote",
        text: '"3분기 동안 EG Company는 예측치를 상회하는 성장을 기록하며, 글로벌 운영 체계의 안정성과 확장성을 동시에 입증했다. 이번 실적 상승은 단순한 수익 증가를 넘어, 전략적 투자와 구조적 개선이 실제 성과로 이어졌다는 점에서 더욱 의미가 크다."',
      },
      {
        type: "paragraph",
        text: "특히 Research 부문과 Transport 부문에서의 확장이 핵심적인 역할을 했다. 연구 부문에서는 차세대 데이터 관리 및 보안 기술에 대한 지속적인 투자로 고부가치 프로젝트 수주가 증가했으며, 이는 장기적인 수익 기반 강화로 이어지고 있다. 동시에 운송 부문에서는 기존의 물류 네트워크를 재정비하고, 고위험·고가치 자산 운송에 특화된 운영 체계를 구축함으로써 수익성과 안정성을 모두 확보했다.",
      },
      {
        type: "paragraph",
        text: "이사회는 이번 분기의 주요 성과로 자동화 물류 시스템의 성공적인 통합을 강조했다. 해당 시스템은 기존 인력 중심 운영 방식의 한계를 보완하며, 실시간 데이터 기반 의사결정과 대응 속도를 크게 향상시켰다. 그 결과, 운송 지연 및 운영 리스크가 눈에 띄게 감소했으며, 전반적인 효율성 또한 크게 개선되었다.",
      },
      {
        type: "stats",
        title: "QUARTERLY PERFORMANCE METRICS",
        metrics: [
          { value: "12.4%", label: "REVENUE GROWTH YOY" },
          { value: "$4.2M", label: "OPERATING CASH FLOW" },
        ],
      },
      {
        type: "paragraph",
        text: "EG Company는 이러한 성과가 일시적인 성장에 그치지 않는다고 평가하고 있다. 오히려 이는 향후 글로벌 확장과 고도화된 보안 환경에 대응하기 위한 기반이 이미 구축되었음을 보여주는 지표에 가깝다. 특히 민감한 데이터 흐름과 핵심 인프라를 다루는 사업 특성상, 안정성과 신뢰성은 단순한 경쟁력이 아닌 필수 요소로 자리 잡고 있다.",
      },
      {
        type: "paragraph",
        text: "회사는 앞으로도 기술 중심의 운영 혁신과 선택적 확장을 병행하며, 고부가치 산업에 집중할 계획이다. 단기적인 성과보다 장기적인 신뢰 구축을 우선시하는 전략 아래, EG Company는 여전히 '보이지 않는 영역'에서 가장 중요한 시스템을 지탱하는 역할을 이어가고 있다.",
      },
      {
        type: "paragraph",
        text: "결국 이번 분기의 성장은 하나의 결과일 뿐이다. EG Company의 목표는 언제나 동일하다—드러나지 않더라도, 반드시 작동하는 시스템을 만드는 것.",
      },
    ],
    blocks_en: [
      { type: "image", imageSrc: "/eg_png/egcompany_picture/News/01.png" },
      {
        type: "blockquote",
        text: '"During Q3, EG Company recorded growth surpassing projections, simultaneously proving the stability and scalability of our global operations. This performance increase is particularly meaningful as it demonstrates that strategic investments and structural improvements have translated into actual results, going beyond mere revenue growth."',
      },
      {
        type: "paragraph",
        text: "The expansion of the Research and Transport divisions played a pivotal role. In the Research division, continued investment in next-generation data management and security technologies led to increased wins on high-value projects, strengthening the long-term revenue base. In parallel, the Transport division restructured its existing logistics network and established an operational framework specialized for high-risk, high-value asset transport, securing both profitability and stability.",
      },
      {
        type: "paragraph",
        text: "The board highlighted the successful integration of automated logistics systems as the quarter's key achievement. This system compensated for the limitations of the existing personnel-centric operational model, significantly improving real-time data-based decision-making and response speed. As a result, transport delays and operational risks decreased noticeably, and overall efficiency improved substantially.",
      },
      {
        type: "stats",
        title: "QUARTERLY PERFORMANCE METRICS",
        metrics: [
          { value: "12.4%", label: "REVENUE GROWTH YOY" },
          { value: "$4.2M", label: "OPERATING CASH FLOW" },
        ],
      },
      {
        type: "paragraph",
        text: "EG Company evaluates these results as more than temporary growth. Rather, they serve as indicators that the foundation for future global expansion and response to an advanced security environment has already been established. Particularly given the nature of the business—handling sensitive data flows and critical infrastructure—stability and reliability are not merely competitive advantages but essential requirements.",
      },
      {
        type: "paragraph",
        text: "The company plans to continue pursuing technology-driven operational innovation alongside selective expansion, focusing on high-value-added industries. Under a strategy that prioritizes long-term trust building over short-term results, EG Company continues to sustain the most critical systems in 'invisible domains.'",
      },
      {
        type: "paragraph",
        text: "Ultimately, this quarter's growth is just one result. EG Company's goal has always been the same—creating systems that work exactly when needed, even when they remain unseen.",
      },
    ],
  },
  {
    slug: "singapore-expansion",
    breadcrumb: ["NEWS", "REPORTS", "REGIONAL EXPANSION"],
    dateDisplay: "OCTOBER 21, 2024",
    title: "싱가포르 지역 거점 신설",
    title_en: "New Singapore Regional Hub Established",
    excerpt:
      "EG Company가 동남아시아 전략의 핵심 거점으로 싱가포르에 새로운 지역 허브를 설립했다. 물류, 보안 컨설팅, 데이터 운영을 통합한 복합 거점으로 아시아 태평양 전역의 운영 효율성 강화를 목표로 한다.",
    excerpt_en:
      "EG Company has established a new regional hub in Singapore as the cornerstone of its Southeast Asian strategy. The hub integrates logistics, security consulting, and data operations to enhance operational efficiency across the Asia-Pacific region.",
    featured: false,
    imageSrc: "/eg_png/egcompany_picture/News/02.png",
    blocks: [
      {
        type: "image",
        imageSrc: "/eg_png/egcompany_picture/News/02.png",
        caption:
          "FIGURE 2.0: STRATEGIC REGIONAL HUB IN THE HEART OF SINGAPORE'S FINANCIAL DISTRICT.",
      },
      {
        type: "blockquote",
        text: '"EG Company가 동남아시아 전략의 핵심 거점으로 싱가포르에 새로운 지역 허브를 설립했다. 이번 확장은 단순한 사무소 개소를 넘어, 아시아 태평양 전반에 걸친 운영 효율성과 대응 속도를 강화하기 위한 전략적 조치로 평가된다."',
      },
      {
        type: "paragraph",
        text: "싱가포르는 글로벌 물류와 금융, 기술 산업이 교차하는 핵심 도시로, EG Company의 사업 구조와 높은 시너지를 낼 수 있는 지역이다. 회사는 이번 허브를 통해 동남아시아 전역의 운송 네트워크를 보다 정밀하게 통제하고, 지역별 수요에 신속하게 대응할 수 있는 기반을 확보했다.",
      },
      {
        type: "paragraph",
        text: "특히 해당 허브는 기존 물류 기능을 넘어, 보안 컨설팅과 인프라 관리, 데이터 운영까지 통합된 복합 거점으로 설계되었다. 이를 통해 각 부문 간의 정보 단절을 최소화하고, 보다 유기적인 운영 체계를 구축하는 것이 핵심 목표다. 내부적으로는 자동화 시스템과 실시간 모니터링 환경이 적용되어, 물리적 거리와 관계없이 동일한 수준의 통제력을 유지할 수 있도록 설계되었다.",
      },
      {
        type: "stats",
        title: "APAC NETWORK INTEGRATION STATUS",
        metrics: [
          { value: "100%", label: "CORE SYSTEMS ONLINE" },
          { value: "< 15ms", label: "DATA LATENCY (REGIONAL)" },
        ],
      },
      {
        type: "paragraph",
        text: '이사회는 싱가포르 허브를 "단순한 확장이 아닌, 운영 패러다임의 전환점"으로 평가하고 있다. 기존의 분산된 지역 운영 방식에서 벗어나, 핵심 거점을 중심으로 한 집중형 네트워크 구조로 전환함으로써 보다 안정적이고 효율적인 글로벌 운영이 가능해질 것으로 기대된다.',
      },
      {
        type: "paragraph",
        text: "EG Company는 이번 거점을 기반으로 향후 아시아 시장 내 입지를 더욱 확대할 계획이다. 동시에 지역별 특성을 반영한 맞춤형 운영 전략을 병행하여, 단순한 규모 확장이 아닌 '정밀한 확장'을 이어갈 방침이다.",
      },
      {
        type: "paragraph",
        text: "보이지 않는 곳에서 흐름을 통제하고, 필요한 순간에 정확히 작동하는 것. 싱가포르 허브는 그 원칙을 아시아 지역 전반으로 확장하기 위한 새로운 출발점이다.",
      },
    ],
    blocks_en: [
      {
        type: "image",
        imageSrc: "/eg_png/egcompany_picture/News/02.png",
        caption:
          "FIGURE 2.0: STRATEGIC REGIONAL HUB IN THE HEART OF SINGAPORE'S FINANCIAL DISTRICT.",
      },
      {
        type: "blockquote",
        text: '"EG Company has established a new regional hub in Singapore as the cornerstone of its Southeast Asian strategy. This expansion is evaluated as a strategic measure to enhance operational efficiency and response speed throughout the Asia-Pacific region, going beyond a mere office opening."',
      },
      {
        type: "paragraph",
        text: "Singapore is a key city where global logistics, finance, and technology industries intersect, making it a region that can create strong synergies with EG Company's business structure. Through this hub, the company has secured a foundation for more precise control of transportation networks throughout Southeast Asia and rapid response to regional demands.",
      },
      {
        type: "paragraph",
        text: "In particular, the hub is designed as a complex base that integrates security consulting, infrastructure management, and data operations beyond conventional logistics functions. The core objective is to minimize information silos between divisions and establish a more organic operational framework. Internally, automated systems and real-time monitoring environments have been applied, designed to maintain the same level of control regardless of physical distance.",
      },
      {
        type: "stats",
        title: "APAC NETWORK INTEGRATION STATUS",
        metrics: [
          { value: "100%", label: "CORE SYSTEMS ONLINE" },
          { value: "< 15ms", label: "DATA LATENCY (REGIONAL)" },
        ],
      },
      {
        type: "paragraph",
        text: 'The board evaluates the Singapore hub as "not merely an expansion, but a turning point in the operational paradigm." By transitioning from the existing distributed regional operation model to a concentrated network structure centered on key hubs, more stable and efficient global operations are expected.',
      },
      {
        type: "paragraph",
        text: "EG Company plans to further expand its presence in the Asian market based on this hub. Simultaneously, by pursuing customized operational strategies that reflect regional characteristics, the company will continue 'precise expansion' rather than mere scale growth.",
      },
      {
        type: "paragraph",
        text: "Controlling flows from the invisible, operating precisely when needed. The Singapore hub is a new starting point for extending that principle across the Asia-Pacific region.",
      },
    ],
  },
  {
    slug: "it-maintenance",
    category: "CORPORATE ANNOUNCEMENT",
    dateDisplay: "October 19, 2024",
    title: "IT 시스템 유지보수로 인한 운영 중단",
    title_en: "Operational Disruption Due to IT System Maintenance",
    excerpt:
      "2024년 11월 24일 새벽, EG Company는 시스템 안정성 강화 및 보안 업그레이드를 위한 정기 유지보수를 실시한다. 해당 시간 동안 전사 온라인 서비스 접속이 일시 제한된다.",
    excerpt_en:
      "EG Company will conduct scheduled maintenance for system stability and security upgrades on November 24, 2024. All online services will be temporarily inaccessible during the maintenance window.",
    featured: false,
    imageSrc: "/eg_png/egcompany_picture/News/03.png",
    blocks: [
      { type: "hr" },
      { type: "image", imageSrc: "/eg_png/egcompany_picture/News/03.png" },
      {
        type: "paragraph",
        text: "안정적인 IT 서비스 제공과 보안 강화를 위하여 다음과 같이 시스템 정기 점검 및 유지보수 작업을 진행할 예정입니다.",
      },
      {
        type: "maintenance-table",
        rows: [
          { label: "일시", value: "2024년 11월 24일 (일) 01:00 ~ 06:00" },
          {
            label: "대상",
            value: "전사 그룹웨어, 고객 지원 시스템 및 공식 웹사이트",
          },
          {
            label: "영향",
            value: "작업 시간 동안 모든 온라인 서비스 접속 불가",
          },
        ],
      },
      {
        type: "paragraph",
        text: "이번 점검은 시스템 노후 장비 교체 및 데이터베이스 최적화를 포함하고 있습니다. 점검 시간 동안 EG Company의 모든 디지털 플랫폼 접근이 일시적으로 제한되오니, 임직원 및 고객 여러분께서는 업무 및 서비스 이용에 차질이 없도록 미리 일정을 확인해 주시기 바랍니다.",
      },
      {
        type: "paragraph",
        text: "저희 IT 운영팀은 예정된 시간 내에 작업을 완료하여 신속하게 서비스를 정상화할 수 있도록 최선을 다하겠습니다. 서비스 이용에 불편을 드려 대단히 죄송하며, 더 나은 환경을 제공하기 위한 필수적인 과정임을 널리 양해 부탁드립니다.",
      },
    ],
    blocks_en: [
      { type: "hr" },
      { type: "image", imageSrc: "/eg_png/egcompany_picture/News/03.png" },
      {
        type: "paragraph",
        text: "In order to provide stable IT services and enhance security, we will be conducting regular system inspection and maintenance work as described below.",
      },
      {
        type: "maintenance-table",
        rows: [
          { label: "Date", value: "Sunday, November 24, 2024, 01:00 – 06:00" },
          {
            label: "Scope",
            value: "All corporate groupware, customer support systems, and official website",
          },
          {
            label: "Impact",
            value: "All online services will be inaccessible during maintenance hours",
          },
        ],
      },
      {
        type: "paragraph",
        text: "This inspection includes replacement of aging system equipment and database optimization. All digital platforms of EG Company will be temporarily inaccessible during the maintenance window. We kindly ask that all employees and customers review their schedules in advance to avoid any disruption to business operations or service use.",
      },
      {
        type: "paragraph",
        text: "Our IT operations team will do its utmost to complete the work within the scheduled timeframe and quickly restore services to normal. We sincerely apologize for the inconvenience and appreciate your understanding, as this is a necessary process to provide an improved environment.",
      },
    ],
  },
  {
    slug: "night-access-restriction",
    breadcrumb: ["NEWS", "SECURITY", "RESTRICTED AREA"],
    dateDisplay: "NOVEMBER 28, 2024",
    title: "야간 통행 제한 구역 확대",
    title_en: "Expansion of Nighttime Restricted Access Zones",
    excerpt:
      "내부 보안 사고 증가에 대응해 EG Company는 본사 및 주요 시설의 야간 출입 통제 구역을 확대 운영한다. 오후 10시부터 오전 5시까지 지정 구역은 별도 승인 없이 접근이 금지된다.",
    excerpt_en:
      "In response to rising internal security incidents, EG Company is expanding nighttime access restrictions at its headquarters and key facilities. Entry to designated zones is prohibited without separate authorization between 22:00 and 05:00.",
    featured: false,
    imageSrc: "/eg_png/egcompany_picture/News/04.png",
    blocks: [
      {
        type: "image",
        imageSrc: "/eg_png/egcompany_picture/News/04.png",
      },
      {
        type: "blockquote",
        text: '"최근 보안 사고 증가에 따라 일부 구역의 야간 출입이 제한됩니다. 본 조치는 시설 안정성과 내부 운영 보안을 강화하기 위한 예방 대응의 일환입니다."',
      },
      {
        type: "paragraph",
        text: "EG Company는 본사 및 일부 지역 거점 시설 내 야간 보안 통제 범위를 확대한다고 밝혔습니다. 이번 조치는 특정 시간대 반복적으로 발생한 비인가 접근 시도와 내부 보안 사고 보고 증가에 대응하기 위한 조치로, 일부 구역에 대해 제한적 출입 통제가 적용됩니다.",
      },
      {
        type: "stats",
        title: "INTERNAL SECURITY STATUS",
        metrics: [
          { value: "22:00 - 05:00", label: "RESTRICTED ACCESS WINDOW" },
        ],
      },
      {
        type: "paragraph",
        text: "통제 대상에는 연구 보관 구역, 서버 관리 구역, 미사용 물류 통로 및 일부 지하 시설이 포함됩니다. 회사 측은 야간 시간대 불필요한 이동을 최소화하고, 내부 감시 체계의 효율성을 높이기 위한 목적이라고 설명했습니다.",
      },
      {
        type: "paragraph",
        text: "특히 최근 몇 주간 특정 구역에서 승인되지 않은 접근 기록과 비정상 출입 로그가 반복적으로 감지되면서, 보안 부서는 야간 운영 프로토콜 전면 재검토에 착수한 상태입니다. 일부 기록은 정상적인 인증 절차를 거치지 않았음에도 내부 시스템상 출입 흔적이 남아 있었던 것으로 확인되었습니다.",
      },
      {
        type: "paragraph",
        text: "현재 모든 제한 구역에는 추가 감시 장비와 자동 잠금 시스템이 적용되었으며, 지정 시간 이후에는 별도 승인 없이 접근이 불가능합니다. 또한 내부 순찰 인력과 모니터링 빈도 역시 기존 대비 확대 운영되고 있습니다.",
      },
      {
        type: "paragraph",
        text: "회사 관계자는 이번 조치는 일시적인 대응이 아닌 장기적인 시설 안정화 계획의 일부라며, 모든 직원께서는 갱신된 야간 이동 규정을 반드시 숙지해주시기 바란다고 밝혔습니다.",
      },
    ],
    blocks_en: [
      {
        type: "image",
        imageSrc: "/eg_png/egcompany_picture/News/04.png",
      },
      {
        type: "blockquote",
        text: '"Due to an increase in recent security incidents, nighttime access to certain areas will be restricted. This measure is part of a preventive response to enhance facility stability and internal operational security."',
      },
      {
        type: "paragraph",
        text: "EG Company has announced an expansion of nighttime security control scope within the headquarters and select regional hub facilities. This measure is a response to repeated unauthorized access attempts occurring at specific time intervals and an increase in internal security incident reports, with limited access control being applied to certain areas.",
      },
      {
        type: "stats",
        title: "INTERNAL SECURITY STATUS",
        metrics: [
          { value: "22:00 - 05:00", label: "RESTRICTED ACCESS WINDOW" },
        ],
      },
      {
        type: "paragraph",
        text: "Controlled areas include research storage zones, server management areas, unused logistics corridors, and certain underground facilities. The company explained that the purpose is to minimize unnecessary movement during nighttime hours and improve the efficiency of internal monitoring systems.",
      },
      {
        type: "paragraph",
        text: "In particular, as unauthorized access records and abnormal entry logs have been repeatedly detected in certain areas over the past few weeks, the security department has commenced a comprehensive review of nighttime operational protocols. It was confirmed that some records showed traces of internal system access even without going through normal authentication procedures.",
      },
      {
        type: "paragraph",
        text: "Additional surveillance equipment and automatic locking systems have now been applied to all restricted areas, and access after designated hours is not permitted without separate authorization. Internal patrol personnel and monitoring frequency have also been expanded beyond previous levels.",
      },
      {
        type: "paragraph",
        text: 'A company representative stated, "This measure is not a temporary response, but part of a long-term facility stabilization plan," adding, "All employees must familiarize themselves with the updated nighttime movement regulations."',
      },
    ],
  },
  {
    slug: "unauthorized-language-pattern",
    breadcrumb: ["NEWS", "REPORTS", "LANGUAGE PATTERN"],
    dateDisplay: "DECEMBER 03, 2024",
    title: "비인가 언어 패턴 감지 보고",
    title_en: "Unauthorized Language Pattern Detection Report",
    excerpt:
      "EG Company 내부 모니터링 시스템이 일부 서버 기록에서 기존 분류 체계로 해석되지 않는 비인가 언어 패턴을 반복 감지했다. 해당 기록은 격리 저장소로 이전되었으며 추가 분석이 진행 중이다.",
    excerpt_en:
      "EG Company's internal monitoring system has repeatedly detected unauthorized language patterns in server records that cannot be interpreted by existing classification systems. The affected records have been moved to isolated storage, with additional analysis ongoing.",
    featured: false,
    imageSrc: "/eg_png/egcompany_picture/News/05.png",
    blocks: [
      {
        type: "image",
        imageSrc: "/eg_png/egcompany_picture/News/05.png",
      },
      {
        type: "blockquote",
        text: '"일부 내부 기록에서 승인되지 않은 언어 패턴이 반복적으로 감지되었습니다. 현재 해당 패턴은 기존 데이터 분류 체계로 해석되지 않으며, 추가 분석이 진행 중입니다."',
      },
      {
        type: "paragraph",
        text: "EG Company 내부 모니터링 시스템은 최근 일부 서버 기록과 아카이브 문서에서 비인가 언어 패턴이 반복적으로 나타난 사실을 확인했습니다. 해당 패턴은 기존 운영 언어, 보안 코드, 시스템 로그 문법과 일치하지 않는 형태로 분류되었습니다.",
      },
      {
        type: "paragraph",
        text: "초기 분석 결과, 해당 문자는 단순한 인코딩 오류나 파일 손상으로 보기 어려운 반복성을 보였습니다. 특히 일부 기록에서는 동일한 배열이 시간차를 두고 재출현했으며, 특정 부서의 접근 로그와 함께 감지되는 경향이 확인되었습니다.",
      },
      {
        type: "paragraph",
        text: "보안 부서는 현재 관련 문서의 외부 반출을 제한하고, 영향을 받은 데이터베이스에 대한 접근 권한을 임시 조정했습니다. 또한 해당 패턴이 발견된 기록은 별도의 격리 저장소로 이동되어 추가 분석 중입니다.",
      },
      {
        type: "paragraph",
        text: "회사 측은 이번 현상이 운영 시스템 전반에 직접적인 장애를 일으키지는 않았다고 밝혔으나, 동일 패턴이 반복적으로 관측되는 만큼 지속적인 감시와 추가 검증이 필요하다고 설명했습니다.",
      },
      {
        type: "paragraph",
        text: "현재까지 해당 언어 패턴의 출처는 확인되지 않았습니다. 내부 보고서에는 단순 오류 가능성과 함께, 외부 개입 또는 미등록 프로토콜의 흔적일 가능성 역시 함께 기록되어 있습니다.",
      },
      {
        type: "hidden-note",
        text: "일부 기록은 오류처럼 보입니다. 그러나 반복되는 오류는 더 이상 단순한 ERROR III 가 아닙니다. 해당 SIGNAL V 은 특정 SOURCE II 없이 발생하고 있으며, 일부 SYSTEM VI 에서는 동일한 PATTERN IV 이 반복적으로 검출되고 있습니다. 내부 NETWORK I 분석 결과, 일부 ARCHIVE V 기록 역시 비정상적으로 변형된 상태로 확인되었습니다.",
      },
    ],
    blocks_en: [
      {
        type: "image",
        imageSrc: "/eg_png/egcompany_picture/News/05.png",
      },
      {
        type: "blockquote",
        text: '"Unauthorized language patterns have been repeatedly detected in some internal records. The patterns currently cannot be interpreted by the existing data classification system, and additional analysis is ongoing."',
      },
      {
        type: "paragraph",
        text: "EG Company's internal monitoring system has confirmed that unauthorized language patterns have been repeatedly appearing in some server records and archived documents. The patterns have been classified as forms that do not match existing operational languages, security codes, or system log grammar.",
      },
      {
        type: "paragraph",
        text: "Initial analysis results showed that the characters exhibit repetitiveness that is difficult to attribute to simple encoding errors or file corruption. In particular, some records showed the same arrangement reappearing at different time intervals, with a tendency to be detected alongside access logs of specific departments.",
      },
      {
        type: "paragraph",
        text: "The security department has currently restricted the external release of related documents and has temporarily adjusted access permissions for affected databases. Additionally, records where the patterns were discovered have been moved to a separate isolated storage facility for further analysis.",
      },
      {
        type: "paragraph",
        text: "The company stated that this phenomenon has not directly caused failures across operational systems, but explained that since the same pattern is repeatedly observed, continuous monitoring and additional verification are necessary.",
      },
      {
        type: "paragraph",
        text: "The source of this language pattern has not been confirmed to date. Internal reports record both the possibility of a simple error and the possibility that it could be traces of external intervention or an unregistered protocol.",
      },
      {
        type: "hidden-note",
        text: "Some records appear to be errors. However, repeated errors are no longer simply ERROR III. The SIGNAL V is occurring without a specific SOURCE II, and in some SYSTEM VI, the same PATTERN IV is being repeatedly detected. As a result of internal NETWORK I analysis, some ARCHIVE V records have also been confirmed to be abnormally modified.",
      },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
