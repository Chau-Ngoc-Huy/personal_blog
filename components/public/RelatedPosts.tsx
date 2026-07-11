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
  coverImage: string | null;
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
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <Link
            key={p.id}
            href={`/${p.slug}`}
            className="group flex flex-col overflow-hidden rounded-[16px] border border-[#ECEFEF] bg-[#F5F7F7] no-underline transition-shadow hover:shadow-md"
          >
            {/* Cover image */}
            <div className="aspect-[16/9] w-full overflow-hidden bg-[#ECEFEF]">
              {p.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.coverImage}
                  alt={p.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="h-full w-full" />
              )}
            </div>

            {/* Text */}
            <div className="flex flex-1 flex-col p-5">
              {p.tags[0] && (
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--ac-dark)]">
                  {p.tags[0].name}
                </div>
              )}
              <h3 className="mb-auto font-heading text-[17px] font-semibold leading-[1.3] tracking-[-0.015em] text-[#14181A] transition-colors group-hover:text-[var(--ac-dark)]">
                {p.title}
              </h3>
              {p.publishedAt && (
                <p className="mt-3 text-[13px] text-[#8C9496]">{formatDate(p.publishedAt)}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
