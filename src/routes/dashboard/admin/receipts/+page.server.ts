import { db } from '$lib/server/prisma';

export const load = async () => {
  const receipts = await db.receipt.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user: {
        select: {
          firstname: true,
          lastname: true,
        },
      },
    },
  });

  return { receipts };
};
