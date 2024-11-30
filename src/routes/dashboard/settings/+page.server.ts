import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { AuthService } from '$lib/server/services/auth-service.js';
import { db } from '$lib/server/prisma.js';
import { z } from 'zod';
import { renamePasskeySchema, resetPasswordSchema } from '$lib/schemas/passkey';

export const load = async ({ locals }) => {
  const passkeys = await db.passkey.findMany({
    where: {
      userId: locals.user!.id,
    },
  });

  return {
    resetPasswordForm: await superValidate(zod(resetPasswordSchema)),
    renamePasskeyForm: await superValidate(zod(renamePasskeySchema)),
    passkeys,
  };
};

export const actions = {
  renamePasskey: async (event) => {
    const form = await superValidate(event, zod(renamePasskeySchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    await db.passkey.update({
      where: { id: form.data.passkeyId },
      data: { name: form.data.name },
    });
  },
  deletePasskey: async (event) => {
    const formData = await event.request.formData();
    const result = z.string().safeParse(formData.get('passkeyId'));

    if (!result.success) {
      return fail(400, { passkeyId: 'Invalid passkeyId' });
    }

    await db.passkey.delete({ where: { id: result.data } });
  },
  resetPassword: async (event) => {
    const form = await superValidate(event, zod(resetPasswordSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const authService = new AuthService();

    const user = await authService.login({
      username: event.locals.user!.username,
      password: form.data.oldPassword,
    });

    if (!user) {
      return setError(form, 'oldPassword', 'Mot de passe est incorrect.');
    }

    await authService.changePassword(user, form.data.newPassword);

    return { form };
  },
};
