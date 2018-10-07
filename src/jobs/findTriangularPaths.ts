import "reflect-metadata";
import { injectable, inject, TYPES } from "../inversify";

import Graph from "../core/graph";
import { CacheKeys } from "../core/enum";

@injectable()
export default class FindTriangularPaths implements core.IJob {
  constructor(
    @inject(TYPES.Core.Config) private _config: core.IConfig,
    @inject(TYPES.Core.Cache) private _cache: core.ICache
  ) {}

  private _validPath = (
    path: string[],
    position: number,
    seen: core.HashMap<boolean>
  ) => {
    if (seen[path[position]] && position < this._config.maxDepth - 1) {
      return false;
    }
    if (position === this._config.maxDepth - 1) {
      return path[position] === path[0];
    }
    seen[path[position]] = true;
    return this._validPath(path, position + 1, seen);
  };

  get name() {
    return "FindTriangularPaths";
  }

  execute = async (_previousResult: core.IJobResult) => {
    const graph = await this._cache.get<Graph<model.ICurrency>>(
      CacheKeys.MKT_CURRGRAPH,
      Graph.deserialize
    );
    const routes: string[][] = graph
      .findRouteDepth(this._config.maxDepth)
      .reduce((prev, curr) => {
        if (
          curr[0] === this._config.startCurrency &&
          this._validPath(curr, 0, {})
        ) {
          prev.push(curr);
        }
        return prev;
      }, []);

    // available currency paths
    this._cache.set(CacheKeys.STR_ROUTES, routes);

    // available currency pairs
    const allCurrencyParis = await this._cache.get<
      market.polo.ReturnTickerResponse
    >(CacheKeys.MKT_CURR);
    const availablePairs = {};
    routes.forEach(path =>
      path.forEach((curr, index) => {
        if (index > 0) {
          const one = `${path[index - 1]}_${curr}`;
          if (allCurrencyParis[one]) {
            availablePairs[one] = true;
          }
          const two = `${path[index - 1]}_${curr}`;
          if (allCurrencyParis[two]) {
            availablePairs[two] = true;
          }
        }
      })
    );
    await this._cache.set(CacheKeys.STR_AVAILCURR, availablePairs);

    // success result
    return {
      continue: true,
      result: availablePairs,
      error: null
    };
  };
}
