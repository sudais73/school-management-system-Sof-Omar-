import  prisma  from "@/config/prisma";
import type { Role  } from "@prisma/client";


export function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export function createUser(data: { email: string; password: string; fullName: string; role: Role }) {
  return prisma.user.create({ data });
}


export function setRefreshToken(userId: string, tokenHash: string, expiresAt: Date) {
  return prisma.user.update({ where: { id: userId }, data: { refreshTokenHash: tokenHash, refreshTokenExpiresAt: expiresAt } });
}

export function clearRefreshToken(userId: string) {
  return prisma.user.update({ where: { id: userId }, data: { refreshTokenHash: null, refreshTokenExpiresAt: null } });
}

export function findUserByRefreshTokenHash(tokenHash: string) {
  return prisma.user.findFirst({ where: { refreshTokenHash: tokenHash } });
}

export function findUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export function setUserOtp(id: string, otp: string, otpExpiresAt: Date) {
  return prisma.user.update({ where: { id }, data: { otp, otpExpiresAt } });
}

export function clearUserOtp(id: string) {
  return prisma.user.update({ where: { id }, data: { otp: null, otpExpiresAt: null } });
}