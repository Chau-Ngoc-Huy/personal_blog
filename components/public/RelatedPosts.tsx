import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface Tag {
  name: string;
  slug: string;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  publishedAt: Date | null;
  tags: Tag[];
}

export default function RelatedPosts({ posts }: { posts: Post[] }) {
  if (!posts.length) return null;

  return (
    <section
      className="mx-auto"
      style={{
        maxWidth: "var(--maxw)",
        paddingLeft: "var(--page-px)",
        paddingRight: "var(--page-px)",
        paddingTop: "clamp(48px,7vw,88px)",
      }}
    >
      <h2 className="mb-7 font-heading text-[13px] font-semibold uppercase tracking-[0.18em] text-[#8C9496]">
        Đọc tiếp
      </h2>
      <div className="grid gap-x-10 border-t border-[#ECEFEF] sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <Link
            key={p.id}
            href={`/${p.slug}`}
            className="group block border-b border-[#ECEFEF] py-7 no-underline"
          >
            {p.tags[0] && <div className="mb-3 text-xs text-[var(--ac-dark)]">{p.tags[0].name}</div>}
            <h3 className="mb-2.5 font-heading text-[20px] font-semibold leading-[1.25] tracking-[-0.015em] text-[#14181A] transition-colors group-hover:text-[var(--ac-dark)]">
              {p.title}
            </h3>
            {p.publishedAt && (
              <p className="text-[14px] leading-[1.6] text-[#8C9496]">{formatDate(p.publishedAt)}</p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
