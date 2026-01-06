const STOPWORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "but",
  "in",
  "on",
  "at",
  "to",
  "for",
  "of",
  "with",
  "by",
  "from",
  "as",
  "is",
  "was",
  "are",
  "were",
  "been",
  "be",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "could",
  "should",
  "may",
  "might",
  "must",
  "shall",
  "can",
  "need",
  "this",
  "that",
  "these",
  "those",
  "it",
  "its",
  "they",
  "them",
  "their",
  "we",
  "us",
  "our",
  "you",
  "your",
  "he",
  "she",
  "him",
  "her",
  "his",
  "i",
  "me",
  "my",
  "mine",
  "who",
  "what",
  "when",
  "where",
  "why",
  "how",
  "which",
  "there",
  "here",
  "all",
  "each",
  "every",
  "both",
  "few",
  "more",
  "most",
  "other",
  "some",
  "such",
  "no",
  "nor",
  "not",
  "only",
  "own",
  "same",
  "so",
  "than",
  "too",
  "very",
  "just",
  "also",
  "now",
  "about",
  "into",
  "over",
  "after",
  "before",
  "between",
  "through",
  "during",
  "above",
  "below",
  "up",
  "down",
  "out",
  "off",
  "then",
  "once",
  "any",
  "if",
  "because",
  "while",
  "although",
  "though",
  "until",
  "unless",
  "since",
  "being",
  "get",
  "got",
  "getting",
  "make",
  "made",
  "making",
  "like",
  "really",
  "even",
  "still",
  "much",
  "many",
  "well",
  "way",
  "thing",
  "things",
  "one",
  "two",
  "first",
  "new",
  "year",
  "years",
  "time",
  "going",
  "know",
  "want",
  "think",
  "see",
  "look",
  "use",
  "used",
  "using",
]);

interface KeywordResult {
  keyword: string;
  score: number;
  frequency: number;
}

export function extractKeywords(
  text: string,
  maxKeywords: number = 15
): string[] {
  // Clean and tokenize
  const cleanText = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = cleanText
    .split(" ")
    .filter((word) => word.length > 2 && !STOPWORDS.has(word));

  // Calculate word frequency
  const wordFreq: Map<string, number> = new Map();
  words.forEach((word) => {
    wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
  });

  // Extract bi-grams for phrases
  const phrases: Map<string, number> = new Map();
  for (let i = 0; i < words.length - 1; i++) {
    const bigram = `${words[i]} ${words[i + 1]}`;
    phrases.set(bigram, (phrases.get(bigram) || 0) + 1);
  }

  // Score keywords
  const scored: KeywordResult[] = [];

  wordFreq.forEach((freq, word) => {
    if (freq >= 2) {
      scored.push({
        keyword: word,
        score: freq * (1 + word.length / 10),
        frequency: freq,
      });
    }
  });

  // Add high-frequency phrases
  phrases.forEach((freq, phrase) => {
    if (freq >= 2) {
      scored.push({
        keyword: phrase,
        score: freq * 1.5 * (1 + phrase.split(" ").length * 0.3),
        frequency: freq,
      });
    }
  });

  // Sort by score and return top N
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, maxKeywords)
    .map((k) => k.keyword);
}
