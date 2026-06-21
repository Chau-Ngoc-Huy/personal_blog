import { HelpCardsSection } from "blog-scaffold";

const allTags = [
  { id: "1", name: "Productivity", slug: "productivity", _count: { posts: 14 } },
  { id: "2", name: "Writing", slug: "writing", _count: { posts: 9 } },
  { id: "3", name: "Career", slug: "career", _count: { posts: 6 } },
  { id: "4", name: "Focus", slug: "focus", _count: { posts: 5 } },
  { id: "5", name: "Habits", slug: "habits", _count: { posts: 3 } },
  { id: "6", name: "Tools", slug: "tools", _count: { posts: 1 } },
];

export function Default() {
  return <HelpCardsSection tags={allTags} />;
}

export function FewTopics() {
  return (
    <HelpCardsSection
      tags={[
        { id: "1", name: "Productivity", slug: "productivity", _count: { posts: 12 } },
        { id: "2", name: "Writing", slug: "writing", _count: { posts: 7 } },
        { id: "3", name: "Career", slug: "career", _count: { posts: 4 } },
      ]}
    />
  );
}
