import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma/client";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ recommendationId: string }> }
) {
  try {
    const { recommendationId } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const creator = await prisma.creator.findUnique({
      where: { userId: user.id },
    });

    if (!creator) {
      return NextResponse.json(
        { error: "Creator profile not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { reason } = body;

    // Verify recommendation ownership through issue
    const recommendation = await prisma.recommendation.findFirst({
      where: {
        id: recommendationId,
        issue: {
          creatorId: creator.id,
        },
      },
    });

    if (!recommendation) {
      return NextResponse.json(
        { error: "Recommendation not found" },
        { status: 404 }
      );
    }

    // Update recommendation status
    const updated = await prisma.recommendation.update({
      where: { id: recommendationId },
      data: {
        status: "REJECTED",
        rejectionReason: reason || null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error rejecting recommendation:", error);
    return NextResponse.json(
      { error: "Failed to reject recommendation" },
      { status: 500 }
    );
  }
}
