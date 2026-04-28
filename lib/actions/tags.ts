"use server";

import { prisma } from "@/lib/db";

interface CreateTagInput {
  name: string;
  color?: string;
}

interface UpdateTagInput extends CreateTagInput {
  id: string;
}

// Get all tags
export async function getAllTags() {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: { posts: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, tags };
  } catch (error) {
    console.error("Get tags error:", error);
    return { success: false, tags: [], error: "Failed to load tags" };
  }
}

// Create tag
export async function createTag(input: CreateTagInput) {
  try {
    // Validate
    if (!input.name || input.name.trim().length === 0) {
      return { success: false, error: "Tag name cannot be empty" };
    }

    // Generate slug from name
    const slug = input.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    // Check duplicate
    const existing = await prisma.tag.findUnique({
      where: { slug },
    });

    if (existing) {
      return { success: false, error: `Tag "${input.name}" already exists` };
    }

    const tag = await prisma.tag.create({
      data: {
        name: input.name.trim(),
        slug,
        color: input.color,
      },
    });

    return { success: true, tag };
  } catch (error) {
    console.error("Create tag error:", error);
    return { success: false, error: "Failed to create tag" };
  }
}

// Update tag
export async function updateTag(input: UpdateTagInput) {
  try {
    if (!input.name || input.name.trim().length === 0) {
      return { success: false, error: "Tag name cannot be empty" };
    }

    const slug = input.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    // Check duplicate slug (excluding current tag)
    const existing = await prisma.tag.findFirst({
      where: {
        slug,
        id: { not: input.id },
      },
    });

    if (existing) {
      return { success: false, error: `Tag "${input.name}" already exists` };
    }

    const tag = await prisma.tag.update({
      where: { id: input.id },
      data: {
        name: input.name.trim(),
        slug,
        color: input.color,
      },
    });

    return { success: true, tag };
  } catch (error) {
    console.error("Update tag error:", error);
    return { success: false, error: "Failed to update tag" };
  }
}

// Delete tag
export async function deleteTag(id: string) {
  try {
    // Disconnect posts first
    await prisma.tag.update({
      where: { id },
      data: { posts: { set: [] } },
    });

    const tag = await prisma.tag.delete({
      where: { id },
    });

    return { success: true, tag };
  } catch (error) {
    console.error("Delete tag error:", error);
    return { success: false, error: "Failed to delete tag" };
  }
}
