import { json } from '@sveltejs/kit';
import type { RequestHandler } from '../../$types';
import { PasskeyService } from '$lib/server/services/passkey-service';

export const POST: RequestHandler = async ({ locals, request }) => {
  const body = await request.json();
  const { passkeyName, attResp } = body;

  if (!passkeyName || !attResp) {
    throw Error('Missing passkeyName or attResp');
  }

  const user = locals.user!;

  const passkeyService = new PasskeyService();

  const currentOptions = await passkeyService.getCurrentAuthenticationOptions(user);
  if (!currentOptions) {
    throw Error('No current options found');
  }

  try {
    const verification = await passkeyService.verifyRegistrationResponse(
      attResp,
      currentOptions,
      user,
      passkeyName
    );

    return json({
      verified: verification?.verified,
    });
  } catch {
    throw Error('Failed to verify registration response');
  }
};
