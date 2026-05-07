import { MOCK_CARDS } from "@/mocks/cards";
import { Card } from "@fin/api-client";

export const getCards = async (): Promise<Card[]> => {
  return MOCK_CARDS;
};
