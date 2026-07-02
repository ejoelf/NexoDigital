import type { Request, Response } from "express";
import {
  cancelSubscription,
  createSubscription,
  getSubscriptionById,
  listSubscriptions,
  updateSubscription,
} from "../services/subscriptions.service.js";

function routeId(request: Request) {
  return String(request.params.id);
}

export async function indexSubscriptions(_request: Request, response: Response) {
  response.json({ ok: true, subscriptions: await listSubscriptions() });
}

export async function showSubscription(request: Request, response: Response) {
  response.json({
    ok: true,
    subscription: await getSubscriptionById(routeId(request)),
  });
}

export async function storeSubscription(request: Request, response: Response) {
  response.status(201).json({
    ok: true,
    subscription: await createSubscription(request.body),
  });
}

export async function putSubscription(request: Request, response: Response) {
  response.json({
    ok: true,
    subscription: await updateSubscription(routeId(request), request.body),
  });
}

export async function destroySubscription(request: Request, response: Response) {
  response.json({
    ok: true,
    subscription: await cancelSubscription(routeId(request)),
  });
}
