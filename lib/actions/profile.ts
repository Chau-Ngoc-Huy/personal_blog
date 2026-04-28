"use server";

import type { AdminProfile } from "@prisma/client";
import { prisma } from "@/lib/db";
import { stringifySocialLinks } from "../social-links";

interface UpdateProfileInput {
  displayName?: string;
  bio?: string;
  sayHi?: string;
  avatar?: string;
  email?: string;
  socialLinks?: {
    youtube?: string;
    instagram?: string;
    linkedin?: string;
    tiktok?: string;
    x?: string;
    facebook?: string;
  };
}

const fallbackProfile: AdminProfile = {
  id: "",
  displayName: "Admin",
  sayHi: null,
  bio: null,
  avatar: null,
  email: null,
  socialLinks: null,
  updatedAt: new Date(0),
};

// Get or create profile (singleton)
export async function getProfile() {
  try {
    let profile = await prisma.adminProfile.findFirst();

    if (!profile) {
      profile = await prisma.adminProfile.create({
        data: {
          displayName: "Admin",
        },
      });
    }

    return profile;
  } catch (error) {
    console.error("Get profile error:", error);
    return fallbackProfile;
  }
}

// Update profile
export async function updateProfile(data: UpdateProfileInput) {
  try {
    const profile = await getProfile();

    const updated = await prisma.adminProfile.update({
      where: { id: profile.id },
      data: {
        displayName: data.displayName ?? profile.displayName,
        bio: data.bio,
        sayHi: data.sayHi,
        avatar: data.avatar,
        email: data.email,
        socialLinks: stringifySocialLinks(data.socialLinks),
      },
    });

    return { success: true, profile: updated };
  } catch (error) {
    console.error("Update profile error:", error);
    return { success: false, error: "Failed to update profile" };
  }
}
