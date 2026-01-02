const ADMIN_ROUTES = ['/classes', '/dashboard'];

export const isAdminRoute = (pathname: string): boolean => {
  return ADMIN_ROUTES.some((route) => pathname.startsWith(route));
};
