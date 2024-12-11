import { env } from '$env/dynamic/private';
import { makeSearchParams } from '$lib/utils/search-params';
import { TimeConstants } from '$lib/utils/time-constants';
import { db } from '../prisma';

export class CoinGeckoService {
  private readonly coinGeckoEndpoint = 'https://api.coingecko.com/api/v3/';
  private readonly baseSearchParams = {
    'x-cg-demo-api-key': env.COINGECKO_API_KEY,
  };

  async fetch(route: string, params?: Record<string, string>) {
    const { searchParams } = makeSearchParams({
      ...this.baseSearchParams,
      ...params,
    });

    const response = await fetch(`${this.coinGeckoEndpoint}${route}${searchParams}`);
    return await response.json();
  }

  /**
   * Fetches the current prices of Bitcoin and Ethereum in CAD.
   *
   * If the prices are cached and not expired, the cached prices are returned.
   */
  async btcAndEthPrices() {
    const cachedCryptoPrices = await db.cryptoPriceCache.findFirst();
    const shouldUseCachedPrices = cachedCryptoPrices && cachedCryptoPrices.expiresAt > new Date();
    if (shouldUseCachedPrices) {
      return {
        btcPrice: cachedCryptoPrices.btcPrice,
        ethPrice: cachedCryptoPrices.ethPrice,
      };
    }

    const result = await this.simplePrice('bitcoin,ethereum');
    const newPrices = result as {
      bitcoin: { cad: number };
      ethereum: { cad: number };
    };

    if (cachedCryptoPrices) {
      await db.cryptoPriceCache.update({
        where: { id: cachedCryptoPrices.id },
        data: {
          btcPrice: newPrices.bitcoin.cad,
          ethPrice: newPrices.ethereum.cad,
          expiresAt: new Date(Date.now() + TimeConstants.MINUTE_IN_MS),
        },
      });
    } else {
      await db.cryptoPriceCache.create({
        data: {
          btcPrice: newPrices.bitcoin.cad,
          ethPrice: newPrices.ethereum.cad,
          expiresAt: new Date(Date.now() + TimeConstants.MINUTE_IN_MS),
        },
      });
    }

    return {
      btcPrice: newPrices.bitcoin.cad,
      ethPrice: newPrices.ethereum.cad,
    };
  }

  async simplePrice(ids: string, vsCurrencies: string = 'cad') {
    return await this.fetch('simple/price', {
      ids,
      vs_currencies: vsCurrencies,
    });
  }
}
