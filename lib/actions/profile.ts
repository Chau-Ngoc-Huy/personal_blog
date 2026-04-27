"use server";

import { prisma } from "@/lib/db";

interface UpdateProfileInput {
  displayName?: string;
  bio?: string;
  sayHi?: string;
  avatar?: string;
  email?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

// Get or create profile (singleton)
export async function getProfile() {
  let profile = await prisma.adminProfile.findFirst();

  if (!profile) {
    profile = await prisma.adminProfile.create({
      data: {
        displayName: "Admin",
      },
    });
  }

  return profile;
}

// Update profile
export async function updateProfile(data: UpdateProfileInput) {
  try {
    const profile = await getProfile();

    const socialLinks = data.socialLinks
      ? JSON.stringify(data.socialLinks)
      : undefined;

    const updated = await prisma.adminProfile.update({
      where: { id: profile.id },
      data: {
        displayName: data.displayName ?? profile.displayName,
        bio: data.bio,
        sayHi: data.sayHi,
        avatar: data.avatar,
        email: data.email,
        socialLinks,
      },
    });

    return { success: true, profile: updated };
  } catch (error) {
    console.error("Update profile error:", error);
    return { success: false, error: "Cập nhật profile thất bại" };
  }
}
