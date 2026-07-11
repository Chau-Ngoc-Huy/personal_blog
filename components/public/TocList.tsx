"use client";

import { tocItemClasses, type Heading } from "@/lib/utils";

interface TocListProps {
  headings: Heading[];
  activeIndex: number;
  onNavigate: (index: number) => void;
  hrefFor?: (index: number) => string;
}

export default function TocList({ headings, activeIndex, onNavigate, hrefFor }: TocListProps) {
  return (
    <ul className="space-y-0.5">
      {headings.map((h, i) => {
        const active = i === activeIndex;
        const labelClass = `block min-w-0 w-full rounded-lg px-2.5 py-1.5 leading-[1.5] transition-colors ${tocItemClasses(h.level, active)} ${active ? "line-clamp-2" : "truncate"}`;
        return (
          <li key={i} style={{ paddingLeft: `${(h.level - 1) * 0.875}rem` }}>
            {hrefFor ? (
              <a
                href={hrefFor(i)}
                title={h.text}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(i);
                }}
                className={`${labelClass} no-underline`}
              >
                {h.text}
              </a>
            ) : (
              <button
                type="button"
                title={h.text}
                onClick={() => onNavigate(i)}
                className={`${labelClass} text-left`}
              >
                {h.text}
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
