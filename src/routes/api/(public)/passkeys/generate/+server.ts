import type { RequestHandler } from './$types';
import { PasskeyService } from '$lib/server/services/passkey-service';
import { db } from '$lib/server/prisma';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();

  const user = await db.user.findFirst({ where: { username: body.username } });

  if (!user) {
    throw Error('User not found');
  }

  const passkeyService = new PasskeyService();
  const options = await passkeyService.generateAuthenticationOptions(user);

  return json(options);
};
