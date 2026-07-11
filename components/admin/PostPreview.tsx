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
    <div className="flex min-h-screen flex-col bg-white">
      <main className="flex-1">
        {/* Unified header panel — matches the public post page */}
        <div
          className="mx-auto"
          style={{
            maxWidth: "1240px",
            paddingLeft: "var(--page-px)",
            paddingRight: "var(--page-px)",
            paddingTop: "var(--box-margin)",
          }}
        >
          <div className="overflow-hidden rounded-[24px] border border-[#ECEFEF] bg-[#F5F7F7]">
            <Navbar name={profile?.displayName || "Author"} transparent />
            <PostHeader
              title={title || "Tiêu đề bài viết..."}
              tags={tagList}
              coverImage={coverImage}
              profile={profile || { displayName: "Author", avatar: null }}
              publishedAt={new Date()}
              excerpt={excerpt}
            />
          </div>
        </div>

        <PostContent contentWithIds={contentWithIds} headings={headings} showTOC={true} />
        {profile && <AuthorBox profile={profile} socialLinks={socialLinks} />}
      </main>
      {profile && <SiteFooter profile={profile} />}
    </div>
  );
}
