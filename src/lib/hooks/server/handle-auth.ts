import { SessionService } from '$lib/server/services/session-service';
import type { Handle } from '@sveltejs/kit';

export const handleAuth: Handle = async ({ event, resolve }) => {
  const sessionService = new SessionService();

  const sessionToken = sessionService.getCookie(event);
  if (!sessionToken) {
    event.locals.user = null;
    event.locals.session = null;
    return resolve(event);
  }

  const { session, user } = await sessionService.validate(sessionToken);
  if (session) {
    sessionService.setCookie(event, sessionToken, session.expiresAt);
  } else {
    sessionService.deleteCookie(event);
  }

  event.locals.user = user;
  event.locals.session = session;

  return resolve(event);
};
