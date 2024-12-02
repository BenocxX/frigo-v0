import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { passkeyLoginSchema } from './schema.js';

export const load = async ({ url }) => {
  const form = await superValidate(zod(passkeyLoginSchema), {
    defaults: {
      username: url.searchParams.get('username'),
    },
  });

  return { form };
};
