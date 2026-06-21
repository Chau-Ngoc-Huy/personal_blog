import { SiteFooter } from "blog-scaffold";

export function Default() {
  return (
    <SiteFooter
      profile={{
        displayName: "Doan Arlo",
        email: "hello@doanarlo.com",
        socialLinks: JSON.stringify({
          youtube: "https://youtube.com/@doanarlo",
          instagram: "https://instagram.com/doanarlo",
          linkedin: "https://linkedin.com/in/doanarlo",
          x: "https://x.com/doanarlo",
        }),
      }}
    />
  );
}

export function Minimal() {
  return (
    <SiteFooter
      profile={{
        displayName: "Mai Linh",
        email: null,
        socialLinks: null,
      }}
    />
  );
}
