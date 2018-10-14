import "reflect-metadata";
import { injectable, inject, TYPES } from "../inversify";

import { CacheKeys } from "../core/enum";
import GraphOp from "../core/graphOp";

interface ICurrencyNode extends core.INode<model.ICurrency> {}

@injectable()
export default class FetchCurrencyPairs implements core.IJob {
  constructor(
    @inject(TYPES.Core.Cache) private _cache: core.ICache,
    @inject(TYPES.Market.ExpertAdvisor) private _ea: market.IExpertAdvisor
  ) {}

  get name() {
    return "FetchCurrencyPairs";
  }

  execute = async (_previous: core.IJobResult) => {
    const data = await this._ea.getCurrencyPairs();

    // store currency pairs
    await this._cache.set(CacheKeys.ALL_PAIRS, data);

    // store currency in a graph.
    const graphOp = new GraphOp<model.ICurrency>();
    data.forEach(pair => {
      const fromCurr: model.ICurrency = { id: pair.from, name: pair.from };
      const toCurr: model.ICurrency = { id: pair.to, name: pair.to };
      const fromNode: ICurrencyNode = { id: pair.from, data: fromCurr };
      const toNode: ICurrencyNode = { id: pair.to, data: toCurr };
      const edge: core.IEdge = { from: fromNode.id, to: toNode.id };
      graphOp.addNode(fromNode);
      graphOp.addNode(toNode);
      graphOp.addEdge(edge);
    });

    await this._cache.set(CacheKeys.ALL_PAIR_GRAPH, graphOp.graph);

    return {
      continue: true,
      result: true,
      error: undefined
    };
  };
}
