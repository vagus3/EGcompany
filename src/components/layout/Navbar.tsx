"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/about", label: "About Us" },
  { href: "/rules", label: "Rules" },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <nav className="max-w-5xl mx-auto px-6 h-14 grid grid-cols-3 items-center">
        {/* Left: Logo */}
        <Link href="/" className="text-sm font-bold tracking-widest text-black uppercase">
          EG Company
        </Link>

        {/* Center: Nav links */}
        <ul className="flex items-center justify-center gap-8">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-sm transition-colors ${
                    active
                      ? "text-black font-medium border-b-2 border-black pb-0.5"
                      : "text-gray-500 hover:text-black"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right: empty spacer for balance */}
        <div />
      </nav>
    </header>
  );
}
