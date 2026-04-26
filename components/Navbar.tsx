"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#4f8a3c]/20 dark:border-[#81bb67]/20 bg-[#f4faef]/85 dark:bg-[#0e1a11]/85 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-xl border border-[#66a64c]/30 dark:border-[#8ecb73]/35 bg-[#66a64c]/15 dark:bg-[#89c66f]/15 flex items-center justify-center text-lg">🌿</span>
          <span className="serif text-xl text-[#16321f] dark:text-[#e6f4df]">ShambaSmart</span>
        </Link>

        <nav className="ml-auto flex items-center gap-1.5 sm:gap-2.5">
          <Link
            href="/diseases"
            className="hidden sm:inline-flex mono text-[11px] sm:text-xs tracking-[.08em] uppercase px-3 sm:px-4 py-2 rounded-xl border border-[#4f8a3c]/30 dark:border-[#8ecb73]/35 text-[#204027] dark:text-[#d9ead2] hover:bg-[#66a64c]/10 dark:hover:bg-[#89c66f]/15 transition-colors"
          >
            Disease Check
          </Link>
          <ThemeToggle />
        </nav>
      </div>

      <div className="sm:hidden border-t border-[#4f8a3c]/15 dark:border-[#81bb67]/20 px-4 pb-3">
        <div className="flex items-center gap-2 pt-3 flex-wrap">
          <Link
            href="/diseases"
            className="mono text-[11px] tracking-[.08em] uppercase px-3 py-2 rounded-xl border border-[#4f8a3c]/30 dark:border-[#8ecb73]/35 text-[#204027] dark:text-[#d9ead2] hover:bg-[#66a64c]/10 dark:hover:bg-[#89c66f]/15 transition-colors"
          >
            Disease Check
          </Link>
        </div>
      </div>
    </header>
  );
}