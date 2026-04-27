"use client";

import { useEffect, useRef, useState } from "react";
import type { Heading } from "@/lib/utils";

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    const ids = headings.map((h) => h.id);

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          // pick the topmost visible heading
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
      className="hidden xl:block"
      style={{
        width: "260px",
        flexShrink: 0,
        position: "sticky",
        top: "2rem",
        alignSelf: "flex-start",
        maxHeight: "calc(100vh - 4rem)",
        overflowY: "auto",
      }}
    >
      <div
        className="bg-[#F9F6F3] rounded-[20px] p-6"
      >
          <p
            className="font-sans text-[#1B1624] mb-4"
            style={{ fontSize: "0.875rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}
          >
            In this article:
          </p>
          <nav>
            <ul className="space-y-1">
              {headings.map((h) => (
                <li key={h.id} style={{ paddingLeft: h.level === 3 ? "0.75rem" : 0 }}>
                  <a
                    href={`#${h.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                      setActiveId(h.id);
                    }}
                    className="block font-sans transition-colors duration-150 rounded-lg px-2 py-1"
                    style={{
                      fontSize: "0.875rem",
                      lineHeight: 1.5,
                      fontWeight: activeId === h.id ? 600 : 400,
                      color: activeId === h.id ? "#1B1624" : "#76737C",
                      background: activeId === h.id ? "#FDD46B" : "transparent",
                      textDecoration: "none",
                    }}
                  >
                    {h.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
    </aside>
  );
}
