declare namespace model {
  export interface ICurrency extends core.IData {
    name: string;
  }

  export type CurrencyRoutes = string[][];

  export interface Account {
    qty: number;
  }

  export type AccountInfo = core.HashMap<Account>;

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
