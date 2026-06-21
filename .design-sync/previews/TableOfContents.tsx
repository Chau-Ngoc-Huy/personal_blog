import { TableOfContents } from "blog-scaffold";

// TableOfContents renders an `<aside className="hidden xl:block">` — a desktop-only
// sidebar that is display:none below the xl (1280px) breakpoint. The preview frame
// forces it visible so the card renders at any width (the render check screenshots
// at 1200px, just under xl). This is presentation-only; the component is unchanged.
const FORCE_VISIBLE = ".toc-frame aside{display:block !important}";

export function Default() {
  return (
    <div className="toc-frame" style={{ padding: 24, background: "#FFFFFF", minHeight: 340 }}>
      <style>{FORCE_VISIBLE}</style>
      <TableOfContents
        headings={[
          { id: "the-problem-with-monday", text: "The problem with Monday", level: 2 },
          { id: "the-twenty-minute-pass", text: "The twenty-minute pass", level: 2 },
          { id: "step-one-clear-the-deck", text: "Step one: clear the deck", level: 3 },
          { id: "step-two-pick-three", text: "Step two: pick three", level: 3 },
          { id: "what-i-stopped-doing", text: "What I stopped doing", level: 2 },
          { id: "a-template-to-steal", text: "A template to steal", level: 3 },
        ]}
      />
    </div>
  );
}

export function Short() {
  return (
    <div className="toc-frame" style={{ padding: 24, background: "#FFFFFF", minHeight: 200 }}>
      <style>{FORCE_VISIBLE}</style>
      <TableOfContents
        headings={[
          { id: "why-i-write-every-morning", text: "Why I write every morning", level: 2 },
          { id: "the-three-page-rule", text: "The three-page rule", level: 3 },
        ]}
      />
    </div>
  );
}
