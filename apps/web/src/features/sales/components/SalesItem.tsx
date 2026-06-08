"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, ChevronRight } from "lucide-react";
import { NumberPopIn } from "#/app/dashboard/_components/NumberPopIn";
import { MassiveQuote } from "../api/salesApi";

interface SalesItemProps {
  item: MassiveQuote;
}

export default function SalesItem({ item }: SalesItemProps) {
  const [imageError, setImageError] = useState(false);
  const isPositive = item.changePercent >= 0;

  // Формируем первую букву тикера для заглушки (если логотипа нет)
  const shortName = item.ticker.slice(0, 2).toUpperCase();

  return (
    <div className="flex items-center justify-between py-3 group cursor-pointer hover:bg-accent/30 px-2 -mx-2 rounded-2xl transition-colors">
      {/* Левая сторона: Логотип / Заглушка и информация об акции */}
      <div className="flex items-center gap-3.5">
        {/* Контейнер для логотипа */}
        <div className="w-11 h-11 rounded-full bg-[#2c2c35] flex items-center justify-center font-bold text-sm tracking-wide text-blue-500 group-hover:scale-105 transition-transform overflow-hidden">
          {/* Если в API появится поле logoUrl, можно раскомментировать код ниже */}
          {/* item.logoUrl && !imageError ? (
            <img
              src={item.logoUrl}
              alt={item.ticker}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <span>{shortName}</span>
          )} */}
          <span>{shortName}</span>
        </div>

        <div>
          <div className="font-semibold text-white text-[15px]">
            {item.ticker}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            Vol:{" "}
            {item.volume >= 1e6
              ? `${(item.volume / 1e6).toFixed(1)}M`
              : item.volume.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Правая сторона: Цена, процент изменения и стрелочка шеврона */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          {/* Цена с анимацией переката цифр */}
          <div className="font-bold text-white text-[16px] flex items-center justify-end gap-0.5">
            <span>$</span>
            <NumberPopIn
              value={item.price.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            />
          </div>

          {/* Процент изменения за день (Фирменные цвета Toss) */}
          <div
            className={`text-xs font-medium flex items-center justify-end gap-0.5 mt-0.5 ${
              isPositive ? "text-[#f04452]" : "text-[#3182f6]"
            }`}
          >
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span>
              {isPositive ? "+" : ""}
              {item.changePercent}%
            </span>
          </div>
        </div>

        {/* Иконка перехода, плавно подсвечивается при наведении на всю карточку */}
        <ChevronRight
          size={16}
          className="text-muted-foreground/40 group-hover:text-white transition-colors"
        />
      </div>
    </div>
  );
}
