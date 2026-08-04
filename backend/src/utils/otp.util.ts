/**
 * Generates a 6-digit numeric OTP and its expiry timestamp.
 * Used by the forgot-password flow — see auth.service.ts.
 */
export function generateOtp(): { otp: string; expiresAt: Date } {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // always 6 digits
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // valid for 10 minutes
  return { otp, expiresAt };
}
