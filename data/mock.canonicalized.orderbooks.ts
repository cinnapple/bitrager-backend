export default [
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
];
