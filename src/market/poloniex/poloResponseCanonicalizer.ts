import "reflect-metadata";
import { injectable } from "../../inversify";

@injectable()
export default class PoloResponseCanonicalizer
  implements market.IResponseCanonicalizer {
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

  canoOrderbookResponse = (
    pair: string,
    orderbookResponse: market.polo.ReturnOrderBookResponse
  ) => {
    return {
      pair: { from: pair.split("_")[0], to: pair.split("_")[1] },
      asks: orderbookResponse[pair].asks.reduce(this._orderBookReducer, []),
      bids: orderbookResponse[pair].bids.reduce(this._orderBookReducer, [])
    };
  };
}
