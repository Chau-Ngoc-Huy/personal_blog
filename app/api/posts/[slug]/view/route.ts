import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;
  const cookieStore = cookies();
  const viewedKey = `viewed_${slug}`;
  const likedKey = `liked_${slug}`;
  const alreadyViewed = !!cookieStore.get(viewedKey);
  const liked = !!cookieStore.get(likedKey);

  if (alreadyViewed) {
    const post = await prisma.post.findUnique({
      where: { slug, status: "published" },
      select: { viewCount: true },
    });
    return NextResponse.json({ viewCount: post?.viewCount ?? 0, liked });
  }

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const [post] = await prisma.$transaction([
    prisma.post.update({
      where: { slug, status: "published" },
      data: { viewCount: { increment: 1 } },
      select: { viewCount: true },
    }),
    prisma.dailyStat.upsert({
      where: { date: today },
      create: { date: today, views: 1 },
      update: { views: { increment: 1 } },
    }),
  ]);

  const res = NextResponse.json({ viewCount: post.viewCount, liked });
  res.cookies.set(viewedKey, "1", { maxAge: 60 * 60 * 2, httpOnly: true, sameSite: "lax" });
  return res;
}
