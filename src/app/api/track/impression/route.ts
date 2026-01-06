import { prisma } from "@/lib/prisma/client";
import { NextRequest, NextResponse } from "next/server";

// 1x1 transparent GIF
const PIXEL_GIF = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64"
);

export async function GET(request: NextRequest) {
  const recommendationId = request.nextUrl.searchParams.get("rid");

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
            type: "IMPRESSION",
            ipAddress:
              request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown",
            userAgent: request.headers.get("user-agent") || "unknown",
            referrer: request.headers.get("referer") || null,
          },
        });
      }
    } catch (error) {
      console.error("Tracking error:", error);
    }
  }

  return new NextResponse(PIXEL_GIF, {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}
