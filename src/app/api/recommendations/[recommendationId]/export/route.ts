import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma/client";
import { NextResponse } from "next/server";
import { generateHtmlSnippet } from "@/lib/export/html-snippet";

export async function GET(
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

    // Verify recommendation ownership and get creative details
    const recommendation = await prisma.recommendation.findFirst({
      where: {
        id: recommendationId,
        issue: {
          creatorId: creator.id,
        },
        status: "APPROVED",
      },
      include: {
        creative: true,
      },
    });

    if (!recommendation) {
      return NextResponse.json(
        { error: "Approved recommendation not found" },
        { status: 404 }
      );
    }

    // Mark as exported
    await prisma.recommendation.update({
      where: { id: recommendationId },
      data: { exportedAt: new Date() },
    });

    // Generate HTML snippet
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const html = generateHtmlSnippet({
      recommendationId,
      headline: recommendation.creative.headline,
      body: recommendation.creative.body,
      imageUrl: recommendation.creative.imageUrl,
      ctaText: recommendation.creative.ctaText,
      destinationUrl: recommendation.creative.destinationUrl,
      baseUrl,
    });

    return NextResponse.json({ html });
  } catch (error) {
    console.error("Error exporting recommendation:", error);
    return NextResponse.json(
      { error: "Failed to export recommendation" },
      { status: 500 }
    );
  }
}
