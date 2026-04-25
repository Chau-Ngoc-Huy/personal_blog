"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";

export async function createPost(formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim() || slugify(title);
  const excerpt = (formData.get("excerpt") as string)?.trim() || null;
  const content = formData.get("content") as string;
  const tags = (formData.get("tags") as string)?.trim() || null;
  const coverImage = (formData.get("coverImage") as string)?.trim() || null;
  const action = formData.get("action") as string;

  if (!title || !slug || !content) {
    return { error: "Title, slug và nội dung là bắt buộc" };
  }

  const existing = await prisma.post.findUnique({ where: { slug } });
  if (existing) {
    return { error: "Slug đã tồn tại, vui lòng chọn slug khác" };
  }

  const status = action === "publish" ? "published" : "draft";

  await prisma.post.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      tags,
      coverImage,
      status,
      publishedAt: status === "published" ? new Date() : null,
    },
  });

  redirect("/admin/dashboard");
}

export async function updatePost(id: number, formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim() || slugify(title);
  const excerpt = (formData.get("excerpt") as string)?.trim() || null;
  const content = formData.get("content") as string;
  const tags = (formData.get("tags") as string)?.trim() || null;
  const coverImage = (formData.get("coverImage") as string)?.trim() || null;
  const action = formData.get("action") as string;

  if (!title || !slug || !content) {
    return { error: "Title, slug và nội dung là bắt buộc" };
  }

  const existing = await prisma.post.findUnique({ where: { slug } });
  if (existing && existing.id !== id) {
    return { error: "Slug đã tồn tại, vui lòng chọn slug khác" };
  }

  const current = await prisma.post.findUnique({ where: { id } });
  const status = action === "publish" ? "published" : "draft";

  await prisma.post.update({
    where: { id },
    data: {
      title,
      slug,
      excerpt,
      content,
      tags,
      coverImage,
      status,
      publishedAt:
        status === "published"
          ? (current?.publishedAt ?? new Date())
          : null,
    },
  });

  redirect("/admin/dashboard");
}

export async function deletePost(id: number) {
  await prisma.post.delete({ where: { id } });
  redirect("/admin/dashboard");
}

export async function getPublishedPosts() {
  return prisma.post.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getPostBySlug(slug: string) {
  return prisma.post.findUnique({
    where: { slug, status: "published" },
  });
}

export async function getAllPostsForAdmin() {
  return prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getPostById(id: number) {
  return prisma.post.findUnique({ where: { id } });
}
