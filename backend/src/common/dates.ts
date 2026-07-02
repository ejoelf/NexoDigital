import { HttpError } from "./http-error.js";

export function toOptionalDate(value: unknown, fieldName: string) {
  if (value === undefined || value === null || value === "") return undefined;

  if (typeof value !== "string") {
    throw new HttpError(400, `${fieldName} must be a valid ISO date string.`);
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new HttpError(400, `${fieldName} must be a valid ISO date string.`);
  }

  return date;
}
