declare namespace market {
  export interface IExpertAdvisor {
    info: core.IExchangeConfig;
    getCurrencyPairs: () => Promise<model.ICurrencyPair[]>;
    getOrderBooks: (
      availablePairs: model.ICurrencyPair[]
    ) => Promise<model.IOrderBook[]>;
    applyTakerFees: (vol: number) => number;
    getAccountInfo: () => Promise<model.AccountInfo>;
  }

  export namespace Contract {
    export interface IOrderbookResponse {}
  }

  export namespace polo {
    export interface ReturnTickerResponse
      extends core.HashMap<{
          id: number;
          last: string;
          lowestAsk: string;
          highestBid: string;
          percentChange: string;
          baseVolume: string;
          quoteVolume: string;
          isFrozen: string;
          high24hr: string;
          low24hr: string;
        }> {}

    export interface ReturnOrderBookResponse
      extends Contract.IOrderbookResponse,
        core.HashMap<{
          asks: any[][];
          bids: any[][];
          isFrozen: "0" | "1";
          seq: number;
        }> {}
    /**
     * {
     *  "BTC": "0.59098578",
     *  "LTC": "3.31117268",
     * }
     */
    export interface ReturnBalances extends core.HashMap<string> {}
  }
}
