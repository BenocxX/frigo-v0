import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { AuthService } from '$lib/server/services/auth-service.js';
import { db } from '$lib/server/prisma.js';
import {
  deletePasskeySchema,
  renamePasskeySchema,
} from '$lib/components/custom/forms/passkeys/schema';
import { resetPasswordSchema } from '$lib/components/custom/forms/auth/schema';
import { deleteSessionSchema } from '$lib/components/custom/forms/sessions/schema.js';

export const load = async ({ locals }) => {
  const passkeys = await db.passkey.findMany({ where: { userId: locals.user!.id } });
  const sessions = await db.session.findMany({ where: { userId: locals.user!.id } });

  const sortedPasskeys = passkeys.sort(
    (a, b) => (b.lastUsed || b.createdAt).getTime() - (a.lastUsed || a.createdAt).getTime()
  );

  const sortedSessions = sessions.sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime());

  return {
    deletePasskeyForm: await superValidate(zod(deletePasskeySchema)),
    renamePasskeyForm: await superValidate(zod(renamePasskeySchema)),
    resetPasswordForm: await superValidate(zod(resetPasswordSchema)),
    deleteSessionForm: await superValidate(zod(deleteSessionSchema)),
    passkeys: sortedPasskeys,
    sessions: sortedSessions,
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
    const form = await superValidate(event, zod(deletePasskeySchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    await db.passkey.delete({ where: { id: form.data.passkeyId } });
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
  deleteSession: async (event) => {
    const form = await superValidate(event, zod(deleteSessionSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    await db.session.delete({
      where: {
        id: form.data.sessionId,
        userId: event.locals.user!.id,
      },
    });

    return { form };
  },
};
