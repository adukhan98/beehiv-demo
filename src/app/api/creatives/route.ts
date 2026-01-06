import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma/client";
import { NextResponse } from "next/server";
import { TonePreference } from "@prisma/client";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const creatives = await prisma.adCreative.findMany({
      include: {
        campaign: {
          include: {
            advertiser: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(creatives);
  } catch (error) {
    console.error("Error fetching creatives:", error);
    return NextResponse.json(
      { error: "Failed to fetch creatives" },
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
      campaignId,
      headline,
      body: adBody,
      imageUrl,
      ctaText,
      destinationUrl,
      tone,
    } = body;

    if (!campaignId || !headline || !adBody || !destinationUrl) {
      return NextResponse.json(
        {
          error:
            "Campaign, headline, body, and destination URL are required",
        },
        { status: 400 }
      );
    }

    const creative = await prisma.adCreative.create({
      data: {
        campaignId,
        headline,
        body: adBody,
        imageUrl,
        ctaText: ctaText || "Learn More",
        destinationUrl,
        tone: (tone as TonePreference) || "PROFESSIONAL",
      },
    });

    return NextResponse.json(creative);
  } catch (error) {
    console.error("Error creating creative:", error);
    return NextResponse.json(
      { error: "Failed to create creative" },
      { status: 500 }
    );
  }
}
