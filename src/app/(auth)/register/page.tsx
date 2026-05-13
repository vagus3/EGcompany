import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <Header />

      <section className="relative flex justify-center px-6 py-24 overflow-hidden">

        <div className="relative z-10 w-full max-w-[672px] pb-4">
          <h1 className="mb-16 text-[96px] font-black leading-none tracking-[-4.8px]">
            Sign Up
          </h1>

          <form className="flex flex-col gap-12">
            <LargeInput
              label="Full Name"
              placeholder="ALEXANDER VANCE"
              type="text"
              name="fullName"
            />

            <LargeInput
              label="Corporate Email"
              placeholder="VANCE.A@EG.COM"
              type="email"
              name="email"
            />

            <LargeInput
              label="Password"
              placeholder="••••••••"
              type="password"
              name="password"
              password
            />

            <PolicyBox />

            <div className="flex flex-col gap-8 pt-8">
              <label className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[1.5px]">
                <input
                  type="checkbox"
                  className="h-4 w-4 appearance-none border border-black bg-white checked:bg-black"
                />
                I acknowledge and agree to the privacy policy and code of conduct.
              </label>

              <div className="flex items-center gap-12">
                <button
                  type="submit"
                  className="flex h-[78px] min-w-[116px] flex-col items-center justify-center bg-black px-10 py-6 text-[11px] font-bold uppercase tracking-[2.2px] text-white"
                >
                  <span>Join</span>
                  <span>EG</span>
                </button>

                <p className="max-w-[480px] text-xs font-semibold uppercase tracking-[1.2px] text-black/40">
                  By proceeding, you agree to the{" "}
                  <Link href="/privacy" className="text-black underline">
                    Privacy Policy
                  </Link>{" "}
                  and{" "}
                  <Link href="/terms" className="text-black underline">
                    Terms
                  </Link>
                  .
                </p>
              </div>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Header() {
  return (
    <header className="h-[61px] border-b border-neutral-200 bg-neutral-50">
      <div className="mx-auto flex h-[60px] max-w-screen-2xl items-center justify-between px-12">
        <Link
          href="/"
          className="text-xl font-bold tracking-[-1px] text-neutral-900"
        >
          EG Company
        </Link>

        <nav className="flex items-center gap-12 text-sm font-medium tracking-[-0.35px] text-neutral-500">
          <Link href="/about">About</Link>
          <Link href="/services">Services</Link>
          <Link href="/news">News</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        <div className="flex items-center gap-6">
          <Link href="/login" className="text-xs font-medium text-neutral-500">
            Sign In
          </Link>
          <Link
            href="/register"
            className="rounded-sm bg-black px-4 py-1.5 text-xs font-bold text-white"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}

type LargeInputProps = {
  label: string;
  placeholder: string;
  type: string;
  name: string;
  password?: boolean;
};

function LargeInput({
  label,
  placeholder,
  type,
  name,
  password = false,
}: LargeInputProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[11px] font-bold uppercase leading-4 tracking-[1.65px]">
        {label}
      </span>

      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className={[
          "h-[71px] w-full border-0 border-b border-black bg-transparent pb-3",
          "text-5xl font-black uppercase leading-[58px] tracking-[-2.4px]",
          "placeholder:text-gray-200",
          "focus:outline-none",
          password ? "tracking-[9.6px]" : "",
        ].join(" ")}
      />
    </label>
  );
}

function PolicyBox() {
  return (
    <section className="h-48 overflow-y-scroll border border-black bg-gray-50 p-6">
      <h2 className="mb-4 text-[10px] font-bold uppercase leading-5 tracking-[1px]">
        개인정보 수집 및 이용 동의
      </h2>

      <div className="space-y-4 text-[10px] leading-5 tracking-[1px] text-gray-700">
        <div>
          <p className="font-bold">1. 수집 항목</p>
          <p>닉네임, 이메일 주소, 비밀번호</p>
        </div>

        <div>
          <p className="font-bold">2. 수집 및 이용 목적</p>
          <p>회원 식별 및 로그인 기능 제공</p>
          <p>서비스 이용 및 콘텐츠 진행 (게임 진행, 결과 저장 등)</p>
          <p>문의 대응 및 공지 전달</p>
        </div>

        <div>
          <p className="font-bold">3. 보유 및 이용 기간</p>
          <p>회원 탈퇴 시까지 보관</p>
          <p>탈퇴 시 지체 없이 파기</p>
        </div>

        <div>
          <p className="font-bold">4. 동의 거부 권리 안내</p>
          <p>
            이용자는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가
            있습니다.
          </p>
          <p>
            단, 동의를 거부할 경우 회원가입 및 서비스 이용이 제한될 수
            있습니다.
          </p>
        </div>

        <div>
          <p className="font-bold">5. 개인정보 보호 조치</p>
          <p>비밀번호는 암호화하여 저장됩니다.</p>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 py-12">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-12">
        <p className="text-[10px] uppercase leading-[15px] tracking-[1px] text-neutral-500">
          © 2026 EG Company. All rights reserved.
        </p>

        <nav className="flex gap-8 text-[10px] uppercase leading-[15px] tracking-[1px] text-neutral-500">
          <Link href="/company">Company Information</Link>
          <Link href="/contact">Contact Us</Link>
        </nav>
      </div>
    </footer>
  );
}