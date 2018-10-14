import "reflect-metadata";
import { injectable, inject, TYPES } from "../inversify";

import { CacheKeys } from "../core/enum";
import GraphOp from "../core/graphOp";

@injectable()
export default class FindTriangularPaths implements core.IJob {
  constructor(
    @inject(TYPES.Core.Config) private _config: core.IConfig,
    @inject(TYPES.Core.Cache) private _cache: core.ICache,
    @inject(TYPES.Market.ExpertAdvisor) private _ea: market.IExpertAdvisor
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
    const graph = await this._cache.get<model.ICurrencyGraph>(
      CacheKeys.ALL_PAIR_GRAPH
    );
    const routes: string[][] = new GraphOp(graph)
      .findRouteDepth(this._config.maxDepth)
      .reduce((prev, curr) => {
        if (
          curr[0] === this._ea.info.startCurrency &&
          this._validPath(curr, 0, {})
        ) {
          prev.push(curr);
        }
        return prev;
      }, []);

    // available currency paths
    this._cache.set(CacheKeys.ROUTES, routes);

    // available currency pairs
    const allCurrencyPairs = await this._cache.get<model.ICurrencyPair[]>(
      CacheKeys.ALL_PAIRS
    );
    const availablePairs: model.ICurrencyPair[] = [];
    const seen = {};
    routes.forEach(path =>
      path.forEach((curr, index) => {
        if (index > 0) {
          let pair = { from: path[index - 1], to: curr } as model.ICurrencyPair;
          let foundPair = allCurrencyPairs.find(
            a =>
              (pair.from === a.from && pair.to === a.to) ||
              (pair.from === a.to && pair.to === a.from)
          );
          if (foundPair && !seen[`${foundPair.from}_${foundPair.to}`]) {
            seen[`${foundPair.from}_${foundPair.to}`] = true;
            availablePairs.push(foundPair);
          }
        }
      })
    );
    await this._cache.set(CacheKeys.AVAILABLE_PAIRS, availablePairs);

    // success result
    return {
      continue: true,
      result: availablePairs,
      error: null
    };
  };
}
