import type { UserRole } from "@prisma/client";

export type AuthTokenPayload = {
  sub: string;
  email: string;
  role: UserRole;
};

export type AuthenticatedUser = AuthTokenPayload;
