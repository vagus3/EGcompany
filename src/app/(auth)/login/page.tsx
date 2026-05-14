import Link from "next/link";

export default function Page() {
  return (
    <section className="bg-white px-6 py-24 md:py-36">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-[clamp(4.8rem,12vw,8rem)] leading-none font-black tracking-normal text-black uppercase">
          Sign In
        </h1>

        <form className="mt-14 space-y-12">
          <div>
            <label
              htmlFor="email"
              className="block text-[12px] font-black tracking-[0.28em] text-black uppercase"
            >
              Corporate Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              placeholder="VANCE.A@EG.COM"
              className="mt-4 w-full border-0 border-b border-black bg-transparent px-0 pb-4 text-[clamp(2.4rem,6vw,4.1rem)] leading-none font-black tracking-normal text-black uppercase outline-none placeholder:text-neutral-200 focus:border-black"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-[12px] font-black tracking-[0.28em] text-black uppercase"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="********"
              className="mt-4 w-full border-0 border-b border-black bg-transparent px-0 pb-4 text-[clamp(2.4rem,6vw,4.1rem)] leading-none font-black tracking-normal text-black uppercase outline-none placeholder:text-neutral-200 focus:border-black"
            />
          </div>

          <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
            <button
              type="submit"
              className="h-24 w-36 bg-black text-[13px] font-black tracking-[0.28em] text-white uppercase transition-colors hover:bg-neutral-800"
            >
              Sign In
            </button>
            <p className="max-w-md text-[13px] leading-7 font-black tracking-[0.2em] text-neutral-400 uppercase">
              No account yet?{" "}
              <Link href="/signup" className="text-black underline underline-offset-4">
                Request corporate access
              </Link>
              .
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
