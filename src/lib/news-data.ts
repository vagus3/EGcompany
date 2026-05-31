export type Block =
  | { type: "paragraph"; text: string }
  | { type: "blockquote"; text: string }
  | { type: "image"; caption?: string; imageSrc?: string }
  | { type: "hr" }
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
  excerpt: string;
  featured: boolean;
  imageSrc: string;
  blocks: Block[];
}

export const articles: Article[] = [
  {
    slug: "q3-strategy-report",
    breadcrumb: ["NEWS", "REPORTS", "Q3 REVENUE"],
    dateDisplay: "OCTOBER 24, 2024",
    title: "Q3 전략 보고서: 전략적 성장, 예상 뛰어넘다",
    excerpt:
      "EG Company는 연구 및 운송 부문의 확장에 힘입어, 분기 실적이 전년 대비 14% 상승했다고 밝혔다. 이사회는 특히 자동화 물류 시스템의 성공적인 도입과 정착을 주요 성과로 강조했다.",
    featured: true,
    imageSrc: "/eg_png/egcompany_picture/News/03.png",
    blocks: [
      { type: "image", imageSrc: "/eg_png/egcompany_picture/News/03.png" },
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
  },
  {
    slug: "singapore-expansion",
    breadcrumb: ["NEWS", "REPORTS", "REGIONAL EXPANSION"],
    dateDisplay: "OCTOBER 21, 2024",
    title: "싱가포르 지역 거점 신설",
    excerpt: "",
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
  },
  {
    slug: "it-maintenance",
    category: "CORPORATE ANNOUNCEMENT",
    dateDisplay: "October 19, 2024",
    title: "IT 시스템 유지보수로 인한 운영 중단",
    excerpt: "",
    featured: false,
    imageSrc: "/eg_png/egcompany_picture/News/04.png",
    blocks: [
      { type: "hr" },
      { type: "image", imageSrc: "/eg_png/egcompany_picture/News/04.png" },
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
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
