import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { passkeyLoginSchema } from './schema.js';

export const load = async () => {
  return {
    form: await superValidate(zod(passkeyLoginSchema)),
  };
};
