import type { Prisma } from "@prisma/client";
import type { Request } from "express";
import { toOptionalDate } from "../common/dates.js";
import { HttpError } from "../common/http-error.js";
import { toOptionalString } from "../common/strings.js";
import { prisma } from "../prisma/client.js";

type AuditInput = {
  request?: Request;
  userId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: unknown;
};

const sensitiveKeyPattern = /password|token|secret|authorization|cookie|apiKey/i;
const maxMetadataDepth = 4;
const maxStringLength = 500;

function sanitizeMetadata(value: unknown, depth = 0): Prisma.InputJsonValue {
  if (depth > maxMetadataDepth) return "[Max depth]";

  if (value === null) {
    return "[null]";
  }

  if (typeof value === "boolean" || typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    return value.length > maxStringLength
      ? `${value.slice(0, maxStringLength)}...`
      : value;
  }

  if (Array.isArray(value)) {
    return value
      .slice(0, 20)
      .map((item) => sanitizeMetadata(item, depth + 1));
  }

  if (typeof value === "object" && value) {
    const sanitized: Record<string, Prisma.InputJsonValue> = {};

    for (const [key, item] of Object.entries(value)) {
      sanitized[key] = sensitiveKeyPattern.test(key)
        ? "[REDACTED]"
        : sanitizeMetadata(item, depth + 1);
    }

    return sanitized;
  }

  return String(value);
}

function requestUserId(request: Request | undefined, userId?: string | null) {
  return userId ?? request?.user?.sub ?? null;
}

export async function recordAuditLog(input: AuditInput) {
  try {
    return await prisma.auditLog.create({
      data: {
        userId: requestUserId(input.request, input.userId),
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId ?? null,
        metadata:
          input.metadata === undefined
            ? undefined
            : sanitizeMetadata(input.metadata),
        ip: input.request?.ip,
        userAgent: input.request?.headers["user-agent"],
      },
    });
  } catch (error) {
    console.error("Failed to record audit log", error);
    return null;
  }
}

export async function auditEntityMutation(
  request: Request,
  action: string,
  entityType: string,
  entity: { id?: string | null; status?: unknown } | null | undefined,
  metadata?: unknown,
) {
  await recordAuditLog({
    request,
    action,
    entityType,
    entityId: entity?.id ?? null,
    metadata: {
      ...((typeof metadata === "object" && metadata !== null) ? metadata : {}),
      status: entity?.status,
    },
  });
}

function queryValue(value: unknown) {
  if (Array.isArray(value)) return value[0];
  return value;
}

function parseLimit(value: unknown) {
  if (value === undefined) return 50;

  const limit = Number(queryValue(value));

  if (!Number.isInteger(limit) || limit < 1 || limit > 200) {
    throw new HttpError(400, "limit must be an integer between 1 and 200.");
  }

  return limit;
}

export async function listAuditLogs(query: Request["query"]) {
  const action = toOptionalString(queryValue(query.action));
  const entityType = toOptionalString(queryValue(query.entityType));
  const userId = toOptionalString(queryValue(query.userId));
  const from = toOptionalDate(queryValue(query.from), "from");
  const to = toOptionalDate(queryValue(query.to), "to");

  return prisma.auditLog.findMany({
    take: parseLimit(query.limit),
    where: {
      ...(action ? { action } : {}),
      ...(entityType ? { entityType } : {}),
      ...(userId ? { userId } : {}),
      ...(from || to
        ? {
            createdAt: {
              ...(from ? { gte: from } : {}),
              ...(to ? { lte: to } : {}),
            },
          }
        : {}),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: [{ createdAt: "desc" }],
  });
}

export async function getAuditLogById(id: string) {
  const auditLog = await prisma.auditLog.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  if (!auditLog) {
    throw new HttpError(404, "Audit log not found.");
  }

  return auditLog;
}
