"use client";

import { useState } from "react";
import { Card } from "@fin/api-client";
import { NavIcon } from "../../../../app/dashboard/_components/nav-icon";

export function CardItem({
  card,
  gradient,
  balance,
}: {
  card: Card;
  gradient: string;
  balance: number;
}) {
  const [showNumber, setShowNumber] = useState(false);

  return (
    <div className="rounded-2xl p-5 mb-3" style={{ background: gradient }}>
      <div className="flex items-center justify-between">
        <span className="text-white/60 text-sm">{card.id}</span>
        <button className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white">
          <NavIcon name="more-vertical" className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-white/70  font-mono tracking-widest">
          {showNumber ? card.cardNumber : `**** **** **** ${card.lastFour}`}
          <p className="font-bold text-xl text-white">
            {showNumber ? card?.balance : "Hided"}
          </p>
        </span>
        <button
          onClick={() => setShowNumber(!showNumber)}
          className="text-white/60 ml-2"
        >
          <NavIcon
            name={showNumber ? "eye-off" : "eye"}
            className="w-6 h-6 mt-4"
          />
        </button>
      </div>
      <div className="flex items-center justify-between"></div>

      <div className="flex items-center justify-between mt-3">
        <span className="text-xs font-bold ">{card.network}</span>
      </div>
    </div>
  );
}
