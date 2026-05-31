export default function NewsPage() {
  const posts = [
    {
      date: "OCTOBER 21, 2024",
      title: "싱가포르 지역 거점 신설",
      image: "/images/news-singapore.jpg",
    },
    {
      date: "OCTOBER 19, 2024",
      title: "IT 시스템 유지보수로 인한 운영 중단",
      image: "/images/news-system.jpg",
    },
    {
      date: "NOVEMBER 28, 2024",
      title: "야간 통행 제한 구역 확대",
      image: "/images/news-restricted.jpg",
    },
    {
      date: "DECEMBER 03, 2024",
      title: "비인가 언어 패턴 감지 보고",
      image: "/images/news-monitor.jpg",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f4f4f4] text-black">
      <section className="mx-auto max-w-[960px] px-6 py-16">
        <p className="mb-5 text-[10px] font-semibold tracking-[0.35em] text-gray-400">
          CORPORATE UPDATES
        </p>

        <h1 className="mb-20 text-5xl font-medium tracking-[-0.04em]">
          Company News & Announcements
        </h1>

        <article className="mb-24">
          <img
            src="/images/news-building.jpg"
            alt="Company building"
            className="mb-6 h-[320px] w-full object-cover grayscale"
          />

          <div className="mb-4 flex items-center gap-4">
            <span className="bg-black px-3 py-1 text-[10px] font-bold tracking-[0.18em] text-white">
              CORPORATE
            </span>
            <span className="text-[10px] font-semibold tracking-[0.15em] text-gray-500">
              OCTOBER 24, 2024
            </span>
          </div>

          <h2 className="mb-5 text-2xl font-medium">
            Q3 전략 보고서: 전략적 성장, 예상 뛰어넘다
          </h2>

          <p className="mb-8 max-w-[760px] text-sm leading-7 text-gray-500">
            EG Company는 연구 및 운송 부문의 확장에 힘입어, 분기 실적이
            전년 대비 14% 상승했다고 밝혔다. 이사회는 특히 자동화 물류
            시스템의 성공적인 도입과 정착을 주요 성과로 강조했다.
          </p>

          <button className="text-[10px] font-bold tracking-[0.2em]">
            READ FULL REPORT <span className="ml-2">→</span>
          </button>
        </article>

        <div className="grid grid-cols-1 gap-x-14 gap-y-24 border-t border-gray-300 pt-14 md:grid-cols-2">
          {posts.map((post, index) => (
            <article
              key={post.title}
              className={index === 2 ? "border-t border-gray-300 pt-14 md:border-0 md:pt-0" : ""}
            >
              <img
                src={post.image}
                alt={post.title}
                className="mb-5 h-[200px] w-full object-cover grayscale"
              />

              <p className="mb-6 text-[10px] font-semibold tracking-[0.18em] text-gray-500">
                {post.date}
              </p>

              <h3 className="text-xl font-medium">{post.title}</h3>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}