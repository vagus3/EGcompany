import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Users, Heart, Briefcase, ChevronRight, Mail } from 'lucide-react';

export default function HumanResourcesPage() {
  return (
    <div className="bg-white text-zinc-900 font-sans">
      {/* 1. Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-sm font-semibold tracking-widest uppercase text-zinc-500 mb-4">Department / Human Resources</p>
          <h1 className="text-6xl font-bold leading-tight mb-6">
            Human<br />Resources.
          </h1>
          <p className="text-zinc-600 text-lg leading-relaxed max-w-md">
            We engineer the corporate ecosystem where talent meets performance. 
            Our focus is on growth, inclusivity, and creating a sustainable workplace environment.
          </p>
        </div>
        <div className="relative h-400px w-full bg-zinc-100 overflow-hidden grayscale">
          {/* 실제 이미지 경로로 수정 필요 */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-80" />
        </div>
      </section>

      {/* 2. Strategic Overview */}
      <section className="bg-zinc-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-12">Strategic Overview</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Users className="w-6 h-6" />, title: "Labor Relations", desc: "Building strong relationships through transparent communication and fair practices." },
              { icon: <Heart className="w-6 h-6" />, title: "Employee Welfare", desc: "Prioritizing the mental and physical well-being of every team member." },
              { icon: <Briefcase className="w-6 h-6" />, title: "Organizational Dev", desc: "Evolving our structure to meet the challenges of a dynamic global market." }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-10 border border-zinc-200 hover:shadow-lg transition-shadow">
                <div className="mb-6 text-zinc-400">{item.icon}</div>
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-zinc-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Company Culture & Values */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
        <div className="relative h-500px grayscale">
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80')] bg-cover bg-center" />
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-8">Company Culture & Values</h2>
          <p className="text-zinc-600 text-lg leading-relaxed mb-6">
            Our culture is the backbone of everything we do. It&#39;s built on trust, 
            collaboration, and relentless innovation. We believe in empowering 
            individuals to bring their authentic selves to work every single day.
          </p>
          <button className="border-b-2 border-zinc-900 pb-1 font-bold flex items-center gap-2 hover:gap-4 transition-all">
            Learn More <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 4. Career Development */}
      <section className="bg-zinc-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-16">Career Development</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { role: "Junior Analyst", level: "Entry Level" },
              { role: "Senior Strategist", level: "Mid Level" },
              { role: "Team Lead", level: "Management" },
              { role: "Director", level: "Executive" }
            ].map((step, idx) => (
              <div key={idx} className="border-l border-zinc-700 pl-6 py-4">
                <p className="text-zinc-500 text-sm mb-2">{step.level}</p>
                <h4 className="text-xl font-semibold">{step.role}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Employee Experience */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-2xl font-bold mb-16 text-center">Employee Experience</h2>
        <div className="grid md:grid-cols-2 gap-12">
          {[
            { name: "Yara Choi", role: "HR Manager", quote: "The support system here is unparalleled. Every day is an opportunity to grow." },
            { name: "Marc Berg", role: "Tech Recruiter", quote: "I love the freedom to innovate our hiring processes and the culture of trust." }
          ].map((testimonial, idx) => (
            <div key={idx} className="flex flex-col md:flex-row bg-zinc-50 p-8 gap-8 items-center">
              <div className="w-32 h-32 rounded-full bg-zinc-300 flex-shrink-linear-0 grayscale overflow-hidden">
                <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80')] bg-cover" />
              </div>
              <div>
                <p className="italic text-zinc-600 mb-6 font-serif text-lg">&#34;{testimonial.quote}&#34;</p>
                <p className="font-bold">{testimonial.name}</p>
                <p className="text-zinc-400 text-sm">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Footer / Get in Touch */}
      <section className="bg-zinc-50 border-t border-zinc-200 py-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-12">
          <div>
            <h2 className="text-4xl font-bold mb-6">Get in Touch.</h2>
            <div className="space-y-2 text-zinc-500">
              <p>Corporate Headquarters</p>
              <p>123 Business Ave, Suite 100</p>
              <p>Seoul, Republic of Korea</p>
            </div>
          </div>
          <div className="w-full md:w-auto">
          <Link href="/HR">
            <button className="w-full md:w-auto bg-black text-white px-12 py-5 font-bold hover:bg-zinc-800 transition-colors uppercase tracking-widest text-sm">
              Work with us
            </button>
          </Link>
            <div className="mt-8 flex items-center gap-3 text-zinc-400">
              <Mail className="w-5 h-5" />
              <span>careers@corporate.com</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}