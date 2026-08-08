import type { ProtectedRoutesConfig } from "@/types/config.types";

/**
 * Routes that require the password set in PAGE_ACCESS_PASSWORD.
 *
 * Kept in its own module with no runtime dependencies so `middleware.ts` can
 * import it without pulling fonts, JSX or content into the Edge bundle.
 * Enforcement lives in the middleware — RouteGuard only renders the prompt.
 *
 * Example: { "/work": true }
 */
const protectedRoutes: ProtectedRoutesConfig = {};

export { protectedRoutes };
