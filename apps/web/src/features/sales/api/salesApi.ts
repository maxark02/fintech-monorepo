import { getMockStockData } from "@/mocks/sales";

export interface MassiveQuote {
  ticker: string;
  price: number;
  change: number; // Изменение цены в абсолютном значении
  changePercent: number; // Изменение в процентах (например, +2.5%)
  volume: number; // Объем торгов
  high: number; // Максимум за день
  low: number; // Минимум за день
  updatedAt: string; // Время последнего обновления
}

export interface MassiveTickerInfo {
  ticker: string;
  name: string; // Полное название компании (например, Apple Inc.)
  assetClass: "equity" | "crypto"; // Акция или крипта
  logoUrl?: string; // Ссылка на логотип (если отдает API)
}

export async function getStockQuote(
  ticker: string,
): Promise<MassiveQuote | null> {
  // Имитируем сетевую задержку
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Возвращаем данные из нашей "симуляции"
  return getMockStockData(ticker);
}
