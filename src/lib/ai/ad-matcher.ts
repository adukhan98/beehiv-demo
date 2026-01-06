import { prisma } from "@/lib/prisma/client";
import { Category, CampaignStatus } from "@prisma/client";

interface MatchResult {
  creativeId: string;
  score: number;
  reasons: string[];
}

interface MatchingContext {
  creatorId: string;
  issueKeywords: string[];
  issueCategory: Category;
}

export async function matchAdsForIssue(
  context: MatchingContext,
  maxResults: number = 3
): Promise<MatchResult[]> {
  // Fetch creator boundaries
  const boundaries = await prisma.creatorBoundaries.findUnique({
    where: { creatorId: context.creatorId },
  });

  if (!boundaries) {
    return [];
  }

  // Fetch all active campaigns with creatives
  const campaigns = await prisma.campaign.findMany({
    where: {
      status: CampaignStatus.ACTIVE,
      startDate: { lte: new Date() },
      endDate: { gte: new Date() },
    },
    include: {
      advertiser: true,
      creatives: {
        where: { isActive: true },
      },
    },
  });

  const results: MatchResult[] = [];

  for (const campaign of campaigns) {
    for (const creative of campaign.creatives) {
      const reasons: string[] = [];
      let score = 0;
      let blocked = false;

      // === HARD FILTERS ===

      // Check blocked brands
      const advertiserName = campaign.advertiser.name.toLowerCase();
      if (
        boundaries.blockedBrands.some((b) =>
          advertiserName.includes(b.toLowerCase())
        )
      ) {
        blocked = true;
        continue;
      }

      // Check blocked categories
      if (
        campaign.targetCategories.some((cat) =>
          boundaries.blockedCategories.includes(cat)
        )
      ) {
        blocked = true;
        continue;
      }

      // Check allowed categories (if specified)
      if (boundaries.allowedCategories.length > 0) {
        const hasAllowedCategory = campaign.targetCategories.some((cat) =>
          boundaries.allowedCategories.includes(cat)
        );
        if (!hasAllowedCategory) {
          blocked = true;
          continue;
        }
      }

      // Check minimum CPM
      if (boundaries.minCpm && campaign.cpm < boundaries.minCpm) {
        blocked = true;
        continue;
      }

      if (blocked) continue;

      // === SOFT SCORING ===

      // Category match (high weight)
      if (campaign.targetCategories.includes(context.issueCategory)) {
        score += 30;
        reasons.push(`Category match: ${context.issueCategory}`);
      }

      // Keyword overlap (medium weight)
      const keywordMatches = context.issueKeywords.filter((ik) =>
        campaign.targetKeywords.some(
          (tk) =>
            tk.toLowerCase().includes(ik.toLowerCase()) ||
            ik.toLowerCase().includes(tk.toLowerCase())
        )
      );
      if (keywordMatches.length > 0) {
        score += keywordMatches.length * 10;
        reasons.push(
          `Keyword matches: ${keywordMatches.slice(0, 3).join(", ")}`
        );
      }

      // Tone match (low weight)
      if (creative.tone === boundaries.preferredTone) {
        score += 10;
        reasons.push(`Tone match: ${creative.tone}`);
      }

      // CPM bonus (higher paying ads get slight boost)
      score += Math.min(campaign.cpm / 10, 10);

      if (score > 0) {
        results.push({
          creativeId: creative.id,
          score,
          reasons,
        });
      }
    }
  }

  // Sort by score and return top N (respecting maxAdsPerIssue)
  const limit = Math.min(maxResults, boundaries.maxAdsPerIssue);
  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}
