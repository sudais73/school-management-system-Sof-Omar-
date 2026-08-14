export function gradeFor(total: number, grandMax: number): string {
  if (!grandMax) return "—";
  const pct = (total / grandMax) * 100;
  if (pct >= 70) return "A";
  if (pct >= 60) return "B";
  if (pct >= 50) return "C";
  if (pct >= 45) return "D";
  return "F";
}

export function remarkFor(grade: string): string {
  return { A: "Excellent", B: "Very Good", C: "Good", D: "Fair, needs improvement", F: "Needs urgent support" }[grade] ?? "";
}