"use client";

import { NavIcon } from "../_components/nav-icon";
import { PageHeader } from "../_components/PageHeader";
import { NumberPopIn } from "../_components/NumberPopIn";
import { CardItem } from "@/features/card/components/cardItem"; // ✅ импорт из файла
import { useBalance } from "@/features/balance/hooks/useBalance";

const CARD_GRADIENTS: Record<string, string> = {
  credit: "linear-gradient(135deg, #0f1a35 0%, #1c1c22 100%)",
  debit: "linear-gradient(135deg, #0f1a35 0%, #252530 100%)",
};

export default function CardsPage() {
  // Карты берём из данных аккаунта: их количество и баланс уникальны для
  // каждого пользователя, а сумма по картам равна общему балансу счёта.
  const { balance } = useBalance();
  const cards = balance?.cards ?? [];
  const totalCardBalance = cards.reduce((sum, card) => sum + card.balance, 0);

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <PageHeader
        title="Cards"
        rightElement={
          <button className="w-9 h-9 rounded-full bg-icon-bg flex items-center justify-center text-text-main">
            <NavIcon name="plus" className="w-5 h-5" />
          </button>
        }
      />

      <div className="bg-bg-card rounded-2xl p-4 transition-colors">
        <p className="text-text-muted text-xs mb-1">Total Balance on Cards</p>
        <span className="text-text-main text-2xl font-bold mb-4">
          <NumberPopIn value={totalCardBalance.toLocaleString("ko-KR")} />
        </span>
      </div>

      {cards.map((card) => (
        <CardItem
          key={card.id}
          card={card}
          balance={card.balance}
          gradient={
            CARD_GRADIENTS[card.type] ??
            "linear-gradient(135deg, #0f1a35 0%, #1c1c22 100%)"
          }
        />
      ))}
    </div>
  );
}
