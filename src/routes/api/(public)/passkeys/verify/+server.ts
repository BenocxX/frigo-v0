import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PasskeyService } from '$lib/server/services/passkey-service';
import { db } from '$lib/server/prisma';
import { AuthService } from '$lib/server/services/auth-service';

export const POST: RequestHandler = async (event) => {
  const body = await event.request.json();

  const user = await db.user.findFirst({ where: { username: body.username } });

  if (!user) {
    throw Error('User not found');
  }

  const passkeyService = new PasskeyService();

  const currentOptions = await passkeyService.getCurrentAuthenticationOptions(user);
  if (!currentOptions) {
    throw Error('No current options');
  }

  const passkey = await db.passkey.findFirst({ where: { id: body.id } });
  if (!passkey) {
    throw Error('Passkey not found');
  }

  try {
    const verification = await passkeyService.verifyAuthenticationResponse(
      body,
      currentOptions,
      passkey
    );

    const authService = new AuthService();
    await authService.createSession(event, user);

    if (!verification.verified) {
      throw new Error('Authentication failed');
    }

    return json({
      verified: verification.verified,
    });
  } catch (error) {
    console.log(error);
    throw new Error('Authentication failed');
  }
};
