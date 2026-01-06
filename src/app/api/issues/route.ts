import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma/client";
import { NextResponse } from "next/server";
import { extractKeywords } from "@/lib/ai/keyword-extractor";
import { classifyCategory } from "@/lib/ai/category-classifier";
import { summarizeContent } from "@/lib/ai/summarizer";

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
    });

    if (!creator) {
      return NextResponse.json(
        { error: "Creator profile not found" },
        { status: 404 }
      );
    }

    const issues = await prisma.issue.findMany({
      where: { creatorId: creator.id },
      include: {
        recommendations: {
          select: {
            id: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(issues);
  } catch (error) {
    console.error("Error fetching issues:", error);
    return NextResponse.json(
      { error: "Failed to fetch issues" },
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
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    // Extract keywords
    const extractedKeywords = extractKeywords(content);

    // Classify category
    const classifiedCategory = classifyCategory(content, extractedKeywords);

    // Generate summary
    const summary = summarizeContent(content);

    // Create issue
    const issue = await prisma.issue.create({
      data: {
        creatorId: creator.id,
        title,
        content,
        extractedKeywords,
        classifiedCategory,
        summary,
      },
    });

    return NextResponse.json(issue);
  } catch (error) {
    console.error("Error creating issue:", error);
    return NextResponse.json(
      { error: "Failed to create issue" },
      { status: 500 }
    );
  }
}
