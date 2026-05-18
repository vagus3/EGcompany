import LoginForm from "./LoginForm";

export default function Page() {
  return (
    <section className="bg-white px-6 py-24 md:py-36">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-[clamp(4.8rem,12vw,8rem)] leading-none font-black tracking-normal text-black uppercase">
          Sign In
        </h1>
        <LoginForm />
      </div>
    </section>
  );
}
