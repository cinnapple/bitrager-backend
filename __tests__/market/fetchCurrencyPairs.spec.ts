import "jest";
import FetchCurrencyPairs from "../../src/jobs/fetchCurrencyPairs";
import MockData from "../../src/data/mock.polo.returnTicker";
import { CacheKeys } from "../../src/core/enum";

const _webClient = <core.IWebClient>{
  get: jest.fn().mockReturnValue(MockData)
};

const _cache = <core.ICache>{
  get: jest.fn(),
  set: jest.fn()
};

describe("FetchCurrencyPairs", () => {
  test("execute", async () => {
    const sut = new FetchCurrencyPairs(_webClient, _cache);
    await sut.execute(undefined);
    expect(_cache.set).toBeCalledWith(
      CacheKeys.MKT_CURRGRAPH,
      expect.anything()
    );
  });
});
