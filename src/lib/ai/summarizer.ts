interface SentenceScore {
  sentence: string;
  score: number;
  position: number;
}

export function summarizeContent(
  text: string,
  maxSentences: number = 3
): string {
  // Split into sentences
  const sentences = text
    .replace(/([.!?])\s+/g, "$1|")
    .split("|")
    .map((s) => s.trim())
    .filter((s) => s.length > 20 && s.length < 500);

  if (sentences.length <= maxSentences) {
    return sentences.join(" ");
  }

  // Calculate word frequencies across all sentences
  const wordFreq: Map<string, number> = new Map();

  sentences.forEach((sentence) => {
    const words = sentence.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    words.forEach((word) => {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
    });
  });

  // Score sentences
  const scored: SentenceScore[] = sentences.map((sentence, index) => {
    const words = sentence.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    let score = 0;

    // Word frequency score
    words.forEach((word) => {
      score += wordFreq.get(word) || 0;
    });

    // Normalize by sentence length
    score = score / Math.max(words.length, 1);

    // Position bonus (first and last sentences often important)
    if (index === 0) score *= 1.5;
    if (index === sentences.length - 1) score *= 1.2;

    // Length bonus (prefer medium-length sentences)
    if (sentence.length > 50 && sentence.length < 200) {
      score *= 1.1;
    }

    return { sentence, score, position: index };
  });

  // Select top sentences and maintain original order
  const topSentences = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSentences)
    .sort((a, b) => a.position - b.position)
    .map((s) => s.sentence);

  return topSentences.join(" ");
}
