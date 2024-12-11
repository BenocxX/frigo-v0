import { db } from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { CoinGeckoService } from '$lib/server/services/coingecko-service.js';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { paySchema } from '$lib/components/custom/forms/pay/schema.js';

export const load = async ({ parent }) => {
  const data = await parent();
  if (data.totalDebt === 0) {
    redirect(302, '/dashboard');
  }

  const coinGeckoService = new CoinGeckoService();
  const { btcPrice, ethPrice } = await coinGeckoService.btcAndEthPrices();

  return {
    payForm: await superValidate(zod(paySchema)),
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
  default: async (event) => {
    const form = await superValidate(event, zod(paySchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const transactions = await db.transaction.findMany({
      where: {
        userId: event.locals.user!.id,
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
        userId: event.locals.user!.id,
        total: transactions.reduce((acc, t) => acc + t.total, 0),
        paymentMethod: form.data.paymentMethod,
        transactions: { connect: transactions },
      },
    });
  },
};
