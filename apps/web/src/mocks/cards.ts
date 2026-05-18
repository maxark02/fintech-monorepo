import { Card } from "@fin/api-client";

export const MOCK_CARDS: Card[] = [
  {
    id: "credit",
    cardNumber: "3456 1234 8532 9903",
    type: "credit",
    network: "Mastercard",
    lastFour: "9903",
  },
  {
    id: "debit",
    cardNumber: "1234 5678 9012 3456",
    type: "credit",
    network: "Visa",
    lastFour: "3456",
  },
];
