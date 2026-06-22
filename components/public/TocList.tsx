"use client";

import { useState } from "react";
import { tocItemClasses, type Heading } from "@/lib/utils";

interface TocListProps {
  headings: Heading[];
  /** Index of the heading currently in view (−1 for none). */
  activeIndex: number;
  /** Scroll to / select the heading at `index`. */
  onNavigate: (index: number) => void;
  /** When provided, items render as <a href> (real anchors); otherwise <button>. */
  hrefFor?: (index: number) => string;
}

/**
 * A collapsible table-of-contents tree built from a flat heading list. A
 * heading "owns" the following headings of deeper level until the next heading
 * of equal/shallower level; its chevron collapses that whole subtree.
 *
 * Shared by the public <TableOfContents> and the admin <EditorToc> — collapse
 * state is keyed by array index and lives here, so each TOC manages its own.
 */
export default function TocList({ headings, activeIndex, onNavigate, hrefFor }: TocListProps) {
  const [collapsed, setCollapsed] = useState<Set<number>>(new Set());

  const toggle = (i: number) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  // A heading has children when the next heading sits at a deeper level.
  const hasChildren = headings.map(
    (h, i) => i + 1 < headings.length && headings[i + 1].level > h.level
  );

  // Single pass: hide everything deeper than a collapsed heading until we reach
  // a heading at the same/shallower level (handles arbitrary nesting).
  const visible: boolean[] = [];
  let hideUntil: number | null = null;
  headings.forEach((h, i) => {
    if (hideUntil !== null && h.level > hideUntil) {
      visible[i] = false;
      return;
    }
    hideUntil = null;
    visible[i] = true;
    if (collapsed.has(i) && hasChildren[i]) hideUntil = h.level;
  });

  return (
    <ul className="space-y-0.5" style={{ overflowWrap: "anywhere" }}>
      {headings.map((h, i) => {
        if (!visible[i]) return null;
        const active = i === activeIndex;
        const isCollapsed = collapsed.has(i);
        const labelClass = `block min-w-0 flex-1 rounded-lg px-2.5 py-1.5 leading-[1.5] transition-colors ${tocItemClasses(
          h.level,
          active
        )}`;
        return (
          <li key={i} style={{ paddingLeft: `${(h.level - 1) * 0.875}rem` }}>
            <div className="flex items-stretch gap-0.5">
              {/* chevron column (reserved width keeps leaf labels aligned) */}
              <span className="flex w-[20px] flex-none items-center justify-center">
                {hasChildren[i] && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggle(i);
                    }}
                    aria-expanded={!isCollapsed}
                    aria-label={isCollapsed ? "Mở rộng" : "Thu gọn"}
                    className="flex h-5 w-5 items-center justify-center rounded text-[#8C9496] transition-colors hover:bg-[#E1E7E7] hover:text-[#14181A]"
                  >
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`transition-transform duration-150 ${isCollapsed ? "" : "rotate-90"}`}
                    >
                      <path d="m9 6 6 6-6 6" />
                    </svg>
                  </button>
                )}
              </span>

              {hrefFor ? (
                <a
                  href={hrefFor(i)}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(i);
                  }}
                  className={`${labelClass} no-underline`}
                >
                  {h.text}
                </a>
              ) : (
                <button type="button" onClick={() => onNavigate(i)} className={`${labelClass} text-left`}>
                  {h.text}
                </button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
