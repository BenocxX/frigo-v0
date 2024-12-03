import { passkeyLoginSchema } from '$lib/components/custom/forms/passkeys/schema';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ url }) => {
  const form = await superValidate(zod(passkeyLoginSchema), {
    defaults: {
      username: url.searchParams.get('username') ?? '',
    },
  });

  return { form };
};
