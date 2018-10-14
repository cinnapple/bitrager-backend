import "jest";
import KrakenAdvisor from "../../src/market/krakenAdvisor";
import MockReturnTickerResponse from "../../data/mock.polo.returnTickerResponse";
import MockReturnOrderbookResponse from "../../data/mock.polo.returnOrderbookResponse";

describe("KrakenAdvisor", () => {
  const _config: core.IConfig = <any>{};
  const _webClient: core.IWebClient = <any>{};

  beforeEach(() => {
    _config.exchanges = [
      {
        id: "kraken",
        takerFees: 0.2 / 100,
        startCurrency: "USDT"
      }
    ];
    _webClient.get = jest.fn();
  });

  test("getCurrencyPairs", async () => {
    const sut = new KrakenAdvisor(_config, _webClient);
    _webClient.get = jest.fn().mockResolvedValue(MockReturnTickerResponse);
    const result = await sut.getCurrencyPairs();
    expect(result).toEqual([
      { from: "BTC", to: "BCN" },
      { from: "BTC", to: "DASH" },
      { from: "BTC", to: "DOGE" }
    ]);
  });

  test("getCurrencyPairs", async () => {
    const sut = new KrakenAdvisor(_config, _webClient);
    _webClient.get = jest.fn().mockResolvedValue(MockReturnOrderbookResponse);
    const result = await sut.getOrderBooks({
      USDT_BTC: true,
      BTC_ETH: true
    });
    expect(result).toEqual([
      {
        pair: { from: "USDT", to: "BTC" },
        asks: [
          { px: 10, vol: 1, prod: 10, cumVol: 1 },
          { px: 20, vol: 2, prod: 40, cumVol: 3 },
          { px: 30, vol: 3, prod: 90, cumVol: 6 }
        ],
        bids: [
          { px: 9, vol: 1, prod: 9, cumVol: 1 },
          { px: 8, vol: 2, prod: 16, cumVol: 3 },
          { px: 7, vol: 3, prod: 21, cumVol: 6 }
        ]
      },
      {
        pair: { from: "BTC", to: "ETH" },
        asks: [
          { px: 110, vol: 1, prod: 110, cumVol: 1 },
          { px: 120, vol: 2, prod: 240, cumVol: 3 },
          { px: 130, vol: 3, prod: 390, cumVol: 6 }
        ],
        bids: [
          { px: 109, vol: 1, prod: 109, cumVol: 1 },
          { px: 108, vol: 2, prod: 216, cumVol: 3 },
          { px: 107, vol: 3, prod: 321, cumVol: 6 }
        ]
      }
    ]);
  });

  test("applyTakerFees", () => {
    const sut = new KrakenAdvisor(_config, _webClient);
    const result = sut.applyTakerFees(1000);
    expect(result).toEqual(1000 * (1 - 0.2 / 100));
  });
});
