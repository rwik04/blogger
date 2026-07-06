/**
 * Frontend env access. `NEXT_PUBLIC_*` vars are inlined at build time by
 * Next.js, so this is safe to import from client components too.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8000";
