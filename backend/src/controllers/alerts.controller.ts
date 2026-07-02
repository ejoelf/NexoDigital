import type { Request, Response } from "express";
import {
  getActiveSubscriptions,
  getAlertsSummary,
  getExpiredRenewals,
  getExpiringDomains,
  getRecurringCosts,
  getUpcomingRenewals,
  parseAlertDays,
} from "../services/alerts.service.js";

function requestDays(request: Request) {
  return parseAlertDays(request.query.days);
}

export async function showAlertsSummary(request: Request, response: Response) {
  response.json({
    ok: true,
    summary: await getAlertsSummary(requestDays(request)),
  });
}

export async function indexUpcomingRenewals(
  request: Request,
  response: Response,
) {
  const days = requestDays(request);

  response.json({
    ok: true,
    days,
    renewals: await getUpcomingRenewals(days),
  });
}

export async function indexExpiredRenewals(
  _request: Request,
  response: Response,
) {
  response.json({
    ok: true,
    renewals: await getExpiredRenewals(),
  });
}

export async function indexExpiringDomains(request: Request, response: Response) {
  const days = requestDays(request);

  response.json({
    ok: true,
    days,
    domains: await getExpiringDomains(days),
  });
}

export async function indexActiveSubscriptions(
  _request: Request,
  response: Response,
) {
  response.json({
    ok: true,
    subscriptions: await getActiveSubscriptions(),
  });
}

export async function indexRecurringCosts(_request: Request, response: Response) {
  response.json({
    ok: true,
    costs: await getRecurringCosts(),
  });
}
