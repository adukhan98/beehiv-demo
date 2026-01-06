import { prisma } from "@/lib/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const recommendationId = request.nextUrl.searchParams.get("rid");
  const destination = request.nextUrl.searchParams.get("dest");

  if (!destination) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const decodedUrl = decodeURIComponent(destination);

  if (recommendationId) {
    try {
      const recommendation = await prisma.recommendation.findUnique({
        where: { id: recommendationId },
        select: { id: true },
      });

      if (recommendation) {
        await prisma.event.create({
          data: {
            recommendationId,
            type: "CLICK",
            ipAddress:
              request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown",
            userAgent: request.headers.get("user-agent") || "unknown",
            referrer: request.headers.get("referer") || null,
          },
        });
      }
    } catch (error) {
      console.error("Click tracking error:", error);
    }
  }

  return NextResponse.redirect(decodedUrl);
}
