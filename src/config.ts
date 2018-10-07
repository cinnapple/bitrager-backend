export default {
  redis: {
    port: 6379
  },
  slack: {
    token: "",
    conversationId: "",
    url:
      "https://hooks.slack.com/services/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"
  },
  startCurrency: "USDT",
  maxDepth: 4,
  maxUSD: 1000,
  exchanges: [
    {
      id: "poloniex",
      takerFees: 0.2 / 100
    }
  ],
  workers: [
    {
      id: "prepare",
      name: "prepare currency pairs and trianguar arbs",
      interval: 1000 * 60,
      jobs: ["FetchCurrencyPairs", "FindTriangularPaths"],
      config: {}
    },
    {
      id: "plan",
      name: "refresh orderbooks and find arbitrage opportunities",
      interval: 1,
      jobs: ["RefreshOrderbooks", "PlanArbitrage"],
      config: {}
    }
  ]
} as core.IConfig;
