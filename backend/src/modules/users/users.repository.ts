import  prisma  from "@/config/prisma";
import type { Role  } from "@prisma/client";

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export function createUser(data: { email: string; password: string; fullName: string; role: Role }) {
  return prisma.user.create({ data });
}