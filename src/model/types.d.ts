declare namespace model {
  export interface ICurrency extends core.IData {
    name: string;
  }

  export interface ICurrencyGraph extends core.IGraph<model.ICurrency> {}

  export type CurrencyRoutes = string[][];

  export type AccountInfo = core.HashMap<number>;

  export interface ICurrencyPair {
    from: string;
    to: string;
  }

  export interface ITicker {
    px: number;
    vol: number;
    prod: number;
    cumVol: number;
  }

  export interface IOrderBook {
    pair: ICurrencyPair;
    asks: ITicker[];
    bids: ITicker[];
  }
}
