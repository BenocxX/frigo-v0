import { db } from '$lib/server/prisma.js';

export const load = async (event) => {
  const unpaidTransactions = await db.transaction.findMany({
    where: {
      userId: event.locals.user!.id,
      payed: false,
    },
  });

  const totalDebt = unpaidTransactions.reduce((acc, transaction) => {
    return acc + transaction.total;
  }, 0);

  return {
    user: event.locals.user!,
    totalDebt,
  };
};
