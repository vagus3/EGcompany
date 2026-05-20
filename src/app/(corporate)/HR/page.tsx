import Link from "next/link";
import { Users, Heart, Briefcase, ChevronRight, Mail } from "lucide-react";

export default function Page() {
  return (
    <div className="bg-white font-sans text-zinc-900">
      {/* 1. Hero Section */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:gap-12 md:py-20">
        <div>
          <p className="mb-4 text-sm font-semibold tracking-widest text-zinc-500 uppercase">
            Department / Human Resources
          </p>
          <h1 className="mb-6 text-[clamp(3rem,14vw,3.75rem)] leading-tight font-bold">
            Human
            <br />
            Resources.
          </h1>
          <p className="max-w-md text-lg leading-relaxed text-zinc-600">
            We engineer the corporate ecosystem where talent meets performance. Our focus is on
            growth, inclusivity, and creating a sustainable workplace environment.
          </p>
        </div>
        <div className="relative h-72 w-full overflow-hidden bg-zinc-100 grayscale sm:h-96">
          {/* 실제 이미지 경로로 수정 필요 */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-80" />
        </div>
      </section>

      {/* 2. Strategic Overview */}
      <section className="bg-zinc-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="mb-12 text-2xl font-bold">Strategic Overview</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <Users className="h-6 w-6" />,
                title: "Labor Relations",
                desc: "Building strong relationships through transparent communication and fair practices.",
              },
              {
                icon: <Heart className="h-6 w-6" />,
                title: "Employee Welfare",
                desc: "Prioritizing the mental and physical well-being of every team member.",
              },
              {
                icon: <Briefcase className="h-6 w-6" />,
                title: "Organizational Dev",
                desc: "Evolving our structure to meet the challenges of a dynamic global market.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-lg sm:p-10"
              >
                <div className="mb-6 text-zinc-400">{item.icon}</div>
                <h3 className="mb-4 text-xl font-bold">{item.title}</h3>
                <p className="leading-relaxed text-zinc-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Company Culture & Values */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:gap-16 md:py-24">
        <div className="relative h-80 grayscale sm:h-[500px]">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80')] bg-cover bg-center" />
        </div>
        <div>
          <h2 className="mb-8 text-3xl font-bold">Company Culture & Values</h2>
          <p className="mb-6 text-lg leading-relaxed text-zinc-600">
            Our culture is the backbone of everything we do. It&#39;s built on trust, collaboration,
            and relentless innovation. We believe in empowering individuals to bring their authentic
            selves to work every single day.
          </p>
          <button className="flex items-center gap-2 border-b-2 border-zinc-900 pb-1 font-bold transition-all hover:gap-4">
            Learn More <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* 4. Career Development */}
      <section className="bg-zinc-900 py-16 text-white sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="mb-16 text-2xl font-bold">Career Development</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {[
              { role: "Junior Analyst", level: "Entry Level" },
              { role: "Senior Strategist", level: "Mid Level" },
              { role: "Team Lead", level: "Management" },
              { role: "Director", level: "Executive" },
            ].map((step, idx) => (
              <div key={idx} className="border-l border-zinc-700 py-4 pl-6">
                <p className="mb-2 text-sm text-zinc-500">{step.level}</p>
                <h4 className="text-xl font-semibold">{step.role}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Employee Experience */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <h2 className="mb-16 text-center text-2xl font-bold">Employee Experience</h2>
        <div className="grid gap-12 md:grid-cols-2">
          {[
            {
              name: "Yara Choi",
              role: "HR Manager",
              quote:
                "The support system here is unparalleled. Every day is an opportunity to grow.",
            },
            {
              name: "Marc Berg",
              role: "Tech Recruiter",
              quote:
                "I love the freedom to innovate our hiring processes and the culture of trust.",
            },
          ].map((testimonial, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center gap-6 bg-zinc-50 p-6 sm:p-8 md:flex-row md:gap-8"
            >
              <div className="flex-shrink-linear-0 h-32 w-32 overflow-hidden rounded-full bg-zinc-300 grayscale">
                <div className="h-full w-full bg-[url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80')] bg-cover" />
              </div>
              <div>
                <p className="mb-6 font-serif text-lg text-zinc-600 italic">
                  &#34;{testimonial.quote}&#34;
                </p>
                <p className="font-bold">{testimonial.name}</p>
                <p className="text-sm text-zinc-400">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Footer / Get in Touch */}
      <section className="border-t border-zinc-200 bg-zinc-50 py-16 sm:py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-10 px-4 sm:px-6 md:flex-row md:gap-12">
          <div>
            <h2 className="mb-6 text-4xl font-bold">Get in Touch.</h2>
            <div className="space-y-2 text-zinc-500">
              <p>Corporate Headquarters</p>
              <p>123 Business Ave, Suite 100</p>
              <p>Seoul, Republic of Korea</p>
            </div>
          </div>
          <div className="w-full md:w-auto">
            <Link href="/HR">
              <button className="w-full bg-black px-12 py-5 text-sm font-bold tracking-widest text-white uppercase transition-colors hover:bg-zinc-800 md:w-auto">
                Work with us
              </button>
            </Link>
            <div className="mt-8 flex items-center gap-3 text-zinc-400">
              <Mail className="h-5 w-5" />
              <span>careers@corporate.com</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
