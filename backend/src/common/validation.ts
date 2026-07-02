import { HttpError } from "./http-error.js";

export function parseOptionalEnum<T extends string>(
  value: unknown,
  enumValues: Record<string, T>,
  fieldName: string,
) {
  if (value === undefined || value === null || value === "") return undefined;

  if (typeof value !== "string") {
    throw new HttpError(400, `${fieldName} must be a valid value.`);
  }

  const normalized = value.toUpperCase();

  if (!Object.values(enumValues).includes(normalized as T)) {
    throw new HttpError(400, `Invalid ${fieldName}: ${value}.`);
  }

  return normalized as T;
}

export function parseRequiredEnum<T extends string>(
  value: unknown,
  enumValues: Record<string, T>,
  fieldName: string,
) {
  const parsed = parseOptionalEnum(value, enumValues, fieldName);

  if (!parsed) {
    throw new HttpError(400, `${fieldName} is required.`);
  }

  return parsed;
}

export function parseOptionalBoolean(value: unknown, fieldName: string) {
  if (value === undefined || value === null || value === "") return undefined;

  if (typeof value !== "boolean") {
    throw new HttpError(400, `${fieldName} must be boolean.`);
  }

  return value;
}

export function parseOptionalInteger(value: unknown, fieldName: string) {
  if (value === undefined || value === null || value === "") return undefined;

  if (typeof value !== "number" || !Number.isInteger(value)) {
    throw new HttpError(400, `${fieldName} must be an integer.`);
  }

  return value;
}

export function parseRequiredAmount(value: unknown, fieldName: string) {
  if (value === undefined || value === null || value === "") {
    throw new HttpError(400, `${fieldName} is required.`);
  }

  const amount = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(amount) || amount < 0) {
    throw new HttpError(400, `${fieldName} must be a positive number.`);
  }

  return amount;
}

export function parseOptionalAmount(value: unknown, fieldName: string) {
  if (value === undefined || value === null || value === "") return undefined;

  const amount = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(amount) || amount < 0) {
    throw new HttpError(400, `${fieldName} must be a positive number.`);
  }

  return amount;
}
