import "jest";
import FetchCurrencyPairs from "../../src/jobs/fetchCurrencyPairs";
import MockCurrencyPairs from "../../data/mock.canonicalized.currencyPairs";
import { CacheKeys } from "../../src/core/enum";

describe("FetchCurrencyPairs", () => {
  const _cache = {} as core.ICache;
  const _ea = {} as market.IExpertAdvisor;

  beforeEach(() => {
    _ea.getCurrencyPairs = jest.fn().mockResolvedValue(MockCurrencyPairs);
    _cache.get = jest.fn();
    _cache.set = jest.fn();
  });

  test("name", () => {
    const sut = new FetchCurrencyPairs(_cache, _ea);
    expect(sut.name).toEqual("FetchCurrencyPairs");
  });

  test("execute", async () => {
    const sut = new FetchCurrencyPairs(_cache, _ea);
    const result = await sut.execute(undefined);

    // assert success result
    expect(result).toEqual({
      continue: true,
      error: undefined,
      result: true
    });

    // assert the first call to cache
    const calls = (_cache.set as jest.Mock).mock.calls;
    expect(calls[0]).toEqual([
      CacheKeys.ALL_PAIRS,
      [
        { from: "BTC", to: "BCN" },
        { from: "BTC", to: "DASH" },
        { from: "BTC", to: "DOGE" },
        { from: "USDT", to: "BTC" },
        { from: "USDT", to: "DASH" }
      ]
    ]);

    // assert the second call to cache
    expect(calls[1]).toEqual([
      CacheKeys.ALL_PAIR_GRAPH,
      {
        edges: [
          { from: "BTC", to: "BCN" },
          { from: "BTC", to: "DASH" },
          { from: "BTC", to: "DOGE" },
          { from: "USDT", to: "BTC" },
          { from: "USDT", to: "DASH" }
        ],
        nodes: [
          { data: { id: "BTC", name: "BTC" }, id: "BTC" },
          { data: { id: "BCN", name: "BCN" }, id: "BCN" },
          { data: { id: "DASH", name: "DASH" }, id: "DASH" },
          { data: { id: "DOGE", name: "DOGE" }, id: "DOGE" },
          { data: { id: "USDT", name: "USDT" }, id: "USDT" }
        ]
      }
    ]);
  });
});
