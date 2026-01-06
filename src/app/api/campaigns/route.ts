import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma/client";
import { NextResponse } from "next/server";
import { Category, CampaignStatus } from "@prisma/client";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const campaigns = await prisma.campaign.findMany({
      include: {
        advertiser: {
          select: { name: true },
        },
        _count: {
          select: { creatives: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      advertiserId,
      name,
      description,
      targetCategories,
      targetKeywords,
      budget,
      cpm,
      startDate,
      endDate,
      status,
    } = body;

    if (!advertiserId || !name || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Advertiser, name, start date, and end date are required" },
        { status: 400 }
      );
    }

    const campaign = await prisma.campaign.create({
      data: {
        advertiserId,
        name,
        description,
        targetCategories: targetCategories as Category[],
        targetKeywords: targetKeywords || [],
        budget: budget || 0,
        cpm: cpm || 0,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: (status as CampaignStatus) || "DRAFT",
      },
    });

    return NextResponse.json(campaign);
  } catch (error) {
    console.error("Error creating campaign:", error);
    return NextResponse.json(
      { error: "Failed to create campaign" },
      { status: 500 }
    );
  }
}
