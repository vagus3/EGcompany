import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 py-6 mt-auto">
      <div className="max-w-5xl mx-auto px-6 flex justify-between items-center">
        <p className="text-[11px] tracking-widest text-gray-400 uppercase">
          © 2024 EG Company. Corporate Headquarters.
        </p>
        <Link
          href="/company-information"
          className="text-[11px] tracking-widest text-gray-400 uppercase hover:text-black transition-colors"
        >
          Company Information
        </Link>
      </div>
    </footer>
  );
}
