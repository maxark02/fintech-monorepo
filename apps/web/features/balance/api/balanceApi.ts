import { Balance } from "@fin/api-client";
import { MOCK_TRANSACTIONS } from "@/mocks/transactions";
import { MOCK_CARDS } from "@/mocks/cards";

const BASE_BALANCE = 0;

const totalIncome = MOCK_TRANSACTIONS.filter((t) => t.type === "income").reduce(
  (s, t) => s + t.amount,
  0,
);

const Cards = MOCK_CARDS.map((card) => ({
  id: card.id,
  cardNumber: card.cardNumber,
  type: card.type,
  network: card.network,
  lastFour: card.lastFour,
}));

const totalExpense = MOCK_TRANSACTIONS.filter(
  (t) => t.type === "expense",
).reduce((s, t) => s + t.amount, 0);

export const getBalance = async (): Promise<Balance> => {
  return {
    total: BASE_BALANCE + totalIncome - totalExpense,
    currency: "KRW",
    available: BASE_BALANCE,
    change: 0,
    changeAmount: 0,
    transactions: MOCK_TRANSACTIONS,
    cards: [
      {
        id: "1",
        cardNumber: "1234 5678 9012 3456",
        type: "credit",
        network: "Visa",
        lastFour: "3456",
      },
      {
        id: "2",
        cardNumber: "1234 5678 9012 3456",
        type: "credit",
        network: "Visa",
        lastFour: "3456",
      },
    ],
  };
};
