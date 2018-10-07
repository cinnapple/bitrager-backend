import "jest";
import PoloResponseCanonicalizer from "../../../src/market/poloniex/poloResponseCanonicalizer";
import MockReturnOrderbookResponse from "../../../src/data/mock.polo.orderbooks.profit";

describe("PoloResponseCanonicalizer", () => {
  test("canoOrderbookResponse", () => {
    const sut = new PoloResponseCanonicalizer();
    const result = sut.canoOrderbookResponse(
      "USDT_BTC",
      MockReturnOrderbookResponse
    );
    expect(result.asks).toEqual([
      { cumVol: 1, px: 5010, sumProd: 5010, vol: 1 },
      { cumVol: 3, px: 5020, sumProd: 10040, vol: 2 },
      { cumVol: 6, px: 5030, sumProd: 15090, vol: 3 },
      { cumVol: 10, px: 5040, sumProd: 20160, vol: 4 },
      { cumVol: 15, px: 5050, sumProd: 25250, vol: 5 }
    ]);
    expect(result.bids).toEqual([
      { cumVol: 1, px: 5000, sumProd: 5000, vol: 1 },
      { cumVol: 3, px: 4090, sumProd: 8180, vol: 2 },
      { cumVol: 6, px: 4080, sumProd: 12240, vol: 3 },
      { cumVol: 10, px: 4070, sumProd: 16280, vol: 4 },
      { cumVol: 15, px: 4060, sumProd: 20300, vol: 5 }
    ]);
    expect(result.pair).toEqual({ from: "USDT", to: "BTC" });
  });
});
