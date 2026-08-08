import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: Number(process.env.PORT) || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: process.env.DATABASE_URL || "",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
  JWT_SECRET: process.env.JWT_SECRET || "",
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || "1h",
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "",
  REFRESH_TOKEN_EXPIRATION: process.env.REFRESH_TOKEN_EXPIRATION || "30d",
};