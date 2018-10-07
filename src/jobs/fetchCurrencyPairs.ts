import "reflect-metadata";
import { injectable, inject, TYPES } from "../inversify";

import Graph from "../core/graph";
import { CacheKeys } from "../core/enum";

interface ICurrencyNode extends core.INode<model.ICurrency> {}

@injectable()
export default class FetchCurrencyPairs implements core.IJob {
  constructor(
    @inject(TYPES.Core.WebClient) private _webClient: core.IWebClient,
    @inject(TYPES.Core.Cache) private _cache: core.ICache
  ) {}

  private _fetch = () =>
    this._webClient.get<market.polo.ReturnTickerResponse>(
      "https://poloniex.com/public?command=returnTicker"
    );

  get name() {
    return "FetchCurrencyPairs";
  }

  execute = async (_previous: core.IJobResult) => {
    const data = await this._fetch();

    // store currency pairs
    await this._cache.set(CacheKeys.MKT_CURR, data);

    // store currency in a graph.
    const graph = new Graph<model.ICurrency>();
    for (const key in data) {
      const from = key.split("_")[0];
      const to = key.split("_")[1];
      const fromCurr: model.ICurrency = { id: from, name: from };
      const toCurr: model.ICurrency = { id: to, name: to };
      const fromNode: ICurrencyNode = { id: from, data: fromCurr };
      const toNode: ICurrencyNode = { id: to, data: toCurr };
      const edge: core.IEdge = { from: fromNode.id, to: toNode.id };
      graph.addNode(fromNode);
      graph.addNode(toNode);
      graph.addEdge(edge);
    }
    await this._cache.set(CacheKeys.MKT_CURRGRAPH, graph, Graph.serialize);

    // success result
    return {
      continue: true,
      result: true,
      error: undefined
    };
  };
}
