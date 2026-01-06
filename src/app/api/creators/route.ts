import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma/client";
import { NextResponse } from "next/server";
import { Category } from "@prisma/client";

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

    return NextResponse.json(creator);
  } catch (error) {
    console.error("Error fetching creator:", error);
    return NextResponse.json(
      { error: "Failed to fetch creator" },
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
      newsletterName,
      newsletterUrl,
      description,
      subscriberCount,
      averageOpenRate,
      primaryCategory,
    } = body;

    if (!newsletterName || !primaryCategory) {
      return NextResponse.json(
        { error: "Newsletter name and category are required" },
        { status: 400 }
      );
    }

    // Check if creator already exists
    const existingCreator = await prisma.creator.findUnique({
      where: { userId: user.id },
    });

    let creator;

    if (existingCreator) {
      // Update existing creator
      creator = await prisma.creator.update({
        where: { userId: user.id },
        data: {
          newsletterName,
          newsletterUrl,
          description,
          subscriberCount,
          averageOpenRate,
          primaryCategory: primaryCategory as Category,
        },
      });
    } else {
      // Create new creator
      creator = await prisma.creator.create({
        data: {
          userId: user.id,
          newsletterName,
          newsletterUrl,
          description,
          subscriberCount,
          averageOpenRate,
          primaryCategory: primaryCategory as Category,
        },
      });
    }

    return NextResponse.json(creator);
  } catch (error) {
    console.error("Error creating/updating creator:", error);
    return NextResponse.json(
      { error: "Failed to save creator profile" },
      { status: 500 }
    );
  }
}
