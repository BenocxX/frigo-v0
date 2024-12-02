import { fail, redirect } from '@sveltejs/kit';

import { setError, superValidate } from 'sveltekit-superforms';
import { loginSchema } from './schema';
import { zod } from 'sveltekit-superforms/adapters';
import { AuthService } from '$lib/server/services/auth-service';

export const load = async ({ url }) => {
  const form = await superValidate(zod(loginSchema), {
    defaults: {
      username: url.searchParams.get('username'),
      password: '',
    },
  });

  return { form };
};

export const actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(loginSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const authService = new AuthService();

    const user = await authService.login(form.data);
    if (!user) {
      return setError(form, 'username', "Nom d'utilisateur ou mot de passe incorrect");
    }

    await authService.createSession(event, user);

    return redirect(302, '/dashboard');
  },
};
