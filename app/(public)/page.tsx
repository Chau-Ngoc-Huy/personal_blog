import { getPublishedPosts } from "@/lib/actions/posts";
import { getProfile } from "@/lib/actions/profile";
import { getAllTags } from "@/lib/actions/tags";
import Navbar from "@/components/public/Navbar";
import HeroSection from "@/components/public/HeroSection";
import HelpCardsSection from "@/components/public/HelpCardsSection";
import AboutSection from "@/components/public/AboutSection";
import BlogsSection from "@/components/public/BlogsSection";
import SiteFooter from "@/components/public/SiteFooter";

export const revalidate = 0;

export default async function HomePage() {
  const [posts, profile, tagsResult] = await Promise.all([
    getPublishedPosts(),
    getProfile(),
    getAllTags(),
  ]);

  return (
    <div className="min-h-screen bg-white">
      {/* ── Combined Navbar + Hero Section — unified beige box ── */}
      <div
        className="max-w-[1400px] mx-auto bg-[#F9F6F3]"
        style={{
          margin: "var(--box-margin) auto",
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >
        <Navbar name={profile.displayName} transparent />
        <HeroSection profile={profile} />
      </div>

      <HelpCardsSection tags={tagsResult.tags} />
      <AboutSection profile={profile} />
      <BlogsSection posts={posts} />
      <SiteFooter profile={profile} />
    </div>
  );
}
