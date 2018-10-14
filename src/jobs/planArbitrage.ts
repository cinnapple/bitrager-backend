import "reflect-metadata";
import { injectable, inject, TYPES } from "../inversify";
import * as _ from "lodash";

import { CacheKeys, Direction } from "../core/enum";
import CurrencyPairNotFoundInOrderBookError from "../errors/CurrencyPairNotFoundInOrderBookError";

interface State {
  curr: string;
  funds: number;
}

@injectable()
export default class PlanArbitrage implements core.IJob {
  constructor(
    @inject(TYPES.Core.Config) private _config: core.IConfig,
    @inject(TYPES.Core.Cache) private _cache: core.ICache,
    @inject(TYPES.Market.ExpertAdvisor) private _ea: market.IExpertAdvisor,
    @inject(TYPES.Core.Reporter) private _reporter: core.IReporter
  ) {}

  private _yieldRange = (start: number, last: number, step: number) => {
    const range = [];
    for (let i = start; i < last + 1; i += step) {
      range.push(i);
    }
    return range;
  };

  private _getNextState = (
    orderbook: model.IOrderBook,
    currentState: State
  ) => {
    currentState = { ...currentState }; // create a copy
    const dir =
      currentState.curr === orderbook.pair.from
        ? Direction.BUY
        : Direction.SELL;
    const toCurrency =
      dir === Direction.BUY ? orderbook.pair.to : orderbook.pair.from;

    return orderbook[dir === Direction.BUY ? "asks" : "bids"].reduce(
      (nextState, curr) => {
        // determine the disposition and acquisition amount
        let disposition = dir === Direction.BUY ? curr.vol * curr.px : curr.vol;
        let acquisition = dir === Direction.BUY ? curr.vol : curr.vol * curr.px;

        // if partial fill order, recalculate the amount
        if (currentState.funds <= disposition) {
          disposition = currentState.funds;
          acquisition =
            dir === Direction.BUY
              ? currentState.funds / curr.px
              : currentState.funds * curr.px;
        }
        currentState.funds -= disposition;
        nextState.funds += this._ea.applyTakerFees(acquisition);
        return nextState;
      },
      { curr: toCurrency, funds: 0 }
    );
  };

  get name() {
    return "PlanArbitrage";
  }

  execute = async () => {
    const orderbooks = await this._cache.get<model.IOrderBook[]>(
      CacheKeys.ORDERBOOKS
    );
    const routes = await this._cache.get<model.CurrencyRoutes>(
      CacheKeys.ROUTES
    );
    const account = await this._cache.get<model.AccountInfo>(
      CacheKeys.ACCOUNT_INFO
    );
    const max = _.min([this._config.maxUSD, account.USDT]);

    // plan arbitrage for each possbile path
    const executionPlan: core.IExecutionPlan = {
      status: "new",
      plans: []
    };
    this._yieldRange(100, max, 100).forEach(qty => {
      routes.forEach(route => {
        const states = [
          {
            curr: this._ea.info.startCurrency,
            funds: qty
          }
        ];

        let currentState = states[0];
        route.forEach((toId, i) => {
          if (i === 0) {
            return;
          }
          const fromId = route[i - 1];

          // get an orderbook
          const orderbook = orderbooks.find(
            a =>
              (a.pair.from === fromId && a.pair.to === toId) ||
              (a.pair.from === toId && a.pair.to === fromId)
          );
          if (!orderbook) {
            throw new CurrencyPairNotFoundInOrderBookError({
              from: fromId,
              to: toId
            });
          }
          currentState = this._getNextState(orderbook, currentState);
          states.push(currentState);
        });

        // check whether this arbitrage is profitable
        if (states[states.length - 1].funds > states[0].funds) {
          executionPlan.plans.push({
            qty: qty,
            states: states,
            route: route,
            profit: states[states.length - 1].funds - states[0].funds
          });
        }
      });
    });

    if (executionPlan.plans.length > 0) {
      this._reporter.notify(
        JSON.stringify(_.maxBy(executionPlan.plans, a => a.profit))
      );
    }

    await this._cache.set<core.IExecutionPlan>(CacheKeys.PLAN, executionPlan);
    return {
      continue: executionPlan.plans.length > 0,
      result: executionPlan,
      error: null
    };
  };
}
