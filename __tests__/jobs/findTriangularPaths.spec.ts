import "jest";
import FindTriangularPaths from "../../src/jobs/findTriangularPaths";
import MockCurrencyPairs from "../../data/mock.canonicalized.currencyPairs";
import MockCurrencyGraph from "../../data/mock.canonicalized.currencygraph";
import MockOrderBooks from "../../data/mock.canonicalized.orderbooks";
import { CacheKeys } from "../../src/core/enum";

describe("FindTriangularPaths", () => {
  const _config = {} as core.IConfig;
  const _cache = {} as core.ICache;
  const _ea = {} as market.IExpertAdvisor;

  beforeEach(() => {
    _config.maxDepth = 4;
    _ea.getOrderBooks = jest.fn().mockResolvedValue(MockOrderBooks);
    _ea.info = { id: "poloniex", takerFees: 0.2 / 100, startCurrency: "BTC" };
    _cache.get = jest
      .fn()
      .mockResolvedValueOnce(MockCurrencyGraph)
      .mockResolvedValueOnce(MockCurrencyPairs);
    _cache.set = jest.fn();
  });

  test("name", () => {
    const sut = new FindTriangularPaths(_config, _cache, _ea);
    expect(sut.name).toEqual("FindTriangularPaths");
  });

  test("execute", async () => {
    const sut = new FindTriangularPaths(_config, _cache, _ea);
    const result = await sut.execute(undefined);

    expect(_cache.get).toHaveBeenCalledWith(CacheKeys.ALL_PAIR_GRAPH);

    expect(_cache.set).toHaveBeenCalledWith(CacheKeys.ROUTES, [
      ["BTC", "USDT", "ETH", "BTC"],
      ["BTC", "USDT", "XRP", "BTC"],
      ["BTC", "USDT", "BCN", "BTC"],
      ["BTC", "USDT", "DASH", "BTC"],
      ["BTC", "USDT", "DOGE", "BTC"],
      ["BTC", "DASH", "USDT", "BTC"],
      ["BTC", "ETH", "USDT", "BTC"],
      ["BTC", "XRP", "USDT", "BTC"],
      ["BTC", "BCN", "USDT", "BTC"],
      ["BTC", "DOGE", "USDT", "BTC"]
    ]);

    // assert success result
    expect(result).toEqual({
      continue: true,
      error: null,
      result: [
        { from: "USDT", to: "BTC" },
        { from: "BTC", to: "BCN" },
        { from: "USDT", to: "DASH" },
        { from: "BTC", to: "DASH" },
        { from: "BTC", to: "DOGE" }
      ]
    });
  });
});
