import { BlogsSection } from "blog-scaffold";

const posts = [
  {
    id: "1",
    title: "How I plan my week in 20 minutes",
    slug: "weekly-planning",
    excerpt:
      "A lightweight system for turning a messy backlog into a calm, realistic week — without a fancy app.",
    coverImage: null,
    publishedAt: new Date("2024-11-12"),
    tags: [
      { name: "Productivity", slug: "productivity" },
      { name: "Systems", slug: "systems" },
    ],
  },
  {
    id: "2",
    title: "Learning in public changed my career",
    slug: "learning-in-public",
    excerpt:
      "Sharing rough drafts felt terrifying. It also opened every door that mattered. Here's what I'd tell my younger self.",
    coverImage: null,
    publishedAt: new Date("2024-10-28"),
    tags: [{ name: "Career", slug: "career" }],
  },
  {
    id: "3",
    title: "The case for boring tools",
    slug: "boring-tools",
    excerpt:
      "Novelty is a tax. The most productive people I know reach for the same dull, dependable tools every day.",
    coverImage: null,
    publishedAt: new Date("2024-10-09"),
    tags: [
      { name: "Tools", slug: "tools" },
      { name: "Focus", slug: "focus" },
    ],
  },
  {
    id: "4",
    title: "Reading 40 books a year (without forcing it)",
    slug: "reading-habit",
    excerpt: "How I went from one book a year to forty, by making reading the path of least resistance.",
    coverImage: null,
    publishedAt: new Date("2024-09-21"),
    tags: [{ name: "Habits", slug: "habits" }],
  },
  {
    id: "5",
    title: "Notes on doing deep work as a parent",
    slug: "deep-work-parent",
    excerpt: "Long, uninterrupted hours are a myth for most of us. Here's the messier version that actually works.",
    coverImage: null,
    publishedAt: new Date("2024-09-03"),
    tags: [
      { name: "Focus", slug: "focus" },
      { name: "Life", slug: "life" },
    ],
  },
  {
    id: "6",
    title: "Why I write every morning",
    slug: "morning-pages",
    excerpt: "Three pages, longhand, before the inbox. It's the cheapest therapy and the best idea engine I've found.",
    coverImage: null,
    publishedAt: new Date("2024-08-15"),
    tags: [{ name: "Writing", slug: "writing" }],
  },
];

export function WithPosts() {
  return <BlogsSection posts={posts} />;
}

export function Empty() {
  return <BlogsSection posts={[]} />;
}
