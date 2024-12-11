import { db } from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { CoinGeckoService } from '$lib/server/services/coingecko-service.js';
import { z } from 'zod';

export const load = async ({ parent }) => {
  const data = await parent();
  if (data.totalDebt === 0) {
    redirect(302, '/dashboard');
  }

  const coinGeckoService = new CoinGeckoService();
  const { btcPrice, ethPrice } = await coinGeckoService.btcAndEthPrices();

  return {
    addresses: {
      interac: env.INTERAC_ADDRESS,
      shakepay: env.SHAKEPAY_ADDRESS,
      btc: env.BTC_ADDRESS,
      eth: env.ETH_ADDRESS,
    },
    btcPrice,
    ethPrice,
  };
};

export const actions = {
  default: async ({ request, locals }) => {
    const formData = await request.formData();
    const result = z
      .enum(['interac', 'shakepay', 'bitcoin', 'ethereum'])
      .safeParse(formData.get('paymentMethod'));

    if (!result.success) {
      return { status: 400, body: { error: 'Missing payment method' } };
    }

    const transactions = await db.transaction.findMany({
      where: {
        userId: locals.user!.id,
        payed: false,
      },
      select: {
        id: true,
        total: true,
      },
    });

    await db.transaction.updateMany({
      where: { id: { in: transactions.map((t) => t.id) } },
      data: { payed: true },
    });

    await db.receipt.create({
      data: {
        userId: locals.user!.id,
        total: transactions.reduce((acc, t) => acc + t.total, 0),
        paymentMethod: result.data,
        transactions: { connect: transactions },
      },
    });
  },
};
