import "reflect-metadata";
import { injectable, inject, TYPES } from "../inversify";

import { CacheKeys } from "../core/enum";

@injectable()
export default class RefreshOrderbooks implements core.IJob {
  constructor(
    @inject(TYPES.Core.WebClient) private _webClient: core.IWebClient,
    @inject(TYPES.Core.Cache) private _cache: core.ICache,
    @inject(TYPES.Market.PoloResponseCanonicalizer)
    private _responseCanonicalizer: market.IResponseCanonicalizer
  ) {}

  private _fetch = () =>
    this._webClient.get<market.polo.ReturnOrderBookResponse>(
      "https://poloniex.com/public?command=returnOrderBook&currencyPair=ALL&depth=10"
    );

  get name() {
    return "RefreshOrderbooks";
  }

  execute = async () => {
    const availablePairs = await this._cache.get<core.HashMap<boolean>>(
      CacheKeys.STR_AVAILCURR
    );
    if (!availablePairs) {
      return {
        continue: false,
        result: undefined,
        error: null
      };
    }
    const rawOrderbooks = await this._fetch();

    // canonicalize the orderbook.
    const orderbooks: model.IOrderBook[] = [];
    for (const pair in availablePairs) {
      const canonicalizedOrderbook = this._responseCanonicalizer.canoOrderbookResponse(
        pair,
        rawOrderbooks
      );
      if (canonicalizedOrderbook) {
        orderbooks.push(canonicalizedOrderbook);
      }
    }
    this._cache.set(CacheKeys.MKT_ORDERBOOKS, orderbooks);

    return {
      continue: true,
      result: orderbooks,
      error: null
    };
  };
}
