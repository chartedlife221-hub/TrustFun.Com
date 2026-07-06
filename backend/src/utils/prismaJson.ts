import type { Prisma } from "@prisma/client";

// Prisma's InputJsonValue type has no room for our concrete array-of-object
// shapes (it's structurally a JSON value, not "whatever TS type you have").
// This cast is safe for plain JSON-serializable data (no methods,
// undefined, etc.) — which is all our JSONB columns ever store.
export function toJson<T>(value: T): Prisma.InputJsonValue {
  return value as unknown as Prisma.InputJsonValue;
}
