import dotenv from "dotenv";

dotenv.config();

function parseOrigins(value: string | undefined): string[] {
  if (!value) return [];

  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  corsOrigins: parseOrigins(process.env.CORS_ORIGIN),
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET ?? "",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET ?? "",
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",
};
