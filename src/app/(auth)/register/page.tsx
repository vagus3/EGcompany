import Link from "next/link";
import type { HTMLInputTypeAttribute } from "react";

const primaryNav = [
  { href: "/about", label: "Manifesto" },
  { href: "/information", label: "Collections" },
  { href: "/news", label: "Archive" },
];

const footerNav = [
  { href: "/information", label: "Privacy" },
  { href: "/rules", label: "Legal" },
  { href: "/contact", label: "Contact" },
];

function Field({
  id,
  label,
  placeholder,
  type = "text",
}: {
  id: string;
  label: string;
  placeholder: string;
  type?: HTMLInputTypeAttribute;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-3 block text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-black">
        {label}
      </span>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="w-full border-b border-black/45 bg-transparent pb-5 text-[clamp(2rem,4vw,3.2rem)] font-black uppercase tracking-[-0.04em] text-black outline-none placeholder:text-[#d8d8d8] focus:border-black"
      />
    </label>
  );
}

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#f7f5f1] text-black">
      <header className="border-b border-black/20">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-7 sm:px-8 lg:px-12">
          <Link href="/" className="text-[2.3rem] font-black leading-none tracking-[-0.08em]">
            EG
          </Link>

          <nav className="hidden items-center gap-10 md:flex lg:gap-16">
            {primaryNav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[0.85rem] font-semibold uppercase tracking-[0.22em] text-black transition-opacity hover:opacity-60"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/login"
            className="text-[0.82rem] font-semibold uppercase tracking-[0.22em] text-black transition-opacity hover:opacity-60"
          >
            Log In
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-black/20">
        <div className="pointer-events-none absolute right-[-2rem] top-[26%] hidden select-none text-[clamp(12rem,34vw,30rem)] font-black leading-none tracking-[-0.08em] text-black/[0.07] lg:block">
          JOIN
        </div>

        <div className="mx-auto flex min-h-[calc(100vh-180px)] max-w-[1440px] px-5 py-16 sm:px-8 md:py-24 lg:px-12 lg:py-32">
          <div className="w-full max-w-[760px] lg:ml-[20%]">
            <div className="max-w-[520px]">
              <h1 className="text-[clamp(4.2rem,10vw,7.4rem)] font-black leading-[0.92] tracking-[-0.08em] text-black">
                Onboard
              </h1>
              <p className="mt-6 max-w-[32rem] text-[1.45rem] leading-[1.45] text-black/55 [font-family:Georgia,serif]">
                Access the corporate monolith. Precision required for all employee
                entries.
              </p>
            </div>

            <form className="mt-16 space-y-12 sm:mt-20 sm:space-y-14">
              <Field
                id="full-name"
                label="Full Name"
                placeholder="Alexander Vance"
              />

              <Field
                id="corporate-email"
                label="Corporate Email"
                placeholder="vance.a@eg.com"
                type="email"
              />

              <div className="grid gap-12 md:grid-cols-2 md:gap-10">
                <Field
                  id="password"
                  label="Password"
                  placeholder="........"
                  type="password"
                />
                <Field
                  id="employee-id"
                  label="Employee ID"
                  placeholder="EG-0992-X"
                />
              </div>

              <div className="flex flex-col gap-8 pt-5 md:flex-row md:items-end md:gap-8">
                <button
                  type="button"
                  className="inline-flex h-[5rem] w-[11rem] items-center justify-center bg-black px-6 text-center text-[0.95rem] font-semibold uppercase tracking-[0.24em] text-white transition-transform hover:-translate-y-0.5"
                >
                  <span className="leading-[1.2]">
                    Sign
                    <br />
                    Up
                  </span>
                </button>

                <p className="max-w-[28rem] pb-2 text-[0.86rem] font-semibold uppercase leading-[1.45] tracking-[0.18em] text-black/35">
                  By proceeding, you adhere to the{" "}
                  <Link
                    href="/rules"
                    className="text-black underline decoration-black underline-offset-4 transition-opacity hover:opacity-60"
                  >
                    EG code of conduct.
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-[1440px] flex-col gap-5 px-5 py-12 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
        <p className="text-[0.74rem] font-semibold uppercase tracking-[0.28em] text-black">
          (c) 2024 EG Monolith. All rights reserved.
        </p>

        <div className="flex items-center gap-8 sm:gap-10">
          {footerNav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[0.72rem] font-medium uppercase tracking-[0.3em] text-black/45 transition-opacity hover:opacity-70"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </footer>
    </main>
  );
}
