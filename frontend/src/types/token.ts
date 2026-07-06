// Re-exported from the shared workspace package so frontend and backend
// stay on one definition. Kept as a shim (rather than updating every
// `from "../types/token"` import site) to avoid unnecessary import churn.
export * from "@trustfun/shared/types";
