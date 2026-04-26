import { getProfile } from "@/lib/actions/profile";
import ProfileForm from "@/components/admin/ProfileForm";

export const metadata = {
  title: "Profile Admin | Personal Blog",
};

export default async function ProfilePage() {
  const profile = await getProfile();

  const socialLinks = profile.socialLinks
    ? JSON.parse(profile.socialLinks)
    : null;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Profile Cá nhân</h1>
        <p className="text-slate-500 mt-1">Chỉnh sửa thông tin về bạn</p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-8">
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
