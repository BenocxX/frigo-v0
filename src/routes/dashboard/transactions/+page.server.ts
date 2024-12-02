import { db } from '$lib/server/prisma';

export const load = async ({ locals }) => {
  const transactions = await db.transaction.findMany({ where: { userId: locals.user!.id } });

  return {
    transactions,
  };
};
