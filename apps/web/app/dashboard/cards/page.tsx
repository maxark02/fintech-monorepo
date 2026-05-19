"use client";

import { useState } from "react";
import { Card } from "@fin/api-client";
import { PageHeader } from "../_components/PageHeader";
import { NavIcon } from "../_components/nav-icon";
import { useBalance } from "../../../features/balance/hooks/useBalance";

function CardItem({ card, gradient }: { card: Card; gradient: string }) {
  const [showNumber, setShowNumber] = useState(false);

  return (
    <div className="rounded-2xl p-5 mb-3" style={{ background: gradient }}>
      <div className="flex items-center justify-between ">
        <span className="text-white/60 text-sm">{card.id}</span>
        <button className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white">
          <NavIcon name="more-vertical" className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-white/70 text-sm font-mono tracking-widest">
          {showNumber
            ? `${card.cardNumber}`
            : `•••• •••• •••• ${card.lastFour}`}
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

      <div className="flex items-center justify-between mt-3">
        <span className="text-white font-bold text-base">{card.network}</span>
      </div>
    </div>
  );
}

const CARD_GRADIENTS: Record<string, string> = {
  "1": "linear-gradient(135deg, #0f1a35 0%, #1c1c22 100%)",
  "2": "linear-gradient(135deg, #0f1a35 0%, #252530 100%)",
};
export default function CardsPage() {
  const { balance, isLoading } = useBalance();

  const totalCardBalance =
    balance?.cards.reduce((sum, card) => sum + card.balance, 0) ?? 0;

  const card1Balance = balance?.cards.find((c) => c.id === "1")?.balance ?? 0;
  const card2Balance = balance?.cards.find((c) => c.id === "2")?.balance ?? 0;

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="bg-[#1c1c22] rounded-2xl p-4">
        <p className="text-white/50 text-xs mb-1">Total Balance on Cards</p>
        <p className="text-white text-2xl font-bold mb-4">
          {isLoading ? "..." : `₩${totalCardBalance.toLocaleString("ko-KR")}`}
        </p>
        ...
      </div>

      {(balance?.cards ?? []).map((card) => (
        <CardItem
          key={card.id}
          card={card}
          gradient={CARD_GRADIENTS[card.id] ?? "..."}
        />
      ))}
    </div>
  );
}
