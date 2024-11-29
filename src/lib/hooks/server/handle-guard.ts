import { redirect, type Handle } from '@sveltejs/kit';

export const handleGuard: Handle = async ({ event, resolve }) => {
  const routeId = event.route.id;

  if (!routeId) {
    return resolve(event);
  }

  publicGuard(routeId, event.locals.user);
  dashboardGuard(routeId, event.locals.user);
  adminGuard(routeId, event.locals.user);

  return resolve(event);
};

/**
 * Guard public routes from authenticated users
 */
function publicGuard(route: string, user?: App.Locals['user']) {
  if (route.includes('/(public)') && user) {
    throw redirect(303, '/dashboard');
  }
}

/**
 * Guard private routes from unauthenticated users
 */
function dashboardGuard(route: string, user?: App.Locals['user']) {
  if (route.includes('/dashboard') && !user) {
    throw redirect(303, '/login');
  }
}

/**
 * Guard admin routes from non-admin users
 */
function adminGuard(route: string, user?: App.Locals['user']) {
  if (route.includes('/admin') && (!user || user.role !== 'admin')) {
    throw redirect(303, '/dashboard');
  }
}
