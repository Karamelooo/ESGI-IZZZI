const ADMIN_ROUTES = ['/classes', '/dashboard'];
const AUTH_ROUTES = ['/auth'];
const UIKIT_ROUTES = ['/ui-kit'];

const isPathInRoutes = (pathname: string, routes: string[]): boolean =>
  routes.some((route) => pathname.startsWith(route));

export const isAdminRoute = (pathname: string): boolean => isPathInRoutes(pathname, ADMIN_ROUTES);
export const isAuthRoute = (pathname: string): boolean => isPathInRoutes(pathname, AUTH_ROUTES);
export const isUIKitRoute = (pathname: string): boolean => isPathInRoutes(pathname, UIKIT_ROUTES);

export const isHeaderInApp = (pathname: string): boolean =>
  !isAuthRoute(pathname) && !isAdminRoute(pathname) && !isUIKitRoute(pathname);
