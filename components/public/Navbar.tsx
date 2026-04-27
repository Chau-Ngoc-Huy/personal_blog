"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar({ name, transparent }: { name: string; transparent?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className={`relative ${transparent ? "bg-transparent" : "bg-[#FAF8F3]"}`} style={{ paddingTop: "var(--navbar-py)" }}>
      <div className="max-w-[1400px] mx-auto" style={{ paddingLeft: "var(--page-px)", paddingRight: "var(--page-px)" }}>
        <div
          className="bg-transparent border-b-0 flex items-center justify-between"
        >
          <Link href="/" className="flex flex-col leading-none gap-1">
            <span
              className="font-heading text-[#1B1624] tracking-tight"
              style={{ fontSize: "clamp(2rem,2.5vw,2.25rem)", fontWeight: 300 }}
            >
              {name}
            </span>
          </Link>

          {/* Hamburger Icon */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex flex-col gap-1.5 cursor-pointer"
            aria-label="Toggle menu"
          >
            <span className={`w-6 h-0.5 bg-[#54505B] transition-all ${isOpen ? "rotate-45 translate-y-2" : ""}`}></span>
            <span className={`w-6 h-0.5 bg-[#54505B] transition-all ${isOpen ? "opacity-0" : ""}`}></span>
            <span className={`w-6 h-0.5 bg-[#54505B] transition-all ${isOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center" style={{ gap: "clamp(1.5rem,2.5vw,2.5rem)" }}>
            <Link
              href="/blogs"
              className="font-sans text-[#54505B] hover:text-[#1B1624] transition-colors duration-150 font-medium"
              style={{ fontSize: "clamp(0.875rem,0.875rem + ((1vw - 0.2rem) * 0.227),1rem)" }}
            >
              Blogs
            </Link>
            <Link
              href="#about"
              className="font-sans text-[#54505B] hover:text-[#1B1624] transition-colors duration-150 font-medium"
              style={{ fontSize: "clamp(0.875rem,0.875rem + ((1vw - 0.2rem) * 0.227),1rem)" }}
            >
              About Me
            </Link>
          </nav>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <nav className="md:hidden flex flex-col gap-3 pb-4" style={{ paddingLeft: "var(--page-px)", paddingRight: "var(--page-px)" }}>
            <Link
              href="/#blogs"
              className="font-sans text-[#54505B] hover:text-[#1B1624] transition-colors duration-150 font-medium"
              style={{ fontSize: "clamp(0.875rem,0.875rem + ((1vw - 0.2rem) * 0.227),1rem)" }}
              onClick={() => setIsOpen(false)}
            >
              Blogs
            </Link>
            <Link
              href="#about"
              className="font-sans text-[#54505B] hover:text-[#1B1624] transition-colors duration-150 font-medium"
              style={{ fontSize: "clamp(0.875rem,0.875rem + ((1vw - 0.2rem) * 0.227),1rem)" }}
              onClick={() => setIsOpen(false)}
            >
              About Me
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
