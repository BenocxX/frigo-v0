import { hash } from '@node-rs/argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { fail, redirect } from '@sveltejs/kit';

import { setError, superValidate } from 'sveltekit-superforms';
import { registerSchema } from './schema';
import { zod } from 'sveltekit-superforms/adapters';
import { db } from '$lib/server/prisma';
import { SessionService } from '$lib/server/services/session-service';

export const load = async () => {
  return {
    form: await superValidate(zod(registerSchema)),
  };
};

export const actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(registerSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { username, password } = form.data;

    const userId = generateUserId();
    const passwordHash = await hash(password, {
      // recommended minimum parameters
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    try {
      await db.user.create({
        data: {
          id: userId,
          username,
          passwordHash,
        },
      });

      const sessionService = new SessionService();

      const sessionToken = sessionService.generateToken();
      const session = await sessionService.create(sessionToken, userId);
      sessionService.setCookie(event, sessionToken, session.expiresAt);
    } catch {
      return setError(form, 'username', "Nom d'utilisateur déjà utilisé");
    }

    return redirect(302, '/dashboard');
  },
};

function generateUserId() {
  // ID with 120 bits of entropy, or about the same as UUID v4.
  const bytes = crypto.getRandomValues(new Uint8Array(15));
  const id = encodeBase32LowerCase(bytes);
  return id;
}
