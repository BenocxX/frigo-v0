import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PasskeyService } from '$lib/server/services/passkey-service';
import { db } from '$lib/server/prisma';
import { AuthService } from '$lib/server/services/auth-service';
import type { PasskeyAuthVerifyBody } from '$lib/client/service/PasskeyClientService';

export const POST: RequestHandler = async (event) => {
  const body = (await event.request.json()) as PasskeyAuthVerifyBody;
  const { authentificationResponse, loginData } = body;

  if (!authentificationResponse || !loginData) {
    throw new Error('Invalid request');
  }

  const user = await db.user.findFirst({ where: { username: loginData.username } });

  if (!user) {
    throw Error('User not found');
  }

  const passkeyService = new PasskeyService();

  const currentOptions = await passkeyService.getCurrentAuthenticationOptions(user);
  if (!currentOptions) {
    throw Error('No current options');
  }

  const passkey = await db.passkey.findFirst({ where: { id: authentificationResponse.id } });
  if (!passkey) {
    throw Error('Passkey not found');
  }

  try {
    const verification = await passkeyService.verifyAuthenticationResponse(
      authentificationResponse,
      currentOptions,
      passkey
    );

    if (!verification.verified) {
      throw new Error('Authentication failed');
    }

    const authService = new AuthService();
    await authService.createSession(event, user);

    return json({
      verified: verification.verified,
    });
  } catch (error) {
    console.log(error);
    throw new Error('Authentication failed');
  }
};
