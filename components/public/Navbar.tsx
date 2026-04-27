import Link from "next/link";

export default function Navbar({ name }: { name: string }) {
  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F3] pt-3 pb-1">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white border border-stone-200 rounded-2xl px-6 py-3 flex items-center justify-between shadow-sm">
          <Link href="/" className="flex flex-col leading-none gap-0.5">
            <span className="text-sm font-bold text-stone-900 tracking-tight">{name}</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400">Personal Blog</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="#blogs"
              className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors duration-150"
            >
              Blogs
            </Link>
            <Link
              href="#about"
              className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors duration-150"
            >
              About Me
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
