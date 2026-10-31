import { toOptionalDate } from "./dates.js";
import { toOptionalString } from "./strings.js";

type Input = Record<string, unknown>;

// Campos de texto opcionales para un create: { campo: valor | undefined }.
export function createStringFields<K extends string>(input: Input, keys: readonly K[]) {
  return Object.fromEntries(
    keys.map((key) => [key, toOptionalString(input[key])]),
  ) as Record<K, string | undefined>;
}

// Campos de texto opcionales para un update: solo incluye los que vienen en el input.
// Un valor vacío los limpia (null).
export function updateStringFields<K extends string>(input: Input, keys: readonly K[]) {
  return Object.fromEntries(
    keys
      .filter((key) => input[key] !== undefined)
      .map((key) => [key, toOptionalString(input[key]) ?? null]),
  ) as Partial<Record<K, string | null>>;
}

export function createDateFields<K extends string>(input: Input, keys: readonly K[]) {
  return Object.fromEntries(
    keys.map((key) => [key, toOptionalDate(input[key], key)]),
  ) as Record<K, Date | undefined>;
}

export function updateDateFields<K extends string>(input: Input, keys: readonly K[]) {
  return Object.fromEntries(
    keys
      .filter((key) => input[key] !== undefined)
      .map((key) => [key, toOptionalDate(input[key], key) ?? null]),
  ) as Partial<Record<K, Date | null>>;
}
