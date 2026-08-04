import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

/**
 * Hash a plaintext password before storing it.
 * Never store req.body.password directly — always pass it through this first.
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

/**
 * Compare a login attempt's plaintext password against the stored hash.
 * Returns true/false — never throws on mismatch, so callers can respond
 * with a generic "invalid credentials" message either way.
 */
export async function comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}
