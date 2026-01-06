import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma/client";
import { NextResponse } from "next/server";
import { Category, TonePreference, ApprovalMode } from "@prisma/client";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const creator = await prisma.creator.findUnique({
      where: { userId: user.id },
      include: { boundaries: true },
    });

    if (!creator) {
      return NextResponse.json(
        { error: "Creator profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(creator.boundaries);
  } catch (error) {
    console.error("Error fetching boundaries:", error);
    return NextResponse.json(
      { error: "Failed to fetch boundaries" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
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
        { error: "Creator profile not found. Please complete onboarding first." },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      allowedCategories,
      blockedCategories,
      blockedBrands,
      maxAdsPerIssue,
      approvalMode,
      preferredTone,
      minCpm,
    } = body;

    // Upsert boundaries
    const boundaries = await prisma.creatorBoundaries.upsert({
      where: { creatorId: creator.id },
      update: {
        allowedCategories: allowedCategories as Category[],
        blockedCategories: blockedCategories as Category[],
        blockedBrands: blockedBrands as string[],
        maxAdsPerIssue: maxAdsPerIssue || 3,
        approvalMode: (approvalMode as ApprovalMode) || "MANUAL",
        preferredTone: (preferredTone as TonePreference) || "PROFESSIONAL",
        minCpm: minCpm || null,
      },
      create: {
        creatorId: creator.id,
        allowedCategories: allowedCategories as Category[],
        blockedCategories: blockedCategories as Category[],
        blockedBrands: blockedBrands as string[],
        maxAdsPerIssue: maxAdsPerIssue || 3,
        approvalMode: (approvalMode as ApprovalMode) || "MANUAL",
        preferredTone: (preferredTone as TonePreference) || "PROFESSIONAL",
        minCpm: minCpm || null,
      },
    });

    // Mark onboarding as complete
    await prisma.creator.update({
      where: { id: creator.id },
      data: { onboardingComplete: true },
    });

    return NextResponse.json(boundaries);
  } catch (error) {
    console.error("Error updating boundaries:", error);
    return NextResponse.json(
      { error: "Failed to save boundaries" },
      { status: 500 }
    );
  }
}
