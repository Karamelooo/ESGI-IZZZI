const AUTH_ROUTES = ['/auth'];
const ADMIN_ROUTES = ['/classes', '/dashboard', '/feedbacks'];
const FORM_ROUTES = ['/form'];
const UIKIT_ROUTES = ['/ui-kit'];
const PUBLIC_ROUTES = ['/', '/auth', '/pricing', '/desktop-only'];

const isPathInRoutes = (pathname: string, routes: string[]): boolean =>
  routes.some((route) => (route === '/' ? pathname === route : pathname.startsWith(route)));

export const isAuthRoute = (pathname: string): boolean => isPathInRoutes(pathname, AUTH_ROUTES);
export const isUIKitRoute = (pathname: string): boolean => isPathInRoutes(pathname, UIKIT_ROUTES);
export const isAdminRoute = (pathname: string): boolean => isPathInRoutes(pathname, ADMIN_ROUTES);
export const isFormRoute = (pathname: string): boolean => isPathInRoutes(pathname, FORM_ROUTES);
export const isPublicRoute = (pathname: string): boolean => isPathInRoutes(pathname, PUBLIC_ROUTES);

export const isHeaderInApp = (pathname: string): boolean =>
  !isAuthRoute(pathname) &&
  !isAdminRoute(pathname) &&
  !isUIKitRoute(pathname) &&
  !isFormRoute(pathname) &&
  pathname !== '/desktop-only';
