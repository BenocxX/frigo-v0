import { passkeyLoginSchema } from '$lib/components/custom/forms/passkeys/schema';
import { db } from '$lib/server/prisma';
import { PasskeyService } from '$lib/server/services/passkey-service.js';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ url }) => {
  const form = await superValidate(zod(passkeyLoginSchema), {
    defaults: {
      username: url.searchParams.get('username') ?? '',
    },
  });

  return { form };
};

export const actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(passkeyLoginSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const user = await db.user.findFirst({ where: { username: form.data.username } });

    if (!user) {
      return setError(form, 'username', "Nom d'utilisateur inconnu");
    }

    const passkeyService = new PasskeyService();
    const optionsJSON = await passkeyService.generateAuthenticationOptions(user);

    return {
      form,
      optionsJSON,
    };
  },
};
