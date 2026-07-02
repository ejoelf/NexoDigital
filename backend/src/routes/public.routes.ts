import { Router } from "express";
import { indexPublicWorks } from "../controllers/works.controller.js";

export const publicRouter = Router();

publicRouter.get("/works", indexPublicWorks);
