import { comparePassword } from "../../utils/hash.utils";
import { findUserByEmail } from "../users/users.repository";
import { signToken } from "../../utils/jwt.util";


export async function loginUser(email: string, plainPassword: string) {
  const user = await findUserByEmail(email);
  if (!user) return { success: false as const, message: "Invalid email or password" };

  const passwordMatches = await comparePassword(plainPassword, user.password);
  if (!passwordMatches) return { success: false as const, message: "Invalid email or password" };

  const token = signToken({ userId: user.id, role: user.role });
  return { success: true as const, token, mustChangePassword: user.mustChangePassword, role: user.role };
}