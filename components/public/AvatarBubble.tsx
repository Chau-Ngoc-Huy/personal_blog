interface AvatarBubbleProps {
  avatar: string | null;
  displayName: string;
  /** Sizing classes for the square wrapper, e.g. "w-[clamp(260px,33vw,420px)]" or "w-full". */
  className?: string;
  /** Tailwind text-size class for the initials fallback. */
  initialsTextClassName?: string;
}

const SHEEN =
  "radial-gradient(120% 90% at 30% 12%, rgba(255,255,255,0.20), transparent 60%)";

/**
 * The portrait is rendered twice from the same source:
 *  - a "body" layer clipped to the green circle (clean round bottom + sides)
 *  - a "head" layer revealing only the upper half, so the head/shoulders spill
 *    out above the circle (works with a transparent cutout portrait).
 * Both layers share identical positioning, so they stay seamlessly aligned.
 */
const PORTRAIT_CLASS =
  "absolute bottom-0 left-1/2 h-[125%] w-[125%] max-w-none -translate-x-1/2 object-cover object-bottom";

export default function AvatarBubble({
  avatar,
  displayName,
  className = "",
  initialsTextClassName = "text-[clamp(2rem,6vw,3.5rem)]",
}: AvatarBubbleProps) {
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={`relative aspect-square ${className}`}>
      {/* decorative rings */}
      <svg
        viewBox="0 0 200 200"
        className="pointer-events-none absolute -inset-[7%] h-[114%] w-[114%] overflow-visible"
      >
        <circle cx="100" cy="100" r="88" fill="none" stroke="var(--ac)" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="150 600" transform="rotate(-58 100 100)" opacity="0.85" />
        <circle cx="100" cy="100" r="95" fill="none" stroke="var(--ac)" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="66 600" transform="rotate(128 100 100)" opacity="0.5" />
      </svg>

      {/* accent shape */}
      <div
        className="absolute bottom-[9%] right-[6%] h-[13%] w-[13%] rotate-[8deg] bg-[var(--ac)]"
        style={{ borderRadius: "6px 0 18px 0" }}
      />

      {avatar ? (
        <>
          {/* green bubble — portrait clipped to the circle (body) */}
          <div className="absolute inset-[7%] overflow-hidden rounded-full bg-[var(--ac)]">
            <div className="absolute inset-0" style={{ background: SHEEN }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={avatar} alt={displayName} className={PORTRAIT_CLASS} />
          </div>

          {/* head & shoulders spilling out above the bubble */}
          <div
            className="pointer-events-none absolute inset-[7%]"
            style={{ clipPath: "inset(-100% 0 50% 0)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={avatar} alt="" aria-hidden className={PORTRAIT_CLASS} />
          </div>
        </>
      ) : (
        <div className="absolute inset-[7%] overflow-hidden rounded-full bg-[var(--ac)]">
          <div className="absolute inset-0" style={{ background: SHEEN }} />
          <div
            className={`absolute inset-0 flex items-center justify-center font-heading font-semibold text-white ${initialsTextClassName}`}
          >
            {initials}
          </div>
        </div>
      )}
    </div>
  );
}
