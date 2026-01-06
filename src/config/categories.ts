import { Category } from "@prisma/client";

export const CATEGORY_LABELS: Record<Category, string> = {
  TECHNOLOGY: "Technology",
  FINANCE: "Finance",
  HEALTH: "Health & Wellness",
  LIFESTYLE: "Lifestyle",
  BUSINESS: "Business",
  EDUCATION: "Education",
  ENTERTAINMENT: "Entertainment",
  MARKETING: "Marketing",
  SAAS: "SaaS",
  AI_ML: "AI & Machine Learning",
  OTHER: "Other",
};

export const CATEGORY_OPTIONS = Object.entries(CATEGORY_LABELS).map(
  ([value, label]) => ({
    value: value as Category,
    label,
  })
);
