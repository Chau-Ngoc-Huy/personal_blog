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
    <div className="min-h-screen bg-[#FAF8F3]">
      <Navbar name={profile.displayName} />
      <HeroSection profile={profile} />
      <HelpCardsSection tags={tagsResult.tags} />
      <AboutSection profile={profile} />
      <BlogsSection posts={posts} />
      <SiteFooter profile={profile} />
    </div>
  );
}
