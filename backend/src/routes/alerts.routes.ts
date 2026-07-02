import { Router } from "express";
import {
  indexActiveSubscriptions,
  indexExpiredRenewals,
  indexExpiringDomains,
  indexRecurringCosts,
  indexUpcomingRenewals,
  showAlertsSummary,
} from "../controllers/alerts.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

export const alertsRouter = Router();

alertsRouter.use(requireAuth);

alertsRouter.get("/summary", showAlertsSummary);
alertsRouter.get("/upcoming-renewals", indexUpcomingRenewals);
alertsRouter.get("/expired-renewals", indexExpiredRenewals);
alertsRouter.get("/expiring-domains", indexExpiringDomains);
alertsRouter.get("/active-subscriptions", indexActiveSubscriptions);
alertsRouter.get("/recurring-costs", indexRecurringCosts);
