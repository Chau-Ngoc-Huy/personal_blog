import { SocialIcon } from "blog-scaffold";

const NAMES = ["youtube", "instagram", "linkedin", "tiktok", "x", "facebook", "email"] as const;

export function Gallery() {
  return (
    <div
      style={{ display: "flex", flexWrap: "wrap", gap: 20, padding: 32, background: "#F9F6F3" }}
    >
      {NAMES.map((n) => (
        <div
          key={n}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: 92 }}
        >
          <span
            className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#ECE5E1] text-[#1B1624]"
          >
            <SocialIcon name={n} className="h-6 w-6" />
          </span>
          <span className="font-sans text-[#76737C]" style={{ fontSize: 12 }}>
            {n}
          </span>
        </div>
      ))}
    </div>
  );
}

export function Sizes() {
  return (
    <div
      className="text-[#1B1624]"
      style={{ display: "flex", alignItems: "center", gap: 28, padding: 32, background: "#FFFFFF" }}
    >
      <SocialIcon name="youtube" className="h-4 w-4" />
      <SocialIcon name="youtube" className="h-6 w-6" />
      <SocialIcon name="youtube" className="h-8 w-8" />
      <SocialIcon name="youtube" className="h-12 w-12" />
    </div>
  );
}
