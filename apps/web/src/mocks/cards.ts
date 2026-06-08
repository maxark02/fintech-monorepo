import { Card } from "@fin/api-client";

export const MOCK_CARDS: Card[] = [
  {
    id: "Credit",
    cardNumber: "3456 1234 8532 9903",
    type: "credit",
    network: "Mastercard",
    lastFour: "9903",
    balance: 1245500,
  },
  {
    id: "Debit",
    cardNumber: "1234 5678 9012 3456",
    type: "credit",
    network: "Visa",
    lastFour: "3456",
    balance: 890300,
  },
];
