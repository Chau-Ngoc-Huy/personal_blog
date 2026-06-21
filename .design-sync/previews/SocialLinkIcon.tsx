import { SocialLinkIcon } from "blog-scaffold";

const CHIP =
  "inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#ECE5E1] text-[#060C39]";

export function Row() {
  return (
    <div style={{ display: "flex", gap: 16, padding: 32, background: "#F9F6F3" }}>
      <SocialLinkIcon
        href="https://youtube.com/@doanarlo"
        label="YouTube"
        name="youtube"
        className={CHIP}
        iconClassName="h-5 w-5"
      />
      <SocialLinkIcon
        href="https://instagram.com/doanarlo"
        label="Instagram"
        name="instagram"
        className={CHIP}
        iconClassName="h-5 w-5"
      />
      <SocialLinkIcon
        href="https://linkedin.com/in/doanarlo"
        label="LinkedIn"
        name="linkedin"
        className={CHIP}
        iconClassName="h-5 w-5"
      />
      <SocialLinkIcon
        href="https://x.com/doanarlo"
        label="X"
        name="x"
        className={CHIP}
        iconClassName="h-5 w-5"
      />
      <SocialLinkIcon
        href="mailto:hello@doanarlo.com"
        label="Email"
        name="email"
        className={CHIP}
        iconClassName="h-5 w-5"
      />
    </div>
  );
}

export function SingleLabeled() {
  return (
    <div style={{ display: "flex", alignItems: "center", padding: 40, background: "#FFFFFF" }}>
      <SocialLinkIcon
        href="https://linkedin.com/in/doanarlo"
        label="LinkedIn"
        name="linkedin"
        className={CHIP}
        iconClassName="h-5 w-5"
      />
    </div>
  );
}
