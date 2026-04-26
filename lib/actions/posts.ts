"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { createErrorResponse, ActionResponse } from "@/lib/error-handler";

export async function createPost(formData: FormData): Promise<ActionResponse> {
  try {
    const title = (formData.get("title") as string)?.trim();
    const slug = (formData.get("slug") as string)?.trim() || slugify(title);
    const excerpt = (formData.get("excerpt") as string)?.trim() || null;
    const content = formData.get("content") as string;
    const coverImage = (formData.get("coverImage") as string)?.trim() || null;
    const action = formData.get("action") as string;

    if (!title || !slug || !content) {
      return createErrorResponse("Title, slug và nội dung là bắt buộc");
    }

    const existing = await prisma.post.findUnique({ where: { slug } });
    if (existing) {
      return createErrorResponse("Slug đã tồn tại, vui lòng chọn slug khác");
    }

    const status = action === "publish" ? "published" : "draft";

    // Parse tags from comma-separated string
    const tagsString = (formData.get("tags") as string)?.trim() || "";
    const tagNames = tagsString
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    await prisma.post.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        status,
        publishedAt: status === "published" ? new Date() : null,
        tags: tagNames.length > 0 ? {
          connect: tagNames.map((name) => ({ name })),
        } : undefined,
      },
    });

    redirect("/admin/dashboard");
  } catch (error) {
    return createErrorResponse(error, "Lỗi khi tạo bài viết");
  }
}

export async function updatePost(id: string, formData: FormData): Promise<ActionResponse> {
  try {
    const title = (formData.get("title") as string)?.trim();
    const slug = (formData.get("slug") as string)?.trim() || slugify(title);
    const excerpt = (formData.get("excerpt") as string)?.trim() || null;
    const content = formData.get("content") as string;
    const coverImage = (formData.get("coverImage") as string)?.trim() || null;
    const action = formData.get("action") as string;

    if (!title || !slug || !content) {
      return createErrorResponse("Title, slug và nội dung là bắt buộc");
    }

    const existing = await prisma.post.findUnique({ where: { slug } });
    if (existing && existing.id !== id) {
      return createErrorResponse("Slug đã tồn tại, vui lòng chọn slug khác");
    }

    const current = await prisma.post.findUnique({ where: { id } });
    const status = action === "publish" ? "published" : "draft";

    // Parse tags from comma-separated string
    const tagsString = (formData.get("tags") as string)?.trim() || "";
    const tagNames = tagsString
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        status,
        publishedAt:
          status === "published"
            ? (current?.publishedAt ?? new Date())
            : null,
        tags:
          tagNames.length > 0
            ? {
                set: tagNames.map((name) => ({ name })),
              }
            : {
                set: [],
              },
      },
    });

    redirect("/admin/dashboard");
  } catch (error) {
    return createErrorResponse(error, "Lỗi khi cập nhật bài viết");
  }
}

export async function deletePost(id: string): Promise<ActionResponse> {
  try {
    await prisma.post.delete({ where: { id } });
    redirect("/admin/dashboard");
  } catch (error) {
    return createErrorResponse(error, "Lỗi khi xóa bài viết");
  }
}

export async function getPublishedPosts() {
  try {
    return await prisma.post.findMany({
      where: { status: "published" },
      include: { tags: true },
      orderBy: { publishedAt: "desc" },
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bài viết:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string) {
  try {
    return await prisma.post.findUnique({
      where: { slug, status: "published" },
      include: { tags: true },
    });
  } catch (error) {
    console.error("Lỗi khi lấy bài viết:", error);
    return null;
  }
}

export async function getAllPostsForAdmin() {
  try {
    return await prisma.post.findMany({
      include: { tags: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bài viết:", error);
    return [];
  }
}

export async function getPostById(id: string) {
  try {
    return await prisma.post.findUnique({
      where: { id },
      include: { tags: true },
    });
  } catch (error) {
    console.error("Lỗi khi lấy bài viết:", error);
    return null;
  }
}
