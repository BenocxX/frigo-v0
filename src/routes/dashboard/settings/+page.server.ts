import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { resetPasswordSchema } from './schema.js';
import { hash, verify } from '@node-rs/argon2';
import { db } from '$lib/server/prisma.js';

export const load = async () => {
  return {
    resetPasswordForm: await superValidate(zod(resetPasswordSchema)),
  };
};

export const actions = {
  resetPassword: async (event) => {
    const form = await superValidate(event, zod(resetPasswordSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const user = await db.user.findFirst({
      where: { id: event.locals.user!.id },
    });

    if (!user) {
      form.errors._errors = ['Utilisateur introuvable.'];
      return fail(400, { form });
    }

    const validPassword = await verify(user!.passwordHash, form.data.oldPassword, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    if (!validPassword) {
      return setError(form, 'oldPassword', 'Mot de passe est incorrect.');
    }

    const passwordHash = await hash(form.data.newPassword, {
      // recommended minimum parameters
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    await db.user.update({
      where: { id: user?.id },
      data: { passwordHash },
    });

    return { form };
  },
};
