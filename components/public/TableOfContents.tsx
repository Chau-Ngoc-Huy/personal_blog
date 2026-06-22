"use client";

import { useEffect, useRef, useState } from "react";
import { type Heading } from "@/lib/utils";
import TocList from "./TocList";

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);
  const activeIndex = headings.findIndex((h) => h.id === activeId);

  const goTo = (i: number) => {
    const h = headings[i];
    if (!h) return;
    document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(h.id);
  };

  useEffect(() => {
    if (headings.length === 0) return;

    const ids = headings.map((h) => h.id);

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0 }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observerRef.current!.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <aside
      className="hidden shrink-0 xl:block"
      style={{
        width: "260px",
        position: "sticky",
        top: "2rem",
        alignSelf: "flex-start",
        maxHeight: "calc(100vh - 4rem)",
        overflowY: "auto",
      }}
    >
      <div className="rounded-[20px] bg-[#F5F7F7] p-6">
        <p className="mb-4 text-[12px] font-bold uppercase tracking-[0.08em] text-[#586063]">
          Trong bài viết này
        </p>
        <nav>
          <TocList
            headings={headings}
            activeIndex={activeIndex}
            onNavigate={goTo}
            hrefFor={(i) => `#${headings[i].id}`}
          />
        </nav>
      </div>
    </aside>
  );
}
