import "jest";
import MockOrderbooksLoss from "../../data/mock.canonicalized.orderbooks.loss";
import MockOrderbooksProfit from "../../data/mock.canonicalized.orderbooks.profit";
import MockCacheCurrencyRoutes from "../../data/mock.cache.currencyRoutes";
import AccountInfo from "../../data/mock.canonicalized.accountInfo";
import PlanArbitrage from "../../src/jobs/planArbitrage";

describe("PlanArbitrage", () => {
  const _config = <core.IConfig>{};
  const _cache = <core.ICache>{};
  const _ea = <market.IExpertAdvisor>{
    info: {},
    applyTakerFees: vol => vol * 1
  };
  const _reporter = <core.IReporter>{
    notify: jest.fn()
  };
  const setCacheGet = orderbook =>
    jest
      .fn()
      .mockReturnValueOnce(orderbook)
      .mockReturnValueOnce(MockCacheCurrencyRoutes)
      .mockReturnValueOnce(AccountInfo);

  beforeEach(() => {
    _config.maxUSD = 300;
    _cache.set = jest.fn();
    _ea.info.startCurrency = "USDT";
  });

  test("execute - loss", async () => {
    _cache.get = setCacheGet(MockOrderbooksLoss);
    const sut = new PlanArbitrage(_config, _cache, _ea, _reporter);
    const result = await sut.execute();
    expect(result).toEqual({
      continue: false,
      error: null,
      result: { plans: [], status: "new" }
    });
  });

  test("execute - profit", async () => {
    _cache.get = setCacheGet(MockOrderbooksProfit);
    const sut = new PlanArbitrage(_config, _cache, _ea, _reporter);
    const result = await sut.execute();
    expect(result).toEqual({
      continue: true,
      error: null,
      result: {
        plans: [
          {
            profit: 0.2519038157973341,
            qty: 100,
            route: ["USDT", "BTC", "ETH", "USDT"],
            states: [
              { curr: "USDT", funds: 100 },
              { curr: "BTC", funds: 0.01512420047512041 },
              { curr: "ETH", funds: 0.44235936908528145 },
              { curr: "USDT", funds: 100.25190381579733 }
            ]
          },
          {
            profit: 0.5038076315946682,
            qty: 200,
            route: ["USDT", "BTC", "ETH", "USDT"],
            states: [
              { curr: "USDT", funds: 200 },
              { curr: "BTC", funds: 0.03024840095024082 },
              { curr: "ETH", funds: 0.8847187381705629 },
              { curr: "USDT", funds: 200.50380763159467 }
            ]
          },
          {
            profit: 0.7557114473920592,
            qty: 300,
            route: ["USDT", "BTC", "ETH", "USDT"],
            states: [
              { curr: "USDT", funds: 300 },
              { curr: "BTC", funds: 0.04537260142536124 },
              { curr: "ETH", funds: 1.3270781072558446 },
              { curr: "USDT", funds: 300.75571144739206 }
            ]
          }
        ],
        status: "new"
      }
    });
  });
});
