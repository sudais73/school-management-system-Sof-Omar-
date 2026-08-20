import { comparePassword, hashPassword } from "@/utils/hash.utils";
import { findUserByEmail, findUserById, setUserOtp } from "../users/users.repository";
import { signToken } from "@/utils/jwt.util";
import prisma from "@/config/prisma";

import { generateRefreshToken, hashRefreshToken } from "@/utils/refresh-token.util";
import { setRefreshToken, clearRefreshToken, findUserByRefreshTokenHash } from "@/modules/users/users.repository";
import { generateOtp } from "@/utils/otp.util";

const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export type LoginResult =
  | { success: true; accessToken: string; refreshToken: string; mustChangePassword: boolean; role: string, userId:string, fullName:string }
  | { success: false; message: string; requiresSetup?: boolean };

export async function loginUser(email: string, plainPassword: string): Promise<LoginResult> {
  const user = await findUserByEmail(email);
  if (!user) return { success: false, message: "Invalid email or password" };

  if (!user.password) {
    return {
      success: false,
      requiresSetup: true,
      message: "Account setup isn't complete. Use the setup code from your administrator.",
    };
  }

  const passwordMatches = await comparePassword(plainPassword, user.password);
  if (!passwordMatches) return { success: false, message: "Invalid email or password" };


  const accessToken = signToken({ userId: user.id, role: user.role });

  const refreshToken = generateRefreshToken();
  const refreshTokenExpiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
  await setRefreshToken(user.id, hashRefreshToken(refreshToken), refreshTokenExpiresAt);

  return {
    success: true as const,
    accessToken,
    refreshToken,
    mustChangePassword: user.mustChangePassword,
    role: user.role,
    userId:user.id,
    fullName:user.fullName


  };




  
}


export async function refreshSession(refreshTokenFromCookie: string) {
  const tokenHash = hashRefreshToken(refreshTokenFromCookie);
  const user = await findUserByRefreshTokenHash(tokenHash);

  if (!user || !user.refreshTokenExpiresAt || user.refreshTokenExpiresAt < new Date()) {
    return { success: false as const, message: "Session expired, please log in again" };
  }

  // Rotate — issue a brand new refresh token and invalidate the old one.
  // This means if a stolen refresh token gets used, the real user's next
  // refresh attempt will fail, which is a signal something's wrong.
  const newRefreshToken = generateRefreshToken();
  const newExpiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
  await setRefreshToken(user.id, hashRefreshToken(newRefreshToken), newExpiresAt);

  const accessToken = signToken({ userId: user.id, role: user.role });

  return { success: true as const, accessToken, refreshToken: newRefreshToken, role: user.role, userId:user.id, fullName:user.fullName };
}

export async function logoutUser(refreshTokenFromCookie: string | undefined) {
  if (!refreshTokenFromCookie) return;
  const tokenHash = hashRefreshToken(refreshTokenFromCookie);
  const user = await findUserByRefreshTokenHash(tokenHash);
  if (user) await clearRefreshToken(user.id);
}

export async function setupAccount(email: string, otp: string, newPassword: string) {
  const user = await findUserByEmail(email);
  if (!user) return { success: false as const, message: "Invalid setup details" };

  if (!user.otp || user.otp !== otp) {
    return { success: false as const, message: "Invalid setup code" };
  }
  if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
    return { success: false as const, message: "Setup code has expired" };
  }

  const hashedPassword = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword, otp: null, otpExpiresAt: null, isVerified: true, mustChangePassword: false },
  });

  return { success: true as const };
}


export async function regenerateSetupOtp(userId: string) {
  const user = await findUserById(userId);
  if (!user) return { success: false as const, message: "User not found" };

  if (user.password) {
    return { success: false as const, message: "This account is already active — OTP regeneration is only for accounts still pending setup" };
  }

  const { otp, expiresAt } = generateOtp();
  await setUserOtp(userId, otp, expiresAt);
  return { success: true as const, otp };
}