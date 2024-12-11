import { env } from '$env/dynamic/private';
import { makeSearchParams } from '$lib/utils/search-params';

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

  async btcAndEthPrices() {
    return (await this.simplePrice('bitcoin,ethereum')) as Promise<{
      bitcoin: {
        cad: number;
      };
      ethereum: {
        cad: number;
      };
    }>;
  }

  async simplePrice(ids: string, vsCurrencies: string = 'cad') {
    return await this.fetch('simple/price', {
      ids,
      vs_currencies: vsCurrencies,
    });
  }
}
