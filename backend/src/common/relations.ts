import { HttpError } from "./http-error.js";
import { prisma } from "../prisma/client.js";

export async function ensureClientExists(clientId: string | undefined) {
  if (!clientId) return null;

  const client = await prisma.client.findUnique({
    where: { id: clientId },
    select: { id: true },
  });

  if (!client) {
    throw new HttpError(400, "clientId does not reference an existing client.");
  }

  return client;
}

export async function ensureProjectExists(projectId: string | undefined) {
  if (!projectId) return null;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, clientId: true },
  });

  if (!project) {
    throw new HttpError(400, "projectId does not reference an existing project.");
  }

  return project;
}

export async function ensureProviderExists(providerId: string | undefined) {
  if (!providerId) return null;

  const provider = await prisma.provider.findUnique({
    where: { id: providerId },
    select: { id: true },
  });

  if (!provider) {
    throw new HttpError(400, "providerId does not reference an existing provider.");
  }

  return provider;
}

export async function ensureSubscriptionExists(subscriptionId: string | undefined) {
  if (!subscriptionId) return null;

  const subscription = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
    select: { id: true },
  });

  if (!subscription) {
    throw new HttpError(
      400,
      "subscriptionId does not reference an existing subscription.",
    );
  }

  return subscription;
}

export function ensureClientProjectConsistency(
  clientId: string | undefined,
  projectClientId: string | null | undefined,
) {
  if (clientId && projectClientId && clientId !== projectClientId) {
    throw new HttpError(
      400,
      "clientId is inconsistent with the client associated to projectId.",
    );
  }
}
