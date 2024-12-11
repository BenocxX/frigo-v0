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
    include: {
      Transaction: {
        where: { payed: false },
        select: { total: true },
      },
    },
  });

  const usersWithTotal = users.map((user) => ({
    username: user.username,
    firstname: user.firstname,
    lastname: user.lastname,
    total: user.Transaction.reduce((acc, current) => acc + current.total, 0),
  }));

  return {
    users: usersWithTotal.sort((a, b) => b.total - a.total),
  };
};
