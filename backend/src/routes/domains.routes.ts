import { UserRole } from "@prisma/client";
import { Router } from "express";
import {
  destroyDomain,
  indexDomains,
  putDomain,
  showDomain,
  storeDomain,
} from "../controllers/domains.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/roles.middleware.js";

export const domainsRouter = Router();

domainsRouter.use(requireAuth);

domainsRouter.get("/", indexDomains);
domainsRouter.get("/:id", showDomain);
domainsRouter.post(
  "/",
  requireRole([UserRole.ADMIN, UserRole.MEMBER]),
  storeDomain,
);
domainsRouter.put(
  "/:id",
  requireRole([UserRole.ADMIN, UserRole.MEMBER]),
  putDomain,
);
domainsRouter.delete(
  "/:id",
  requireRole([UserRole.ADMIN, UserRole.MEMBER]),
  destroyDomain,
);
