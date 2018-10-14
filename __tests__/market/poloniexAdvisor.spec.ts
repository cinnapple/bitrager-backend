import "jest";
import PoloniexAdvisor from "../../src/market/poloniexAdvisor";
import MockReturnTickerResponse from "../../data/mock.polo.returnTickerResponse";
import MockReturnOrderbookResponse from "../../data/mock.polo.returnOrderbookResponse";

describe("PoloniexAdvisor", () => {
  const _config: core.IConfig = <any>{};
  const _webClient: core.IWebClient = <any>{};

  beforeEach(() => {
    _config.exchanges = [
      {
        id: "poloniex",
        takerFees: 0.2 / 100,
        startCurrency: "USDT"
      }
    ];
    _webClient.get = jest.fn();
  });

  test("getCurrencyPairs", async () => {
    const sut = new PoloniexAdvisor(_config, _webClient);
    _webClient.get = jest.fn().mockResolvedValue(MockReturnTickerResponse);
    const result = await sut.getCurrencyPairs();
    expect(result).toEqual([
      { from: "BTC", to: "BCN" },
      { from: "BTC", to: "DASH" },
      { from: "BTC", to: "DOGE" }
    ]);
  });

  test("getOrderBooks", async () => {
    const sut = new PoloniexAdvisor(_config, _webClient);
    _webClient.get = jest.fn().mockResolvedValue(MockReturnOrderbookResponse);
    const result = await sut.getOrderBooks({
      USDT_BTC: true,
      BTC_ETH: true,
      USDT_ETH: true
    });
    expect(result).toEqual([
      {
        asks: [
          { cumVol: 1, prod: 10, px: 10, vol: 1 },
          { cumVol: 3, prod: 40, px: 20, vol: 2 },
          { cumVol: 6, prod: 90, px: 30, vol: 3 }
        ],
        bids: [
          { cumVol: 1, prod: 9, px: 9, vol: 1 },
          { cumVol: 3, prod: 16, px: 8, vol: 2 },
          { cumVol: 6, prod: 21, px: 7, vol: 3 }
        ],
        pair: { from: "USDT", to: "BTC" }
      },
      {
        asks: [
          { cumVol: 1, prod: 110, px: 110, vol: 1 },
          { cumVol: 3, prod: 240, px: 120, vol: 2 },
          { cumVol: 6, prod: 390, px: 130, vol: 3 }
        ],
        bids: [
          { cumVol: 1, prod: 109, px: 109, vol: 1 },
          { cumVol: 3, prod: 216, px: 108, vol: 2 },
          { cumVol: 6, prod: 321, px: 107, vol: 3 }
        ],
        pair: { from: "BTC", to: "ETH" }
      },
      {
        asks: [
          { cumVol: 1, prod: 210, px: 210, vol: 1 },
          { cumVol: 3, prod: 440, px: 220, vol: 2 },
          { cumVol: 6, prod: 690, px: 230, vol: 3 }
        ],
        bids: [
          { cumVol: 1, prod: 209, px: 209, vol: 1 },
          { cumVol: 3, prod: 416, px: 208, vol: 2 },
          { cumVol: 6, prod: 621, px: 207, vol: 3 }
        ],
        pair: { from: "USDT", to: "ETH" }
      }
    ]);
  });

  test("applyTakerFees", () => {
    const sut = new PoloniexAdvisor(_config, _webClient);
    const result = sut.applyTakerFees(1000);
    expect(result).toEqual(1000 * (1 - 0.2 / 100));
  });
});
