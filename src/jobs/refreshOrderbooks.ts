import "reflect-metadata";
import { injectable, inject, TYPES } from "../inversify";

import { CacheKeys } from "../core/enum";

@injectable()
export default class RefreshOrderbooks implements core.IJob {
  constructor(
    @inject(TYPES.Core.Cache) private _cache: core.ICache,
    @inject(TYPES.Market.ExpertAdvisor) private _ea: market.IExpertAdvisor
  ) {}

  get name() {
    return "RefreshOrderbooks";
  }

  execute = async () => {
    const availablePairs = await this._cache.get<model.ICurrencyPair[]>(
      CacheKeys.AVAILABLE_PAIRS
    );
    if (!availablePairs) {
      return {
        continue: false,
        result: undefined,
        error: null
      };
    }

    const orderbooks = await this._ea.getOrderBooks(availablePairs);

    this._cache.set(CacheKeys.ORDERBOOKS, orderbooks);

    return {
      continue: true,
      result: orderbooks,
      error: null
    };
  };
}
