const ADMIN_ROUTES = ['/classes', '/dashboard'];
const AUTH_ROUTES = ['/auth'];

const isPathInRoutes = (pathname: string, routes: string[]): boolean =>
  routes.some((route) => pathname.startsWith(route));

export const isAdminRoute = (pathname: string): boolean => isPathInRoutes(pathname, ADMIN_ROUTES);
export const isAuthRoute = (pathname: string): boolean => isPathInRoutes(pathname, AUTH_ROUTES);
