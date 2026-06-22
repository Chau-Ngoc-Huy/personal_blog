import { getPublishedPosts } from "@/lib/actions/posts";
import { getProfile } from "@/lib/actions/profile";
import Navbar from "@/components/public/Navbar";
import HeroSection from "@/components/public/HeroSection";
import AboutSection from "@/components/public/AboutSection";
import BlogsSection from "@/components/public/BlogsSection";
import SiteFooter from "@/components/public/SiteFooter";

// ISR: serve a cached, prefetchable page. Freshness after admin edits is
// handled by revalidatePath() in the post/profile/tag server actions.
export const revalidate = 3600;

export default async function HomePage() {
  const [posts, profile] = await Promise.all([getPublishedPosts(), getProfile()]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header + hero — unified soft rounded panel */}
      <div
        style={{
          paddingLeft: "var(--box-margin)",
          paddingRight: "var(--box-margin)",
          paddingTop: "var(--box-margin)",
        }}
      >
        <div
          className="mx-auto w-full overflow-hidden rounded-[24px] border border-[#ECEFEF] bg-[#F5F7F7]"
          style={{ maxWidth: "var(--maxw)" }}
        >
          <Navbar name={profile.displayName} transparent />
          <HeroSection profile={profile} />
        </div>
      </div>

      {/* Everything below stays as before (full-width, no panel) */}
      <main>
        <BlogsSection posts={posts} />
        <AboutSection profile={profile} />
      </main>

      <SiteFooter profile={profile} />
    </div>
  );
}
