import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;
  const cookieStore = cookies();
  const likedKey = `liked_${slug}`;
  const alreadyLiked = !!cookieStore.get(likedKey);

  const { action } = await req.json() as { action: "like" | "unlike" };

  // Block spam: server cookie is the source of truth
  if (action === "like" && alreadyLiked) {
    const post = await prisma.post.findUnique({ where: { slug, status: "published" }, select: { likeCount: true } });
    return NextResponse.json({ likeCount: post?.likeCount ?? 0, alreadyLiked: true });
  }
  if (action === "unlike" && !alreadyLiked) {
    const post = await prisma.post.findUnique({ where: { slug, status: "published" }, select: { likeCount: true } });
    return NextResponse.json({ likeCount: post?.likeCount ?? 0 });
  }

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const delta = action === "like" ? 1 : -1;

  const [post] = await prisma.$transaction([
    prisma.post.update({
      where: { slug, status: "published" },
      data: { likeCount: { increment: delta } },
      select: { likeCount: true },
    }),
    prisma.dailyStat.upsert({
      where: { date: today },
      create: { date: today, likes: action === "like" ? 1 : 0 },
      update: { likes: { increment: delta } },
    }),
  ]);

  const res = NextResponse.json({ likeCount: Math.max(0, post.likeCount) });

  if (action === "like") {
    // Cookie tồn tại vĩnh viễn (1 năm) — 1 like/browser/post
    res.cookies.set(likedKey, "1", { maxAge: 2147483647, httpOnly: true, sameSite: "lax" });
  } else {
    res.cookies.delete(likedKey);
  }

  return res;
}
