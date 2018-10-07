import "jest";
import PoloResponseCanonicalizer from "../../src/market/poloniex/poloResponseCanonicalizer";
import MockOrderbooksLoss from "../../src/data/mock.polo.orderbooks.loss";
import MockOrderbooksProfit from "../../src/data/mock.polo.orderbooks.profit";
import MockCacheCurrencyRoutes from "../../src/data/mock.cache.currencyRoutes";
import AccountInfo from "../../src/data/mock.cache.accountInfo";
import PlanArbitrage from "../../src/jobs/planArbitrage";

const canonicalizer = new PoloResponseCanonicalizer();

const mockOrderbooksLoss = Object.keys(MockOrderbooksLoss).map(pair =>
  canonicalizer.canoOrderbookResponse(pair, MockOrderbooksLoss)
);
const mockOrderbooksProfit = Object.keys(MockOrderbooksProfit).map(pair =>
  canonicalizer.canoOrderbookResponse(pair, MockOrderbooksProfit)
);

const _config = <strategy.IConfig>{
  triangularPaths: {
    startCurrency: "USDT"
  }
};

describe("PlanArbitrage", () => {
  test("execute - loss", () => {
    const _cache = <core.ICache>{
      get: jest
        .fn()
        .mockReturnValueOnce(mockOrderbooksLoss)
        .mockReturnValueOnce(MockCacheCurrencyRoutes)
        .mockReturnValueOnce(AccountInfo),
      set: jest.fn()
    };
    const sut = new PlanArbitrage(_config, _cache);
    sut.execute();
  });
  test("execute - profit", () => {
    const _cache = <core.ICache>{
      get: jest
        .fn()
        .mockReturnValueOnce(mockOrderbooksProfit)
        .mockReturnValueOnce(MockCacheCurrencyRoutes)
        .mockReturnValueOnce(AccountInfo),
      set: jest.fn()
    };
    const sut = new PlanArbitrage(_config, _cache);
    sut.execute();
  });
});
