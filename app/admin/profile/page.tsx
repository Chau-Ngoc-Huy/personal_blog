import { getProfile } from "@/lib/actions/profile";
import ProfileForm from "@/components/admin/ProfileForm";

export const metadata = {
  title: "Hồ sơ | Quản trị",
};

export default async function ProfilePage() {
  const profile = await getProfile();

  const socialLinks = profile.socialLinks
    ? JSON.parse(profile.socialLinks)
    : null;

  return (
    <div className="mx-auto w-full max-w-[1200px] p-[clamp(24px,3.5vw,40px)]">
      <div className="mb-6">
        <h1 className="font-heading text-[clamp(24px,3vw,32px)] font-semibold tracking-[-0.02em] text-[#14181A]">Cài đặt hồ sơ</h1>
        <p className="mt-1.5 text-sm text-[#8C9496]">Thông tin này hiển thị công khai trên trang của bạn.</p>
      </div>

      <div className="rounded-[14px] border border-[#ECEFEF] bg-white p-[clamp(20px,3vw,32px)]">
        <ProfileForm
          initialData={{
            displayName: profile.displayName,
            bio: profile.bio || undefined,
            avatar: profile.avatar || undefined,
            email: profile.email || undefined,
            socialLinks: socialLinks || undefined,
          }}
        />
      </div>
    </div>
  );
}
