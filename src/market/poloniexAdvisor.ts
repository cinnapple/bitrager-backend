import "reflect-metadata";
import { injectable, inject, TYPES } from "../inversify";
import { Exchange } from "../core/enum";

@injectable()
export default class PoloniexAdvisor implements market.IExpertAdvisor {
  private _exchangeConfig: core.IExchangeConfig;

  constructor(
    @inject(TYPES.Core.Config) protected _config: core.IConfig,
    @inject(TYPES.Core.WebClient) private _webClient: core.IWebClient
  ) {
    this._exchangeConfig = _config.exchanges.find(
      a => a.id === Exchange.poloniex
    );
  }

  private _orderBookReducer = (prev: model.ITicker[], curr: any[]) => {
    const px = parseFloat(curr[0]);
    const vol = parseFloat(curr[1]);
    const prod = parseFloat(curr[0]) * parseFloat(curr[1]);
    const cumVol = prev.length > 0 ? prev[prev.length - 1].cumVol + vol : vol;
    prev.push({
      px,
      vol,
      prod,
      cumVol
    });
    return prev;
  };

  private _fetchCurrencyPairs = () =>
    this._webClient.get<market.polo.ReturnTickerResponse>(
      "https://poloniex.com/public?command=returnTicker"
    );

  private _fetchOrderbooks = () =>
    this._webClient.get<market.polo.ReturnOrderBookResponse>(
      "https://poloniex.com/public?command=returnOrderBook&currencyPair=ALL&depth=10"
    );

  private _fetchAccountInfo = () => Promise.resolve({ USDT: 1000 });
  // this._webClient.get<market.polo.ReturnBalances>(
  //   "https://poloniex.com/public?command=returnBalances"
  // );

  private canoOrderbookResponse = (
    pair: model.ICurrencyPair,
    orderbookResponse: market.polo.ReturnOrderBookResponse
  ) => {
    const order = orderbookResponse[`${pair.from}_${pair.to}`];
    return {
      pair: { from: pair.from, to: pair.to },
      asks: order.asks.reduce(this._orderBookReducer, []),
      bids: order.bids.reduce(this._orderBookReducer, [])
    };
  };

  get info() {
    return this._exchangeConfig;
  }

  getCurrencyPairs = async () => {
    const data = await this._fetchCurrencyPairs();
    return Object.keys(data).map(curr => {
      const from = curr.split("_")[0];
      const to = curr.split("_")[1];
      return { from: from, to: to };
    });
  };

  getOrderBooks = async (availablePairs: model.ICurrencyPair[]) => {
    const data = await this._fetchOrderbooks();
    return availablePairs.map(pair => this.canoOrderbookResponse(pair, data));
  };

  getAccountInfo = async () => {
    const data = await this._fetchAccountInfo();
    return Object.keys(data).reduce((cum, curr) => {
      cum[curr] = parseFloat(data[curr]);
      return cum;
    }, {});
  };

  applyTakerFees = (vol: number) => {
    return vol * (1 - this._exchangeConfig.takerFees);
  };
}
