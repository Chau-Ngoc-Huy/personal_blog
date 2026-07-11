import { HeroSection } from "blog-scaffold";

export function Default() {
  return (
    <HeroSection
      profile={{
        displayName: "Doan Arlo",
        sayHi:
          "I write about productivity, learning in public, and building a calmer relationship with work. Pull up a chair and a coffee — I'm glad you're here.",
        avatar: null,
      }}
    />
  );
}

export function NoTagline() {
  return (
    <HeroSection
      profile={{
        displayName: "Mai Linh",
        sayHi: null,
        avatar: null,
      }}
    />
  );
}
