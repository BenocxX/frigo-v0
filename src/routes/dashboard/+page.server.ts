import * as auth from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export const actions = {
  logout: async (event) => {
    await auth.invalidateSession(event.locals.session!.id);
    auth.deleteSessionTokenCookie(event);

    return redirect(302, '/login');
  },
};
