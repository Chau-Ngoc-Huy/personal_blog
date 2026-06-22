import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;

  // One view per session per post
  const cookieStore = cookies();
  const viewedKey = `viewed_${slug}`;
  if (cookieStore.get(viewedKey)) {
    const post = await prisma.post.findUnique({ where: { slug, status: "published" }, select: { viewCount: true } });
    return NextResponse.json({ viewCount: post?.viewCount ?? 0 });
  }

  const post = await prisma.post.update({
    where: { slug, status: "published" },
    data: { viewCount: { increment: 1 } },
    select: { viewCount: true },
  });

  const res = NextResponse.json({ viewCount: post.viewCount });
  res.cookies.set(viewedKey, "1", { maxAge: 60 * 60 * 24, httpOnly: true, sameSite: "lax" });
  return res;
}
