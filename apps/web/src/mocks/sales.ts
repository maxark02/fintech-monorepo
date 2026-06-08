// Этот файл симулирует ответ от сервера
export const getMockStockData = (ticker: string) => {
  const basePrices: Record<string, number> = {
    AAPL: 175.24,
    TSLA: 180.5,
    NVDA: 850.12,
    BTC: 68000.0,
  };

  const price = basePrices[ticker] || 100.0;
  // Генерируем случайное изменение для "живого" эффекта
  const change = (Math.random() - 0.5) * 5;

  return {
    ticker,
    price: price + change,
    change: change,
    changePercent: parseFloat(((change / price) * 100).toFixed(2)),
    volume: Math.floor(Math.random() * 1000000),
    high: price + 2,
    low: price - 2,
    updatedAt: new Date().toISOString(),
  };
};
