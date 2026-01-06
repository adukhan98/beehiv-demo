import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma/client";
import { NextResponse } from "next/server";
import { matchAdsForIssue } from "@/lib/ai/ad-matcher";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ issueId: string }> }
) {
  try {
    const { issueId } = await params;
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

    // Verify issue ownership
    const issue = await prisma.issue.findFirst({
      where: {
        id: issueId,
        creatorId: creator.id,
      },
    });

    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    const recommendations = await prisma.recommendation.findMany({
      where: { issueId },
      include: {
        creative: {
          include: {
            campaign: {
              include: {
                advertiser: true,
              },
            },
          },
        },
      },
      orderBy: { rank: "asc" },
    });

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ issueId: string }> }
) {
  try {
    const { issueId } = await params;
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

    // Verify issue ownership
    const issue = await prisma.issue.findFirst({
      where: {
        id: issueId,
        creatorId: creator.id,
      },
    });

    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    // Delete existing pending recommendations
    await prisma.recommendation.deleteMany({
      where: {
        issueId,
        status: "PENDING",
      },
    });

    // Generate new recommendations
    const matches = await matchAdsForIssue({
      creatorId: creator.id,
      issueKeywords: issue.extractedKeywords,
      issueCategory: issue.classifiedCategory,
    });

    // Create recommendations
    const recommendations = await Promise.all(
      matches.map((match, index) =>
        prisma.recommendation.create({
          data: {
            issueId,
            creativeId: match.creativeId,
            matchScore: match.score,
            matchReasons: match.reasons,
            rank: index + 1,
            status: "PENDING",
          },
          include: {
            creative: {
              include: {
                campaign: {
                  include: {
                    advertiser: true,
                  },
                },
              },
            },
          },
        })
      )
    );

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
