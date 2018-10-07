export default class CurrencyPairNotFoundInOrderBookError extends Error {
  constructor(pair: model.ICurrencyPair) {
    super(
      `The pair ${pair.from} -> ${pair.to} does not exist in the orderbook.`
    );
    console.log(pair);
  }
}
