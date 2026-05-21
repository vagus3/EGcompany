import SignUpForm from "./SignUpForm";

export default function Page() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 sm:py-24 md:py-36">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-[clamp(3.5rem,18vw,8rem)] leading-none font-black tracking-normal text-black uppercase">
          Sign Up
        </h1>
        <SignUpForm />
      </div>
    </section>
  );
}
