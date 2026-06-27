import { UserStatus, type User } from "@prisma/client";
import { prisma } from "../prisma/client.js";
import { verifyPassword } from "./password.service.js";
import {
  getRefreshTokenExpiresAt,
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "./token.service.js";

type PublicUser = {
  id: string;
  name: string;
  email: string;
  role: User["role"];
  status: User["status"];
};

function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  };
}

function createTokenPayload(user: User) {
  return {
    sub: user.id,
    email: user.email,
    role: user.role,
  };
}

async function createRefreshToken(user: User) {
  const refreshToken = signRefreshToken(createTokenPayload(user));

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: getRefreshTokenExpiresAt(),
    },
  });

  return refreshToken;
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (!user || user.status !== UserStatus.ACTIVE) {
    return null;
  }

  const isValidPassword = await verifyPassword(password, user.passwordHash);

  if (!isValidPassword) {
    return null;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  return {
    user: toPublicUser(user),
    accessToken: signAccessToken(createTokenPayload(user)),
    refreshToken: await createRefreshToken(user),
  };
}

export async function refreshUserToken(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken);
  const tokenHash = hashToken(refreshToken);

  const storedToken = await prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (
    !storedToken ||
    storedToken.revokedAt ||
    storedToken.expiresAt < new Date() ||
    storedToken.userId !== payload.sub ||
    storedToken.user.status !== UserStatus.ACTIVE
  ) {
    return null;
  }

  await prisma.refreshToken.update({
    where: { id: storedToken.id },
    data: { revokedAt: new Date() },
  });

  return {
    user: toPublicUser(storedToken.user),
    accessToken: signAccessToken(createTokenPayload(storedToken.user)),
    refreshToken: await createRefreshToken(storedToken.user),
  };
}

export async function logoutUser(refreshToken: string) {
  await prisma.refreshToken.updateMany({
    where: {
      tokenHash: hashToken(refreshToken),
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}

export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  return user ? toPublicUser(user) : null;
}
