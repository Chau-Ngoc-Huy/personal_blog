import Link from "next/link";

export default function Navbar({ name }: { name: string }) {
  return (
    <header className="relative bg-[#F9F6F3] pt-3 pb-0">
      <div className="max-w-[1200px] mx-auto px-[clamp(1.25rem,4vw,3rem)]">
        <div
          className="bg-[#F9F6F3] border-b-0 flex items-center justify-between px-8 py-5"
          style={{ borderRadius: "20px 20px 0 0" }}
        >
          <Link href="/" className="flex flex-col leading-none gap-1">
            <span
              className="font-heading text-[#1B1624] tracking-tight"
              style={{ fontSize: "clamp(2rem,2.5vw,2.25rem)", fontWeight: 300 }}
            >
              {name}
            </span>
            {/* <span className="font-sans text-[#8D8A91] text-[11px] uppercase tracking-[0.18em] font-medium">
              Personal Blog
            </span> */}
          </Link>

          <nav className="flex items-center" style={{ gap: "clamp(1.5rem,2.5vw,2.5rem)" }}>
            <Link
              href="#blogs"
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
      </div>
    </header>
  );
}
