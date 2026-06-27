import type { Request, Response } from "express";
import {
  getUserById,
  loginUser,
  logoutUser,
  refreshUserToken,
} from "../services/auth.service.js";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function login(request: Request, response: Response) {
  const { email, password } = request.body as {
    email?: unknown;
    password?: unknown;
  };

  if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
    response.status(400).json({
      ok: false,
      message: "Email and password are required.",
    });
    return;
  }

  const result = await loginUser(email, password);

  if (!result) {
    response.status(401).json({
      ok: false,
      message: "Invalid credentials.",
    });
    return;
  }

  response.json({
    ok: true,
    ...result,
  });
}

export async function refresh(request: Request, response: Response) {
  const { refreshToken } = request.body as {
    refreshToken?: unknown;
  };

  if (!isNonEmptyString(refreshToken)) {
    response.status(400).json({
      ok: false,
      message: "Refresh token is required.",
    });
    return;
  }

  const result = await refreshUserToken(refreshToken);

  if (!result) {
    response.status(401).json({
      ok: false,
      message: "Invalid refresh token.",
    });
    return;
  }

  response.json({
    ok: true,
    ...result,
  });
}

export async function logout(request: Request, response: Response) {
  const { refreshToken } = request.body as {
    refreshToken?: unknown;
  };

  if (isNonEmptyString(refreshToken)) {
    await logoutUser(refreshToken);
  }

  response.json({
    ok: true,
  });
}

export async function me(request: Request, response: Response) {
  if (!request.user) {
    response.status(401).json({
      ok: false,
      message: "Unauthorized.",
    });
    return;
  }

  const user = await getUserById(request.user.sub);

  if (!user) {
    response.status(404).json({
      ok: false,
      message: "User not found.",
    });
    return;
  }

  response.json({
    ok: true,
    user,
  });
}
