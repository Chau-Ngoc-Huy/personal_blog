"use client";

import { useEffect, useState } from "react";
import { type Heading } from "@/lib/utils";
import TocList from "@/components/public/TocList";

/**
 * Table of contents for the editor (Soạn thảo) tab — mirrors the public
 * <TableOfContents>, but the headings live inside a contenteditable managed by
 * ProseMirror and have no stable `id`. So instead of matching by id we resolve
 * targets by *position*: the Nth entry maps to the Nth <h1|h2|h3> element inside
 * `containerRef`. `extractHeadings()` and `querySelectorAll` both walk the DOM
 * in document order, so the indexes stay aligned even with duplicate titles.
 */
export default function EditorToc({
  headings,
  containerRef,
}: {
  headings: Heading[];
  containerRef: React.RefObject<HTMLElement>;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Track which heading is in view. The editor DOM mounts asynchronously and
  // changes as the user writes, so a MutationObserver rebuilds the
  // IntersectionObserver whenever headings are added/removed.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let io: IntersectionObserver | null = null;
    let raf = 0;

    const setup = () => {
      io?.disconnect();
      const els = Array.from(container.querySelectorAll<HTMLElement>("h1, h2, h3"));
      if (els.length === 0) return;
      io = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          if (visible.length > 0) {
            const idx = els.indexOf(visible[0].target as HTMLElement);
            if (idx !== -1) setActiveIndex(idx);
          }
        },
        { rootMargin: "0px 0px -70% 0px", threshold: 0 }
      );
      els.forEach((el) => io!.observe(el));
    };

    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(setup);
    };

    setup();
    const mo = new MutationObserver(schedule);
    mo.observe(container, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
      mo.disconnect();
    };
  }, [containerRef]);

  if (headings.length === 0) return null;

  const scrollTo = (i: number) => {
    const els = containerRef.current?.querySelectorAll<HTMLElement>("h1, h2, h3");
    els?.[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveIndex(i);
  };

  return (
    <aside
      className="hidden shrink-0 xl:block"
      style={{
        width: isCollapsed ? "auto" : "260px",
        position: "sticky",
        top: "84px",
        alignSelf: "flex-start",
        maxHeight: "calc(100vh - 108px)",
        overflowY: "auto",
      }}
    >
      <div className={`rounded-[12px] border border-[#E6EAEA] bg-white p-6 ${isCollapsed ? "min-w-fit" : ""}`}>
        <div className="mb-4 flex items-center justify-between gap-2">
          <p className="whitespace-nowrap text-[12px] font-bold uppercase tracking-[0.08em] text-[#586063]">
            Dàn ý
          </p>
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex h-6 w-6 items-center justify-center rounded-md transition-colors hover:bg-[#F5F7F7]"
            title={isCollapsed ? "Mở rộng" : "Thu gọn"}
          >
            <span className="text-[12px] text-[#8C9496]">
              {isCollapsed ? "▶" : "▼"}
            </span>
          </button>
        </div>
        {!isCollapsed && (
          <nav>
            <TocList headings={headings} activeIndex={activeIndex} onNavigate={scrollTo} />
          </nav>
        )}
      </div>
    </aside>
  );
}
