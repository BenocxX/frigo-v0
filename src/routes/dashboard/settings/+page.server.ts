import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { resetPasswordSchema } from './schema.js';
import { AuthService } from '$lib/server/services/auth-service.js';

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
