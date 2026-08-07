import prisma from "@/config/prisma";

export async function generateStaffId(): Promise<string> {
  const count = await prisma.teacher.count();
  return `TCH-${(count + 1).toString().padStart(4, "0")}`;
}