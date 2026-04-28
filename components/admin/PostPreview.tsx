"use client";

import { parseTags, addHeadingIds, extractHeadings } from "@/lib/utils";
import Navbar from "@/components/public/Navbar";
import PostHeader from "@/components/public/PostHeader";
import PostContent from "@/components/public/PostContent";
import AuthorBox from "@/components/public/AuthorBox";
import SiteFooter from "@/components/public/SiteFooter";

interface PostPreviewProps {
  title: string;
  excerpt: string;
  tags: string;
  coverImage: string;
  content: string;
  profile?: {
    displayName: string;
    avatar: string | null;
    bio: string | null;
    email: string | null;
    socialLinks: string | null;
  };
}

export default function PostPreview({
  title,
  excerpt,
  tags,
  coverImage,
  content,
  profile,
}: PostPreviewProps) {
  const tagList = parseTags(tags).map((tag) => ({ id: tag, name: tag }));
  const contentWithIds = addHeadingIds(content);
  const headings = extractHeadings(content);

  const socialLinks: Record<string, string> = {};

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ── Combined Navbar + Post Header — unified beige box ── */}
      <div
        className="max-w-[1400px] mx-auto w-full bg-[#F9F6F3]"
        style={{
          margin: "var(--box-margin) auto",
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >
        <Navbar name={profile?.displayName || "Author"} transparent />
        <PostHeader
          title={title || "Post title..."}
          tags={tagList}
          coverImage={coverImage}
          profile={profile || { displayName: "Author", avatar: null }}
          publishedAt={new Date()}
        />
      </div>

      {/* ── Post Content ── */}
      <PostContent
        excerpt={excerpt}
        contentWithIds={contentWithIds}
        headings={headings}
        showTOC={true}
      />

      {/* ── Author Box ── */}
      {profile && (
        <div
          className="max-w-[1400px] mx-auto w-full"
          style={{
            paddingLeft: "var(--page-px)",
            paddingRight: "var(--page-px)",
            paddingBottom: "var(--navbar-py)",
          }}
        >
          <div className="flex-1 min-w-0">
            <AuthorBox profile={profile} socialLinks={socialLinks} />
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      {profile && <SiteFooter profile={profile} />}
    </div>
  );
}
