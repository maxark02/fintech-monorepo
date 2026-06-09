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

  const shortName = item.ticker.slice(0, 2).toUpperCase();

  return (
    // 🌟 ИЗМЕНЕНО: hover:bg-accent/30 из v3 заменен на hover:bg-slate-500/10 dark:hover:bg-white/5, чтобы подсветка строки была адаптивной
    <div className="flex items-center justify-between py-3 group cursor-pointer hover:bg-slate-500/10 dark:hover:bg-white/5 px-2 -mx-2 rounded-2xl transition-colors">
      {/* Левая сторона: Логотип / Заглушка и информация об акции */}
      <div className="flex items-center gap-3.5">
        {/* Контейнер для логотипа */}
        {/* 🌟 ИЗМЕНЕНО: Заменили жесткий фон bg-[#2c2c35] на ваш системный bg-icon-bg */}
        <div className="w-11 h-11 rounded-full bg-icon-bg flex items-center justify-center font-bold text-sm tracking-wide text-blue-500 group-hover:scale-105 transition-transform overflow-hidden">
          <span>{shortName}</span>
        </div>

        <div>
          {/* 🌟 ИЗМЕНЕНО: Заменили text-white на text-text-main */}
          <div className="font-semibold text-text-main text-[15px]">
            {item.ticker}
          </div>
          {/* 🌟 ИЗМЕНЕНО: Заменили text-muted-foreground на text-text-muted */}
          <div className="text-xs text-text-muted mt-0.5">
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
          {/* 🌟 ИЗМЕНЕНО: Заменили text-white на text-text-main */}
          <div className="font-bold text-text-main text-[16px] flex items-center justify-end gap-0.5">
            <span>$</span>
            <NumberPopIn
              value={item.price.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            />
          </div>

          {/* Процент изменения за день */}
          {/* 🌟 ИЗМЕНЕНО: Убрали инлайновые HEX-коды, заменили на чистые классы text-red-500 и text-blue-500 */}
          <div
            className={`text-xs font-medium flex items-center justify-end gap-0.5 mt-0.5 ${
              isPositive ? "text-red-500" : "text-blue-500"
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
        {/* 🌟 ИЗМЕНЕНО: Вместо text-muted-foreground/40 используется text-text-muted/40, а при ховере — text-text-main */}
        <ChevronRight
          size={16}
          className="text-text-muted/40 group-hover:text-text-main transition-colors"
        />
      </div>
    </div>
  );
}
