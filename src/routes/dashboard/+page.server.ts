import * as auth from '$lib/server/auth';
import { redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
  logout: async (event) => {
    await auth.invalidateSession(event.locals.session!.id);
    auth.deleteSessionTokenCookie(event);

    return redirect(302, '/login');
  },
};
