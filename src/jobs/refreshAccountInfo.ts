import "reflect-metadata";
import { injectable, inject, TYPES } from "../inversify";

import { CacheKeys } from "../core/enum";

@injectable()
export default class RefreshAccountInfo implements core.IJob {
  constructor(
    @inject(TYPES.Core.Cache) private _cache: core.ICache,
    @inject(TYPES.Market.ExpertAdvisor) private _ea: market.IExpertAdvisor
  ) {}

  get name() {
    return "RefreshAccountInfo";
  }

  execute = async () => {
    const accountInfo = await this._ea.getAccountInfo();

    this._cache.set(CacheKeys.ACCOUNT_INFO, accountInfo);

    return {
      continue: true,
      result: accountInfo,
      error: null
    };
  };
}
