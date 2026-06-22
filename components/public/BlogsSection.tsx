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
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: Date | null;
  tags: Tag[];
}

const COVER_BG = {
  backgroundImage:
    "repeating-linear-gradient(135deg,#F5F7F7,#F5F7F7 11px,#EFF2F2 11px,#EFF2F2 22px)",
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-heading text-[13px] font-semibold uppercase tracking-[0.18em] text-[#8C9496]">
      {children}
    </h2>
  );
}

export default function BlogsSection({ posts }: { posts: Post[] }) {
  const wrap = {
    maxWidth: "var(--maxw)",
    paddingLeft: "var(--page-px)",
    paddingRight: "var(--page-px)",
  } as const;

  if (!posts.length) {
    return (
      <section className="mx-auto" style={wrap}>
        <div className="py-12">
          <Eyebrow>Bài viết</Eyebrow>
          <p className="mt-8 text-[15px] text-[#8C9496]">Chưa có bài viết nào — quay lại sau nhé!</p>
        </div>
      </section>
    );
  }

  const [featured, ...rest] = posts;

  return (
    <section className="mx-auto" style={wrap}>
      {/* ── Featured ── */}
      <div className="py-8 md:py-12">
        <div className="mb-8">
          <Eyebrow>Bài nổi bật</Eyebrow>
        </div>
        <Link
          href={`/${featured.slug}`}
          className="group grid grid-cols-1 gap-7 border-t border-[#ECEFEF] pt-8 no-underline md:grid-cols-[1.15fr_1fr] md:items-center md:gap-14 md:pt-12"
        >
          <div>
            <div className="mb-5 flex items-center gap-3">
              {featured.tags[0] && (
                <span className="rounded-full border border-[var(--ac-border)] bg-[var(--ac-soft)] px-[11px] py-[5px] text-xs font-semibold tracking-[0.04em] text-[var(--ac-dark)]">
                  {featured.tags[0].name}
                </span>
              )}
              {featured.publishedAt && (
                <span className="text-[13px] text-[#8C9496]">{formatDate(featured.publishedAt)}</span>
              )}
            </div>
            <h3 className="mb-4 font-heading text-[clamp(26px,3.4vw,40px)] font-semibold leading-[1.1] tracking-[-0.02em] text-[#14181A] transition-colors group-hover:text-[var(--ac-dark)]">
              {featured.title}
            </h3>
            {featured.excerpt && (
              <p className="mb-6 max-w-[46ch] text-[16px] leading-[1.65] text-[#586063]">
                {featured.excerpt}
              </p>
            )}
            <span className="inline-flex items-center gap-2 text-sm font-medium text-[#14181A]">
              Đọc bài viết <span className="text-[var(--ac)]">→</span>
            </span>
          </div>
          <div
            className="aspect-[4/3] overflow-hidden rounded-[var(--ac-radius)] border border-[#E6EAEA]"
            style={featured.coverImage ? undefined : COVER_BG}
          >
            {featured.coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={featured.coverImage}
                alt={featured.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            )}
          </div>
        </Link>
      </div>

      {/* ── Latest ── */}
      {rest.length > 0 && (
        <div id="bai-viet" className="py-8 md:py-14">
          <div className="mb-2 flex items-baseline justify-between gap-4">
            <Eyebrow>Bài viết mới nhất</Eyebrow>
            <Link
              href="/articles"
              className="text-sm text-[#586063] no-underline transition-colors hover:text-[var(--ac-dark)]"
            >
              Xem tất cả →
            </Link>
          </div>
          <div>
            {rest.map((post) => (
              <Link
                key={post.id}
                href={`/${post.slug}`}
                className="group grid grid-cols-1 gap-3 border-t border-[#ECEFEF] py-6 no-underline sm:grid-cols-[160px_minmax(0,1fr)] sm:items-center sm:gap-7 sm:py-7"
              >
                <div
                  className="hidden aspect-[4/3] overflow-hidden rounded-[10px] border border-[#ECEFEF] sm:block"
                  style={post.coverImage ? undefined : COVER_BG}
                >
                  {post.coverImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="mb-2 font-heading text-[clamp(19px,2.1vw,24px)] font-semibold leading-[1.22] tracking-[-0.015em] text-[#14181A] transition-colors group-hover:text-[var(--ac-dark)]">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="mb-3 max-w-[60ch] text-[15px] leading-[1.6] text-[#586063] line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-2.5 text-[13px] text-[#8C9496]">
                    {post.tags.slice(0, 2).map((t) => (
                      <span
                        key={t.slug}
                        className="rounded-full border border-[#ECEFEF] bg-[#F5F7F7] px-2.5 py-[3px] text-[12px] text-[#586063]"
                      >
                        {t.name}
                      </span>
                    ))}
                    {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
                  </div>
                </div>
              </Link>
            ))}
            <div className="border-t border-[#ECEFEF]" />
          </div>
        </div>
      )}
    </section>
  );
}
