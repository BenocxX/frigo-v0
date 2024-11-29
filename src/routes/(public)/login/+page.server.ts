import { verify } from '@node-rs/argon2';
import { fail, redirect } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';

import { setError, superValidate } from 'sveltekit-superforms';
import { loginSchema } from './schema';
import { zod } from 'sveltekit-superforms/adapters';
import { db } from '$lib/server/prisma';

export const load = async () => {
  return {
    form: await superValidate(zod(loginSchema)),
  };
};

export const actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(loginSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { username, password } = form.data;

    const existingUser = await db.user.findFirst({
      where: {
        username: {
          equals: username,
        },
      },
    });

    if (!existingUser) {
      return setError(form, 'username', "Nom d'utilisateur ou mot de passe incorrect");
    }

    const validPassword = await verify(existingUser.passwordHash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
    if (!validPassword) {
      return setError(form, 'username', "Nom d'utilisateur ou mot de passe incorrect");
    }

    const sessionToken = auth.generateSessionToken();
    const session = await auth.createSession(sessionToken, existingUser.id);
    auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

    return redirect(302, '/dashboard');
  },
};
