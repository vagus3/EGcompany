import type { Language } from "@/hooks/useLanguage";

const translations = {
  ko: {
    // ── Home ──────────────────────────────────────────────────────────────
    home_statement_line1: "우리는 구조를 믿습니다.",
    home_statement_line2: "우리는 정밀함을 믿습니다.",
    home_statement_line3: "소음이 가득한 세상 속에서, 우리는 침묵과 확실성을 설계합니다.",
    home_statement_line4: "우리의 방법론은 브루탈리즘이며, 우리의 실행은 한 치의 오차도 없습니다.",
    home_future_body:
      "우리는 미래를 예측하지 않습니다. 우리는 미래를 건설합니다. 다음 10년을 위한 우리의 설계는 이미 진행 중입니다.",

    // ── About ─────────────────────────────────────────────────────────────
    about_subtitle_1: "글로벌 인프라.",
    about_subtitle_2: "고요한 탁월함.",
    about_desc:
      "EG Company는 국제 무역과 물류, 그리고 민간 보안 분야를 뒷받침하는 핵심 시스템과 기반 구조를 구축하고 운영하는 기업입니다.",
    about_director_title: "EG Company 대표이사",
    about_quote:
      "정밀함은 순간의 결과가 아니라, 과정입니다. 우리는 드러나지 않는 영역에서 움직이며, 세상의 핵심 시스템들이 어떤 상황에서도 무너지지 않도록 합니다.",
    about_speech_1:
      "이 조직을 설립했을 때 목표는 단순했습니다. 신뢰라는 이름의 유산을 남기는 것. 우리는 주목받기 위해 움직이지 않아요. 문제를 해결하기 위해 움직입니다. 작은 지역 물류 회사에서 시작해서 다국적 기업으로 성장해온 시간, 완벽함과 절제된 규칙을 끝까지 고수한 우리의 태도를 증명합니다.",
    about_speech_2:
      "복잡한 21세기 속에서도, EG Company는 운영 보안과 산업 혁신 분야에서 흔들림 없는 회사로 함께 할 것입니다.",
    about_speech_3: "우리는 과거를 망각하지 않으며, 그 위에 미래를 구축해 나갑니다.",
    about_speech_4: "진실은 언제나 관찰의 반대편에 있습니다.",
    about_evolution: "Company Evolution",

    // ── Rules ─────────────────────────────────────────────────────────────
    rules_title_line1: "임직원 행동 강령",
    rules_title_line2: "& 업무 안전",
    rules_subtitle:
      "EG 컴퍼니 임직원의 안전과 효율적인 업무 환경 조성을 위한 기본 행동 수칙 및 보건 가이드라인입니다. 본 규정은 사내 보안 등급에 따라 엄격히 준수되어야 합니다.",
    rules_notice_label: "주의",
    rules_notice_pre:
      "위 지침은 모든 임직원의 안전을 보장하기 위한 최소한의 조치입니다. 지침 미준수로 발생하는 '존재적 불일치'나 '물리적 소실'에 대해 EG 컴퍼니는 법적 책임을 지지 않습니다. 모든 임직원은 본 문서를 숙지했음을 ",
    rules_notice_btn: "서명",
    rules_notice_post: "으로 갈음합니다.",

    // ── Contact ───────────────────────────────────────────────────────────
    contact_report_heading: "제보",
    contact_report_desc_1:
      "무언가 회사 측에 익명의 제보가 필요하거나, 도움이 필요한 사항이 있다면 이곳에 접수 해 주세요.",
    contact_report_desc_2: "검토 후 인사팀에게 전달됩니다.",
    contact_placeholder: "제보 내용을 입력하세요...",
    contact_send: "제보 보내기",
    contact_sent: "전송 완료 ✓",

    // ── News ──────────────────────────────────────────────────────────────
    news_eyebrow: "기업 업데이트",
    news_heading: "회사 뉴스 및 공지사항",
    news_read_full: "전체 보고서 읽기 →",

    // ── Information ───────────────────────────────────────────────────────
    info_heading: "회사 정보",
    info_label_name: "회사명",
    info_label_ceo: "대표이사",
    info_label_brn: "사업자등록번호",
    info_label_phone: "전화",
    info_label_fax: "팩스",
    info_label_email: "이메일",
    info_label_address: "주소",
    info_address: "대한민국 서울 종로구 사랑국로 52, 이빌 빌딩 타워 E 44층",

    // ── HR ────────────────────────────────────────────────────────────────
    hr_eyebrow: "부서 / 인사부",
    hr_heading: "인사부.",
    hr_desc:
      "인재와 성과가 만나는 기업 생태계를 설계합니다. 우리의 초점은 성장, 포용성, 그리고 지속 가능한 업무 환경 조성에 있습니다.",
    hr_strategic_overview: "전략적 개요",
    hr_card1_title: "노동 관계",
    hr_card1_desc: "투명한 소통과 공정한 관행을 통해 강력한 관계를 구축합니다.",
    hr_card2_title: "임직원 복지",
    hr_card2_desc: "모든 팀원의 정신적, 신체적 웰빙을 최우선으로 합니다.",
    hr_card3_title: "조직 개발",
    hr_card3_desc: "역동적인 글로벌 시장의 도전에 맞추어 조직 구조를 발전시킵니다.",
    hr_culture_heading: "기업 문화 & 가치",
    hr_culture_desc:
      "우리의 문화는 우리가 하는 모든 것의 근간입니다. 신뢰, 협업, 끊임없는 혁신 위에 구축되었습니다. 우리는 모든 개인이 매일 진정한 자신을 업무에 가져올 수 있도록 역량을 강화합니다.",
    hr_learn_more: "자세히 보기",
    hr_career_heading: "커리어 개발",
    hr_career_1_level: "입문",
    hr_career_1_role: "주니어 분석가",
    hr_career_2_level: "중간 관리",
    hr_career_2_role: "시니어 전략가",
    hr_career_3_level: "관리직",
    hr_career_3_role: "팀장",
    hr_career_4_level: "임원",
    hr_career_4_role: "이사",
    hr_exp_heading: "임직원 경험",
    hr_t1_quote: "이곳의 지원 시스템은 타의 추종을 불허합니다. 매일이 성장의 기회입니다.",
    hr_t1_role: "인사팀장",
    hr_t2_quote: "채용 프로세스를 혁신하는 자유와 신뢰의 문화를 사랑합니다.",
    hr_t2_role: "기술 채용 담당자",
    hr_touch_heading: "문의하기.",
    hr_location_1: "본사",
    hr_location_3: "대한민국 서울",
    hr_cta_btn: "함께 일하기",

    // ── Login ─────────────────────────────────────────────────────────────
    login_email_label: "회사 이메일",
    login_password_label: "비밀번호",
    login_btn_checking: "확인 중",
    login_btn_signin: "로그인",
    login_no_account: "계정이 없으신가요?",
    login_request_access: "회사 계정 신청",

    // ── Signup ────────────────────────────────────────────────────────────
    signup_name_label: "이름",
    signup_email_label: "회사 이메일",
    signup_password_label: "비밀번호",
    signup_privacy_title: "개인정보 수집 및 이용 동의",
    signup_privacy_section1_title: "1. 수집 항목",
    signup_privacy_section1_body: "닉네임, 이메일 주소, 비밀번호",
    signup_privacy_section2_title: "2. 수집 및 이용 목적",
    signup_privacy_section2_body1: "회원 식별 및 로그인 기능 제공",
    signup_privacy_section2_body2: "서비스 이용 및 콘텐츠 진행 (게임 진행, 결과 저장 등)",
    signup_privacy_section2_body3: "문의 대응 및 공지 전달",
    signup_privacy_section3_title: "3. 보유 및 이용 기간",
    signup_privacy_section3_body1: "회원 탈퇴 시까지 보관",
    signup_privacy_section3_body2: "탈퇴 시 지체 없이 파기",
    signup_privacy_section4_title: "4. 동의 거부 권리 안내",
    signup_privacy_section4_body1: "이용자는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있습니다.",
    signup_privacy_section4_body2: "단, 동의를 거부할 경우 회원가입 및 서비스 이용이 제한될 수 있습니다.",
    signup_privacy_section5_title: "5. 개인정보 보호 조치",
    signup_privacy_section5_body: "비밀번호는 암호화하여 저장됩니다.",
    signup_conduct_title: "EG 행동 강령",
    signup_conduct_1:
      "EG 모놀리스 시스템에 접속함으로써, 모든 임직원은 최고 수준의 기업 청렴도와 데이터 보안 기준을 준수하는 데 동의합니다. 프로토콜 위반, 제한 구역 무단 접근, 또는 이상 사항 미보고 시 즉시 접근 권한이 박탈됩니다.",
    signup_conduct_2:
      "독점 알고리즘 및 데이터 구조의 비업무 목적 사용은 금지됩니다. 모든 운영 활동은 컴플라이언스 및 시스템 안전을 위해 감사받을 수 있습니다.",
    signup_agree: "개인정보 처리방침 및 행동 강령에 동의합니다.",
    signup_btn_saving: "저장 중",
    signup_btn_signup: "가입하기",

    // ── Lobby ─────────────────────────────────────────────────────────────
    lobby_heading: "이스케이프룸",
    lobby_desc: "방을 선택하여 퍼즐을 풀어보세요",
    lobby_empty: "등록된 방이 없습니다.",
    lobby_difficulty: "난이도",

    // ── Room ──────────────────────────────────────────────────────────────
    room_success_heading: "탈출 성공!",
    room_success_desc: "모든 퍼즐을 해결했습니다!",

    // ── Puzzle ────────────────────────────────────────────────────────────
    puzzle_wrong: "틀렸습니다. 다시 시도해보세요.",
    puzzle_solved: "퍼즐 해결! ",
    puzzle_placeholder: "정답을 입력하세요",
    puzzle_confirm: "확인",
    puzzle_hint: "힌트",
    hint_label: " 힌트",

    // ── Admin Test Modal ──────────────────────────────────────────────────
    admin_test_heading: "신규 가입자 관리자 테스트",
    admin_test_desc:
      "본 테스트는 신규 가입자의 사내 보안 정책 이해도를 확인하기 위한 필수 과정입니다. 모든 문항을 선택한 뒤 제출하면 통과 여부에 따라 관리자 페이지 접근이 처리됩니다.",
    admin_hint_text:
      "규칙 탭의 행동 수칙을 기준으로 답변하십시오. 통과 시 보안 관리자 페이지로 자동 접속됩니다.",
    admin_submit: "제출하기",
    admin_error_incomplete: "모든 항목을 선택해야 관리자 테스트를 제출할 수 있습니다.",
    admin_error_failed: "관리자 접근 테스트를 통과하지 못했습니다. 규정 탭을 다시 확인하십시오.",

    // ── Footer ────────────────────────────────────────────────────────────
    footer_company_info: "회사 정보",
    footer_contact: "문의하기",

    // ── News Detail ───────────────────────────────────────────────────────
    news_detail_work_details: "작업 세부 사항",
    news_detail_share: "공유",
    news_detail_bookmark: "북마크",
  },

  en: {
    // ── Home ──────────────────────────────────────────────────────────────
    home_statement_line1: "We believe in structure.",
    home_statement_line2: "We believe in precision.",
    home_statement_line3: "In a world of noise, we engineer silence and certainty.",
    home_statement_line4: "Our methodology is brutalist; our execution is flawless.",
    home_future_body:
      "We do not predict the future. We construct it. Our architecture for the next decade is already in motion.",

    // ── About ─────────────────────────────────────────────────────────────
    about_subtitle_1: "Global Infrastructure.",
    about_subtitle_2: "Silent Excellence.",
    about_desc:
      "EG Company builds and operates core systems and infrastructure supporting international trade, logistics, and private security.",
    about_director_title: "CEO, EG Company",
    about_quote:
      "Precision is not the result of a moment, but of a process. We operate in the invisible domain, ensuring that the world's core systems never fail under any circumstances.",
    about_speech_1:
      "When I founded this organization, the goal was simple: to leave a legacy called trust. We don't move to be noticed. We move to solve problems. From a small regional logistics company to a multinational corporation — the years we've spent prove our unwavering commitment to perfection and disciplined rules.",
    about_speech_2:
      "Even in this complex 21st century, EG Company will remain an unwavering institution in operational security and industrial innovation.",
    about_speech_3: "We do not forget the past. We build the future upon it.",
    about_speech_4: "Truth always exists on the other side of observation.",
    about_evolution: "Company Evolution",

    // ── Rules ─────────────────────────────────────────────────────────────
    rules_title_line1: "Employee Conduct",
    rules_title_line2: "& Workplace Safety",
    rules_subtitle:
      "These are the basic rules of conduct and health guidelines for ensuring the safety and efficient working environment of EG Company employees. These regulations must be strictly followed according to the internal security clearance level.",
    rules_notice_label: "Notice",
    rules_notice_pre:
      "The above guidelines represent the minimum measures to ensure the safety of all employees. EG Company bears no legal responsibility for any 'existential inconsistency' or 'physical dissolution' resulting from non-compliance. All employees confirm their understanding of this document by ",
    rules_notice_btn: "signing",
    rules_notice_post: ".",

    // ── Contact ───────────────────────────────────────────────────────────
    contact_report_heading: "Report",
    contact_report_desc_1:
      "If you need to file an anonymous report to the company, or if you need assistance with any matter, please submit it here.",
    contact_report_desc_2: "It will be reviewed and forwarded to the HR team.",
    contact_placeholder: "Enter your report details here...",
    contact_send: "Send Report",
    contact_sent: "Sent ✓",

    // ── News ──────────────────────────────────────────────────────────────
    news_eyebrow: "Corporate Updates",
    news_heading: "Company News & Announcements",
    news_read_full: "Read Full Report →",

    // ── Information ───────────────────────────────────────────────────────
    info_heading: "Company Information",
    info_label_name: "Company Name",
    info_label_ceo: "CEO",
    info_label_brn: "Business Registration Number",
    info_label_phone: "Phone",
    info_label_fax: "Fax",
    info_label_email: "Email",
    info_label_address: "Address",
    info_address:
      "44F, Tower E, Iville Building, 52 Sarangguk-ro, Jongno-gu, Seoul, Republic of Korea",

    // ── HR ────────────────────────────────────────────────────────────────
    hr_eyebrow: "Department / Human Resources",
    hr_heading: "Human Resources.",
    hr_desc:
      "We engineer the corporate ecosystem where talent meets performance. Our focus is on growth, inclusivity, and creating a sustainable workplace environment.",
    hr_strategic_overview: "Strategic Overview",
    hr_card1_title: "Labor Relations",
    hr_card1_desc: "Building strong relationships through transparent communication and fair practices.",
    hr_card2_title: "Employee Welfare",
    hr_card2_desc: "Prioritizing the mental and physical well-being of every team member.",
    hr_card3_title: "Organizational Dev",
    hr_card3_desc: "Evolving our structure to meet the challenges of a dynamic global market.",
    hr_culture_heading: "Company Culture & Values",
    hr_culture_desc:
      "Our culture is the backbone of everything we do. It's built on trust, collaboration, and relentless innovation. We believe in empowering individuals to bring their authentic selves to work every single day.",
    hr_learn_more: "Learn More",
    hr_career_heading: "Career Development",
    hr_career_1_level: "Entry Level",
    hr_career_1_role: "Junior Analyst",
    hr_career_2_level: "Mid Level",
    hr_career_2_role: "Senior Strategist",
    hr_career_3_level: "Management",
    hr_career_3_role: "Team Lead",
    hr_career_4_level: "Executive",
    hr_career_4_role: "Director",
    hr_exp_heading: "Employee Experience",
    hr_t1_quote: "The support system here is unparalleled. Every day is an opportunity to grow.",
    hr_t1_role: "HR Manager",
    hr_t2_quote: "I love the freedom to innovate our hiring processes and the culture of trust.",
    hr_t2_role: "Tech Recruiter",
    hr_touch_heading: "Get in Touch.",
    hr_location_1: "Corporate Headquarters",
    hr_location_3: "Seoul, Republic of Korea",
    hr_cta_btn: "Work with us",

    // ── Login ─────────────────────────────────────────────────────────────
    login_email_label: "Corporate Email",
    login_password_label: "Password",
    login_btn_checking: "Checking",
    login_btn_signin: "Sign In",
    login_no_account: "No account yet?",
    login_request_access: "Request corporate access",

    // ── Signup ────────────────────────────────────────────────────────────
    signup_name_label: "Full Name",
    signup_email_label: "Corporate Email",
    signup_password_label: "Password",
    signup_privacy_title: "Personal Information Collection & Use Agreement",
    signup_privacy_section1_title: "1. Items Collected",
    signup_privacy_section1_body: "Nickname, email address, password",
    signup_privacy_section2_title: "2. Purpose of Collection & Use",
    signup_privacy_section2_body1: "Member identification and login functionality",
    signup_privacy_section2_body2: "Service use and content progression (game progress, result storage, etc.)",
    signup_privacy_section2_body3: "Inquiry response and notification delivery",
    signup_privacy_section3_title: "3. Retention Period",
    signup_privacy_section3_body1: "Retained until membership withdrawal",
    signup_privacy_section3_body2: "Destroyed without delay upon withdrawal",
    signup_privacy_section4_title: "4. Right to Refuse Consent",
    signup_privacy_section4_body1: "Users have the right to refuse consent to the collection and use of personal information.",
    signup_privacy_section4_body2: "However, refusal may restrict membership registration and service use.",
    signup_privacy_section5_title: "5. Privacy Protection Measures",
    signup_privacy_section5_body: "Passwords are stored in encrypted form.",
    signup_conduct_title: "EG Code of Conduct",
    signup_conduct_1:
      "By accessing the EG monolith system, all employees agree to adhere to the strictest standards of corporate integrity and data security. Any breach of protocol, unauthorized access to restricted partitions, or failure to report anomalies will result in immediate termination of access rights.",
    signup_conduct_2:
      "Usage of proprietary algorithms and data structures for non-corporate purposes is prohibited. All operational activity may be audited for compliance and system safety.",
    signup_agree: "I acknowledge and agree to the privacy policy and code of conduct.",
    signup_btn_saving: "Saving",
    signup_btn_signup: "Sign Up",

    // ── Lobby ─────────────────────────────────────────────────────────────
    lobby_heading: "Escape Room",
    lobby_desc: "Select a room to solve puzzles",
    lobby_empty: "No rooms registered.",
    lobby_difficulty: "Difficulty",

    // ── Room ──────────────────────────────────────────────────────────────
    room_success_heading: "Escape Success!",
    room_success_desc: "You solved all puzzles!",

    // ── Puzzle ────────────────────────────────────────────────────────────
    puzzle_wrong: "Incorrect. Please try again.",
    puzzle_solved: "Puzzle Solved!",
    puzzle_placeholder: "Enter your answer",
    puzzle_confirm: "Confirm",
    puzzle_hint: "Hint",
    hint_label: " Hint",

    // ── Admin Test Modal ──────────────────────────────────────────────────
    admin_test_heading: "New User Administrator Test",
    admin_test_desc:
      "This test is a mandatory process to verify the security policy comprehension of new employees. Once all questions are answered and submitted, administrator page access will be determined based on the result.",
    admin_hint_text:
      "Answer based on the conduct guidelines in the Rules tab. Upon passing, you will be automatically redirected to the security administrator page.",
    admin_submit: "Submit",
    admin_error_incomplete: "All items must be selected to submit the administrator test.",
    admin_error_failed:
      "You did not pass the administrator access test. Please review the Rules tab again.",

    // ── Footer ────────────────────────────────────────────────────────────
    footer_company_info: "Company Information",
    footer_contact: "Contact Us",

    // ── News Detail ───────────────────────────────────────────────────────
    news_detail_work_details: "Work Details",
    news_detail_share: "Share",
    news_detail_bookmark: "Bookmark",
  },
} as const;

type TranslationKey = keyof (typeof translations)["ko"];

export function t(key: TranslationKey, lang: Language): string {
  return translations[lang][key];
}
