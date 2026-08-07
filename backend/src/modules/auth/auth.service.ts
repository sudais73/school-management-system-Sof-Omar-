import { comparePassword, hashPassword } from "@/utils/hash.utils";
import { findUserByEmail } from "../users/users.repository";
import { signToken } from "@/utils/jwt.util";
import prisma from "@/config/prisma";


export type LoginResult =
  | { success: true; token: string; mustChangePassword: boolean; role: string }
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

  const token = signToken({ userId: user.id, role: user.role });
  return { success: true, token, mustChangePassword: user.mustChangePassword, role: user.role };
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