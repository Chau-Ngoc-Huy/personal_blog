import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const { action } = await req.json() as { action: "like" | "unlike" };

  const post = await prisma.post.update({
    where: { slug: params.slug, status: "published" },
    data: { likeCount: { increment: action === "like" ? 1 : -1 } },
    select: { likeCount: true },
  });

  return NextResponse.json({ likeCount: Math.max(0, post.likeCount) });
}
