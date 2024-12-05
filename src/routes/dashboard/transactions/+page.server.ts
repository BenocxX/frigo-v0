import { db } from '$lib/server/prisma';

export const load = async ({ locals }) => {
  const transactions = await db.transaction.findMany({
    where: { userId: locals.user!.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      createdAt: true,
      total: true,
      transactionProducts: {
        select: {
          quantity: true,
          product: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return {
    transactions,
  };
};
