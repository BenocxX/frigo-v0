import { db } from '$lib/server/prisma.js';

export const POST = async ({ locals }) => {
  await db.transaction.updateMany({
    where: {
      userId: locals.user!.id,
      payed: false,
    },
    data: {
      payed: true,
    },
  });

  return new Response();
};
