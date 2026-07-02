import { Router } from "express";
import {
  showDashboardFinancials,
  showDashboardOperations,
  showDashboardOverview,
  showDashboardRecentActivity,
} from "../controllers/dashboard.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

export const dashboardRouter = Router();

dashboardRouter.use(requireAuth);

dashboardRouter.get("/overview", showDashboardOverview);
dashboardRouter.get("/operations", showDashboardOperations);
dashboardRouter.get("/financials", showDashboardFinancials);
dashboardRouter.get("/recent-activity", showDashboardRecentActivity);
