import { json } from '@sveltejs/kit';
import { PasskeyService } from '$lib/server/services/passkey-service';

export const POST = async ({ locals }) => {
  const passkeyService = new PasskeyService();
  const options = await passkeyService.generateRegistrationOptions(locals.user!);

  return json(options);
};
