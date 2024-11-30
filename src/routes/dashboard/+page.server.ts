import { SessionService } from '$lib/server/services/session-service.js';
import { redirect } from '@sveltejs/kit';

export const actions = {
  logout: async (event) => {
    const sessionService = new SessionService();
    sessionService.invalidate(event.locals.session!.id);
    sessionService.deleteCookie(event);

    return redirect(302, '/login');
  },
};
