import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { AuthService } from '$lib/server/services/auth-service';
import { registerSchema } from '$lib/components/custom/forms/auth/schema';

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

    const authService = new AuthService();

    if (await authService.isUsernameAlreadyUsed(form.data.username)) {
      return setError(form, 'username', "Nom d'utilisateur déjà utilisé");
    }

    const user = await authService.signup(form.data);
    await authService.createSession(event, user);

    return redirect(302, '/dashboard');
  },
};
