import prisma  from "@/config/prisma";

export async function generateAdmissionNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.student.count();
  return `ULD-${year}-${(count + 1).toString().padStart(4, "0")}`;
}