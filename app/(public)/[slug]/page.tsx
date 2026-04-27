import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { getPostBySlug, getPublishedPosts } from "@/lib/actions/posts";
import { getProfile } from "@/lib/actions/profile";
import { formatDate, extractHeadings, addHeadingIds } from "@/lib/utils";
import Navbar from "@/components/public/Navbar";
import SiteFooter from "@/components/public/SiteFooter";
import TableOfContents from "@/components/public/TableOfContents";

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: "Không tìm thấy" };
  return {
    title: `${post.title} — Blog`,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/${post.slug}`,
      images: post.coverImage ? [{ url: post.coverImage }] : [],
    },
  };
}

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export const revalidate = 0;

export default async function PostPage({ params }: Props) {
  const [post, profile] = await Promise.all([
    getPostBySlug(params.slug),
    getProfile(),
  ]);
  if (!post) notFound();

  const contentWithIds = addHeadingIds(post.content);
  const headings = extractHeadings(post.content);

  let socialLinks: Record<string, string> = {};
  try {
    if (profile.socialLinks) socialLinks = JSON.parse(profile.socialLinks);
  } catch {}

  return (
    <div className="min-h-screen bg-white ">
      {/* ── Combined Navbar + Post Header — dashed border box ── */}
      <div
        className="max-w-[1400px] mx-auto bg-[#F9F6F3]"
        style={{
          margin: "var(--box-margin) auto",
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >
        <Navbar name={profile.displayName} transparent />

        {/* ── Post header ───────────────────────────────────── */}
        <div
          style={{
            paddingLeft: "var(--page-px)",
            paddingRight: "var(--page-px)",
            paddingTop: "var(--navbar-py)",
            paddingBottom: "var(--navbar-py)",
          }}
        >
          <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-16">
            {/* Text side */}
            <div className="flex-1 min-w-0">
              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {post.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="font-sans text-[#54505B] bg-white rounded-full px-3 py-1"
                      style={{ fontSize: "0.8125rem", fontWeight: 500, border: "1px solid #ECE5E1" }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1
                className="font-heading text-[#1B1624] mb-5"
                style={{
                  fontSize: "clamp(1.75rem,1.75rem + ((1vw - 0.2rem) * 2.5),3.25rem)",
                  lineHeight: 1.15,
                  fontWeight: 400,
                  letterSpacing: "-0.03em",
                }}
              >
                {post.title}
              </h1>

              {/* Meta row */}
              <div className="flex items-center gap-3 flex-wrap" style={{ fontSize: "0.875rem" }}>
                {profile.avatar ? (
                  <Image
                    src={profile.avatar}
                    alt={profile.displayName}
                    width={36}
                    height={36}
                    className="rounded-full object-cover"
                    style={{ width: 36, height: 36 }}
                  />
                ) : (
                  <div
                    className="rounded-full bg-[#F3EDE9] flex items-center justify-center font-heading text-[#FD976D]"
                    style={{ width: 36, height: 36, fontSize: "0.875rem" }}
                  >
                    {profile.displayName.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <span className="font-sans font-semibold text-[#1B1624]">{profile.displayName}</span>
                <span className="text-[#8D8A91]">/</span>
                {post.publishedAt && (
                  <time className="font-sans text-[#76737C]">{formatDate(post.publishedAt)}</time>
                )}
              </div>
            </div>

            {/* Cover image */}
            {post.coverImage && (
              <div className="shrink-0 w-full lg:w-auto">
                <div
                  className="overflow-hidden"
                  style={{
                    width: "clamp(180px,28vw,260px)",
                    height: "clamp(220px,34vw,340px)",
                    borderRadius: "12px",
                    boxShadow: "0px 20px 40px -10px rgba(0,0,0,0.18)",
                    maxWidth: "100%",
                  }}
                >
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    width={260}
                    height={340}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* End of unified header box */}

      {/* ── Body: TOC + Article ──────────────────────────── */}
      <div
        className="max-w-[1400px] mx-auto"
        style={{
          paddingLeft: "var(--page-px)",
          paddingRight: "var(--page-px)",
          paddingTop: "var(--navbar-py)",
          paddingBottom: "var(--navbar-py)",
        }}
      >
        <div className="flex items-start gap-10 xl:gap-14">

          {/* TOC sidebar — sticky, hidden below xl */}
          <TableOfContents headings={headings} />

          {/* Article */}
          <div className="flex-1 min-w-0">
            <div
              className="bg-white rounded-[20px]"
              style={{ padding: "clamp(1.25rem,3vw,2rem)" }}
            >
              {post.excerpt && (
                <p
                  className="font-sans text-[#54505B] mb-8 border-l-4 border-[#FDD46B] pl-5"
                  style={{ fontSize: "1.125rem", lineHeight: 1.7, fontStyle: "italic" }}
                >
                  {post.excerpt}
                </p>
              )}

              <div className="prose-content" dangerouslySetInnerHTML={{ __html: contentWithIds }} />
            </div>

            {/* ── Author box ──────────────────────────────── */}
            <div
              className="mt-8 rounded-[20px] p-8 flex flex-col items-center text-center gap-4 bg-[#FAF8F3]"
              style={{ border: "2px dashed #ECE5E1" }}
            >
              {profile.avatar ? (
                <Image
                  src={profile.avatar}
                  alt={profile.displayName}
                  width={80}
                  height={80}
                  className="rounded-full object-cover"
                  style={{ width: 80, height: 80 }}
                />
              ) : (
                <div
                  className="rounded-full bg-[#F3EDE9] flex items-center justify-center font-heading text-[#FD976D]"
                  style={{ width: 80, height: 80, fontSize: "1.5rem" }}
                >
                  {profile.displayName.slice(0, 2).toUpperCase()}
                </div>
              )}

              <p
                className="font-heading text-[#1B1624]"
                style={{ fontSize: "clamp(1.25rem,1.5vw,1.5rem)", fontWeight: 400 }}
              >
                {profile.displayName}
              </p>

              {profile.bio && (
                <p className="font-sans text-[#54505B] max-w-lg" style={{ fontSize: "1rem", lineHeight: 1.65 }}>
                  {profile.bio}
                </p>
              )}

              {/* Social links */}
              {Object.keys(socialLinks).length > 0 && (
                <div className="flex gap-4 flex-wrap justify-center">
                  {socialLinks.twitter && (
                    <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                      className="font-sans text-[#76737C] hover:text-[#1B1624] transition-colors text-sm">
                      Twitter
                    </a>
                  )}
                  {socialLinks.github && (
                    <a href={socialLinks.github} target="_blank" rel="noopener noreferrer"
                      className="font-sans text-[#76737C] hover:text-[#1B1624] transition-colors text-sm">
                      GitHub
                    </a>
                  )}
                  {socialLinks.linkedin && (
                    <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                      className="font-sans text-[#76737C] hover:text-[#1B1624] transition-colors text-sm">
                      LinkedIn
                    </a>
                  )}
                  {socialLinks.youtube && (
                    <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer"
                      className="font-sans text-[#76737C] hover:text-[#1B1624] transition-colors text-sm">
                      YouTube
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <SiteFooter profile={profile} />
    </div>
  );
}
