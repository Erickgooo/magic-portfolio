"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { routes } from "@/resources";
import { Flex, Spinner } from "@once-ui-system/core";
import NotFound from "@/app/not-found";

interface RouteGuardProps {
  children: React.ReactNode;
}

/**
 * Hides routes disabled in the `routes` config.
 *
 * Password protection is NOT handled here — middleware.ts enforces it on the
 * server before the page is ever rendered. Doing it in the client would ship
 * the protected content in the RSC payload regardless of what is displayed.
 */
const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const pathname = usePathname();
  const [isRouteEnabled, setIsRouteEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRouteEnabled = () => {
      if (!pathname) return false;

      // Rendered by the middleware rewrite for protected routes; never in `routes`.
      if (pathname === "/unauthorized") return true;

      if (pathname in routes) {
        return routes[pathname as keyof typeof routes];
      }

      const dynamicRoutes = ["/blog", "/work"] as const;
      for (const route of dynamicRoutes) {
        if (pathname?.startsWith(route) && routes[route]) {
          return true;
        }
      }

      return false;
    };

    setIsRouteEnabled(checkRouteEnabled());
    setLoading(false);
  }, [pathname]);

  if (loading) {
    return (
      <Flex fillWidth paddingY="128" horizontal="center">
        <Spinner />
      </Flex>
    );
  }

  if (!isRouteEnabled) {
    return <NotFound />;
  }

  return <>{children}</>;
};

export { RouteGuard };
