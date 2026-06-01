"use client";

import { NavIcon } from "../_components/nav-icon";
import { PageHeader } from "../_components/PageHeader";
import { NumberPopIn } from "../_components/NumberPopIn";
import { CardItem } from "@/features/card/components/cardItem"; // ✅ импорт из файла
import { MOCK_CARDS } from "@/mocks/cards";

const CARD_GRADIENTS: Record<string, string> = {
  credit: "linear-gradient(135deg, #0f1a35 0%, #1c1c22 100%)",
  debit: "linear-gradient(135deg, #0f1a35 0%, #252530 100%)",
};

export default function CardsPage() {
  const totalCardBalance = MOCK_CARDS.reduce(
    (sum, card) => sum + card.balance,
    0,
  );

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <PageHeader
        title="Cards"
        rightElement={
          <button className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white">
            <NavIcon name="plus" className="w-5 h-5" />
          </button>
        }
      />

      <div className="bg-[#1c1c22] rounded-2xl p-4">
        <p className="text-white/50 text-xs mb-1">Total Balance on Cards</p>
        <span className="text-white text-2xl font-bold mb-4">
          <NumberPopIn value={totalCardBalance.toLocaleString("ko-KR")} />
        </span>
      </div>

      {MOCK_CARDS.map((card) => (
        <CardItem
          key={card.id}
          card={card}
          balance={card.balance}
          gradient={
            CARD_GRADIENTS[card.id] ??
            "linear-gradient(135deg, #0f1a35 0%, #1c1c22 100%)"
          }
        />
      ))}
    </div>
  );
}
