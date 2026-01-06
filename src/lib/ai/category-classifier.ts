import { Category } from "@prisma/client";
import { CATEGORY_KEYWORDS } from "@/config/keywords";

interface CategoryScore {
  category: Category;
  score: number;
  matchedKeywords: string[];
}

export function classifyCategory(
  text: string,
  extractedKeywords: string[]
): Category {
  const scores = getCategoryScores(text, extractedKeywords);
  return scores.length > 0 ? scores[0].category : "OTHER";
}

export function getCategoryScores(
  text: string,
  extractedKeywords: string[]
): CategoryScore[] {
  const lowerText = text.toLowerCase();
  const lowerKeywords = extractedKeywords.map((k) => k.toLowerCase());

  const scores: CategoryScore[] = [];

  for (const [category, categoryKeywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (category === "OTHER") continue;

    let score = 0;
    const matched: string[] = [];

    for (const keyword of categoryKeywords) {
      // Check in extracted keywords (higher weight)
      if (
        lowerKeywords.some(
          (k) => k.includes(keyword) || keyword.includes(k)
        )
      ) {
        score += 3;
        if (!matched.includes(keyword)) {
          matched.push(keyword);
        }
      }
      // Check in full text (lower weight)
      else if (lowerText.includes(keyword)) {
        score += 1;
        if (!matched.includes(keyword)) {
          matched.push(keyword);
        }
      }
    }

    if (score > 0) {
      scores.push({
        category: category as Category,
        score,
        matchedKeywords: matched.slice(0, 5), // Top 5 matched keywords
      });
    }
  }

  // Sort by score descending
  return scores.sort((a, b) => b.score - a.score);
}
