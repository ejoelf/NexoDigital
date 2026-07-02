import type { Request, Response } from "express";
import { auditEntityMutation } from "../services/audit.service.js";
import {
  archiveDomain,
  createDomain,
  getDomainById,
  listDomains,
  updateDomain,
} from "../services/domains.service.js";

function routeId(request: Request) {
  return String(request.params.id);
}

export async function indexDomains(_request: Request, response: Response) {
  response.json({ ok: true, domains: await listDomains() });
}

export async function showDomain(request: Request, response: Response) {
  response.json({ ok: true, domain: await getDomainById(routeId(request)) });
}

export async function storeDomain(request: Request, response: Response) {
  const domain = await createDomain(request.body);
  await auditEntityMutation(request, "DOMAIN_CREATED", "DOMAIN", domain);

  response.status(201).json({
    ok: true,
    domain,
  });
}

export async function putDomain(request: Request, response: Response) {
  const domain = await updateDomain(routeId(request), request.body);
  await auditEntityMutation(request, "DOMAIN_UPDATED", "DOMAIN", domain);

  response.json({
    ok: true,
    domain,
  });
}

export async function destroyDomain(request: Request, response: Response) {
  const domain = await archiveDomain(routeId(request));
  await auditEntityMutation(request, "DOMAIN_ARCHIVED", "DOMAIN", domain);

  response.json({
    ok: true,
    domain,
  });
}
