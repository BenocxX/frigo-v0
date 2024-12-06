import { db } from '$lib/server/prisma';

export const load = async () => {
  const users = await db.user.findMany({
    where: {
      Transaction: {
        some: {
          payed: false,
        },
      },
    },
    select: {
      username: true,
      Transaction: {
        where: { payed: false },
        select: { total: true },
      },
    },
  });

  const usersWithTotal = users.map((user) => ({
    username: user.username,
    total: user.Transaction.reduce((acc, current) => acc + current.total, 0),
  }));

  return {
    users: usersWithTotal.sort((a, b) => b.total - a.total),
  };
};
