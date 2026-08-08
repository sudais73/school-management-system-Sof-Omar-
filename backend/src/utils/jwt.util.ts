import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = "15m"; 

if (!JWT_SECRET) {
  // Fail loudly at startup rather than silently signing tokens with `undefined`
  throw new Error("JWT_SECRET is not set in the environment");
}

export type JwtPayload = {
  userId: string;
  role: string;
};

/**
 * Issue a signed JWT after successful login. Keep the payload small —
 * just enough to identify the user and check role on every request.
 * Don't put email/password/anything sensitive in here: JWTs are
 * base64-encoded, not encrypted, and anyone can decode the payload.
 */
export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
