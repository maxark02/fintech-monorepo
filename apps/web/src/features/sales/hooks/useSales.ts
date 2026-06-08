// apps/web/src/features/stocks/hooks/useSales.ts
import { useState, useEffect, useCallback } from "react";
import { getStockQuote } from "../api/salesApi";
import { MassiveQuote } from "../api/salesApi";

export function useSales(tickers: string[], refreshIntervalMs = 15000) {
  const [data, setData] = useState<MassiveQuote[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Функция для получения обновленных котировок по всем переданным тикерам
  const fetchAllQuotes = useCallback(async () => {
    if (!tickers || tickers.length === 0) {
      setData([]);
      setIsLoading(false);
      return;
    }

    try {
      // Запускаем запросы ко всем тикерам параллельно через Promise.all
      const promises = tickers.map((ticker) => getStockQuote(ticker));
      const results = await Promise.all(promises);

      // Фильтруем null-результаты (на случай, если какой-то тикер упал с ошибкой)
      const validQuotes = results.filter(
        (quote): quote is MassiveQuote => quote !== null,
      );

      setData(validQuotes);
      setError(null);
    } catch (err: any) {
      console.error("Ошибка внутри хука useSales:", err);
      setError(err.message || "Не удалось загрузить данные рынка");
    } finally {
      setIsLoading(false);
    }
  }, [tickers]);

  useEffect(() => {
    // Первый запуск при монтировании компонента
    setIsLoading(true);
    fetchAllQuotes();

    // Настраиваем интервал для фонового обновления цен (real-time симуляция)
    const interval = setInterval(() => {
      fetchAllQuotes();
    }, refreshIntervalMs);

    // Очищаем таймер при размонтировании страницы/компонента
    return () => clearInterval(interval);
  }, [fetchAllQuotes, refreshIntervalMs]);

  // Возвращаем данные, состояния и функцию принудительного рефреша (например, для кнопки "Обновить")
  return {
    salesData: data,
    isLoading,
    error,
    refetch: fetchAllQuotes,
  };
}
