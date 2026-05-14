import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11px] tracking-widest text-gray-400 uppercase">
          © 2024 EG Company. Corporate Headquarters.
        </p>
        <div className="flex items-center gap-10">
          <Link
            href="/information"
            className="text-[11px] uppercase tracking-widest text-gray-400 transition-colors hover:text-black"
          >
            Company Information
          </Link>
          <Link
            href="/contact"
            className="text-[11px] uppercase tracking-widest text-gray-400 transition-colors hover:text-black"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  );
}
