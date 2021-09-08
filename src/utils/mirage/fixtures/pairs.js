export default [
  {
    id: "BTCUSDT",
    symbol: "BTC/USDT",
    base: "BTC",
    quote: "USDT",
    precision: { base: 8, quote: 8, amount: 5, price: 2 },
    limits: {
      cost: { min: 10, max: null },
      price: { min: 0.01, max: 1000000 },
      amount: { min: 0.00001, max: 9000 },
      market: { min: 0, max: 112.30474352 },
    },
    active: true,
    multiplier: 1,
    short: "BTC/USDT",
    tradeViewSymbol: "BTCUSDT",
    zignalyId: "BTCUSDT",
    unitsInvestment: "USDT",
    unitsAmount: "BTC",
  },
];
