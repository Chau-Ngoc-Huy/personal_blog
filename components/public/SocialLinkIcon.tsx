import SocialIcon from "./SocialIcon";

type SocialIconName = Parameters<typeof SocialIcon>[0]["name"];

export default function SocialLinkIcon({
  href,
  label,
  name,
  className = "",
  iconClassName = "h-5 w-5",
}: {
  href: string;
  label: string;
  name: SocialIconName;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("mailto") ? undefined : "_blank"}
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className={className}
    >
      <SocialIcon name={name} className={iconClassName} />
      <span className="sr-only">{label}</span>
    </a>
  );
}
