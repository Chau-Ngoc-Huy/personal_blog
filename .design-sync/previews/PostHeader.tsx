import { PostHeader } from "blog-scaffold";

export function Default() {
  return (
    <PostHeader
      title="How I plan my week in 20 minutes"
      tags={[
        { id: "1", name: "Productivity" },
        { id: "2", name: "Systems" },
      ]}
      coverImage={null}
      profile={{ displayName: "Doan Arlo", avatar: null }}
      publishedAt={new Date("2024-11-12")}
    />
  );
}

export function Untagged() {
  return (
    <PostHeader
      title="A quiet defense of the weekly review"
      tags={[]}
      coverImage={null}
      profile={{ displayName: "Doan Arlo", avatar: null }}
      publishedAt={new Date("2024-10-28")}
    />
  );
}
