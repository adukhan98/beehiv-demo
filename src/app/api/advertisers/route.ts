import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const advertisers = await prisma.advertiser.findMany({
      include: {
        _count: {
          select: { campaigns: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(advertisers);
  } catch (error) {
    console.error("Error fetching advertisers:", error);
    return NextResponse.json(
      { error: "Failed to fetch advertisers" },
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
    const { name, website, logoUrl, contactEmail } = body;

    if (!name || !contactEmail) {
      return NextResponse.json(
        { error: "Name and contact email are required" },
        { status: 400 }
      );
    }

    const advertiser = await prisma.advertiser.create({
      data: {
        name,
        website,
        logoUrl,
        contactEmail,
      },
    });

    return NextResponse.json(advertiser);
  } catch (error) {
    console.error("Error creating advertiser:", error);
    return NextResponse.json(
      { error: "Failed to create advertiser" },
      { status: 500 }
    );
  }
}
