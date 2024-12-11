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
import { PasskeyService } from '$lib/server/services/passkey-service';
import { updateNamesSchema } from '$lib/components/custom/forms/user/schema.js';

export const load = async (event) => {
  const { locals } = event;
  const passkeys = await db.passkey.findMany({ where: { userId: locals.user!.id } });
  const sessions = await db.session.findMany({
    where: { userId: locals.user!.id },
    select: {
      createdAt: true,
      expiresAt: true,
      lastUsed: true,
      publicId: true,
      name: true,
    },
  });

  const sortedPasskeys = passkeys.sort(
    (a, b) => (b.lastUsed || b.createdAt).getTime() - (a.lastUsed || a.createdAt).getTime()
  );

  const sortedSessions = sessions.sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime());

  const passkeyService = new PasskeyService();
  const passkeyRegistrationOptions = await passkeyService.generateRegistrationOptions(locals.user!);

  return {
    updateNamesForm: await superValidate(zod(updateNamesSchema)),
    deletePasskeyForm: await superValidate(zod(deletePasskeySchema)),
    renamePasskeyForm: await superValidate(zod(renamePasskeySchema)),
    resetPasswordForm: await superValidate(zod(resetPasswordSchema)),
    deleteSessionForm: await superValidate(zod(deleteSessionSchema)),
    passkeyRegistrationOptions,
    passkeys: sortedPasskeys,
    sessions: sortedSessions,
    currentSessionPublicId: locals.session!.publicId,
  };
};

export const actions = {
  updateNames: async (event) => {
    const form = await superValidate(event, zod(updateNamesSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    await db.user.update({
      where: { id: event.locals.user!.id },
      data: {
        username: form.data.username,
        firstname: form.data.firstname,
        lastname: form.data.lastname,
      },
    });

    return { form };
  },
  renamePasskey: async (event) => {
    const form = await superValidate(event, zod(renamePasskeySchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    await db.passkey.update({
      where: { id: form.data.passkeyId },
      data: { name: form.data.name },
    });

    return { form };
  },
  deletePasskey: async (event) => {
    const form = await superValidate(event, zod(deletePasskeySchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    await db.passkey.delete({ where: { id: form.data.passkeyId } });

    return { form };
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
        publicId: form.data.publicId,
        userId: event.locals.user!.id,
      },
    });

    return { form };
  },
};
