import { AuthorBox } from "blog-scaffold";

export function Default() {
  return (
    <div style={{ padding: 32, background: "#FFFFFF" }}>
      <AuthorBox
        profile={{
          displayName: "Doan Arlo",
          avatar: null,
          bio:
            "I write about productivity, the craft of writing, and building a calmer relationship with work. " +
            "Most weeks you'll find me sharing the systems and small experiments that actually stuck.",
        }}
        socialLinks={{
          youtube: "https://youtube.com/@doanarlo",
          x: "https://x.com/doanarlo",
          linkedin: "https://linkedin.com/in/doanarlo",
        }}
      />
    </div>
  );
}

export function NoSocials() {
  return (
    <div style={{ padding: 32, background: "#FFFFFF" }}>
      <AuthorBox
        profile={{
          displayName: "Mai Linh",
          avatar: null,
          bio: "A short bio about who I am and the kinds of things I like to write about here.",
        }}
        socialLinks={{}}
      />
    </div>
  );
}
