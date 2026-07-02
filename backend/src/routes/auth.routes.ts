import { Router } from "express";
import { login, logout, me, refresh } from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { loginRateLimit } from "../middlewares/rate-limit.middleware.js";

export const authRouter = Router();

authRouter.post("/login", loginRateLimit, login);
authRouter.post("/refresh", refresh);
authRouter.post("/logout", logout);
authRouter.get("/me", requireAuth, me);
