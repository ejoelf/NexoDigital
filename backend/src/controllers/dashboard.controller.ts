import type { Request, Response } from "express";
import { parseAlertDays } from "../services/alerts.service.js";
import {
  getDashboardFinancials,
  getDashboardOperations,
  getDashboardOverview,
  getDashboardRecentActivity,
} from "../services/dashboard.service.js";

function requestDays(request: Request) {
  return parseAlertDays(request.query.days);
}

export async function showDashboardOverview(
  request: Request,
  response: Response,
) {
  response.json({
    ok: true,
    overview: await getDashboardOverview(requestDays(request)),
  });
}

export async function showDashboardOperations(
  request: Request,
  response: Response,
) {
  response.json({
    ok: true,
    operations: await getDashboardOperations(requestDays(request)),
  });
}

export async function showDashboardFinancials(
  request: Request,
  response: Response,
) {
  response.json({
    ok: true,
    financials: await getDashboardFinancials(requestDays(request)),
  });
}

export async function showDashboardRecentActivity(
  _request: Request,
  response: Response,
) {
  response.json({
    ok: true,
    recentActivity: await getDashboardRecentActivity(),
  });
}
