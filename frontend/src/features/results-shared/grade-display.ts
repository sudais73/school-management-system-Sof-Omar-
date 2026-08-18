export const gradeColor: Record<string, string> = {
  A: "text-evergreen-deep",
  B: "text-ink",
  C: "text-marigold-deep",
  D: "text-orange-600",
  F: "text-red-600",
};

export function scoreColor(score: number, maxScore: number) {
  const pct = (score / maxScore) * 100;
  if (pct >= 70) return "text-evergreen-deep font-semibold";
  if (pct >= 60) return "text-ink font-semibold";
  if (pct >= 50) return "text-marigold-deep font-semibold";
  if (pct >= 45) return "text-orange-600 font-semibold";
  return "text-red-600 font-semibold";
}