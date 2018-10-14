import "jest";
import RefreshOrderbooks from "../../src/jobs/refreshOrderbooks";
import MockAvailableCurrencyPairs from "../../data/mock.canonicalized.currencyPairs";
import MockOrderBooks from "../../data/mock.canonicalized.orderbooks";
import { CacheKeys } from "../../src/core/enum";

describe("RefreshOrderbooks", () => {
  const _cache = {} as core.ICache;
  const _ea = {} as market.IExpertAdvisor;

  beforeEach(() => {
    _ea.getOrderBooks = jest.fn().mockResolvedValue(MockOrderBooks);
    _cache.get = jest.fn().mockResolvedValue(MockAvailableCurrencyPairs);
    _cache.set = jest.fn();
  });

  test("name", () => {
    const sut = new RefreshOrderbooks(_cache, _ea);
    expect(sut.name).toEqual("RefreshOrderbooks");
  });

  test("execute", async () => {
    const sut = new RefreshOrderbooks(_cache, _ea);
    const result = await sut.execute();

    expect(_cache.get).toHaveBeenCalledWith(CacheKeys.AVAILABLE_PAIRS);

    expect(_ea.getOrderBooks).toHaveBeenCalledWith(MockAvailableCurrencyPairs);

    expect(_cache.set).toHaveBeenCalledWith(
      CacheKeys.ORDERBOOKS,
      MockOrderBooks
    );

    // assert success result
    expect(result).toEqual({
      continue: true,
      result: MockOrderBooks,
      error: null
    });
  });
});
