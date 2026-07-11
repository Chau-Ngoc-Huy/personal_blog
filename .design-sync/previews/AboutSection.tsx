import { AboutSection } from "blog-scaffold";

export function Default() {
  return (
    <AboutSection
      profile={{
        displayName: "Doan Arlo",
        bio:
          "I'm a writer and software engineer who fell for the slow craft of explaining hard things simply.\n" +
          "These days I write about productivity, learning in public, and building a calmer relationship with work — the stuff I wish someone had told me ten years ago.\n" +
          "When I'm away from the keyboard you'll find me with a flat white and a stack of half-read books.",
        avatar: null,
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

export function MinimalNoSocials() {
  return (
    <AboutSection
      profile={{
        displayName: "Mai Linh",
        bio: "A short and sweet bio — one paragraph about who I am and the kinds of things I like to write about here.",
        avatar: null,
        email: null,
        socialLinks: null,
      }}
    />
  );
}
