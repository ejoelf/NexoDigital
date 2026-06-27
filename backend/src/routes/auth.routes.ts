import { Router } from "express";
import { login, logout, me, refresh } from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

export const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/refresh", refresh);
authRouter.post("/logout", logout);
authRouter.get("/me", requireAuth, me);
