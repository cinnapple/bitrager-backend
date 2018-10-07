declare namespace market {
  export namespace Contract {
    export interface IOrderbookResponse {}
  }

  export interface IResponseCanonicalizer {
    canoOrderbookResponse: (
      pair: string,
      orderbookResponse: any
    ) => model.IOrderBook;
  }

  export namespace polo {
    export interface ReturnTickerResponse
      extends core.HashMap<{ id: string }> {}
    export interface ReturnOrderBookResponse
      extends Contract.IOrderbookResponse,
        core.HashMap<{
          asks: any[][];
          bids: any[][];
          isFrozen: "0" | "1";
          seq: number;
        }> {}
  }
}
