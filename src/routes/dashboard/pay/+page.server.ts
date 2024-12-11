import { db } from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { CoinGeckoService } from '$lib/server/services/coingecko-service.js';

export const load = async ({ parent }) => {
  const data = await parent();
  if (data.totalDebt === 0) {
    redirect(302, '/dashboard');
  }

  const coinGeckoService = new CoinGeckoService();
  const cryptoPrices = await coinGeckoService.btcAndEthPrices();

  return {
    addresses: {
      interac: env.INTERAC_ADDRESS,
      shakepay: env.SHAKEPAY_ADDRESS,
      btc: env.BTC_ADDRESS,
      eth: env.ETH_ADDRESS,
    },
    btcPrice: cryptoPrices.bitcoin.cad,
    ethPrice: cryptoPrices.ethereum.cad,
  };
};

export const actions = {
  default: async ({ locals }) => {
    await db.transaction.updateMany({
      where: {
        userId: locals.user!.id,
        payed: false,
      },
      data: {
        payed: true,
      },
    });
  },
};
