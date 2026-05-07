export type Currency = "KRW";

export type Balance = {
  total: number;
  available: number;
  currency: Currency;
  change: number;
  changeAmount: number;
  transactions: Transaction[];
  cards: Card[];
};

export type Transaction = {
  id: string;
  title: string;
  category: string;
  amount: number;
  currency: Currency;
  date: string;
  merchant: string;
  type: "income" | "expense" | "transfer";
  emoji: string;
  cardId: string;
};

export type StockItem = {
  id: string;
  ticker: string;
  name: string;
  price: number;
  quantity: number;
  change: number;
  totalValue: number;
};

export type Portfolio = {
  totalValue: number;
  dailyChange: number;
  items: StockItem[];
};

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  logout: () => void;
};

export type User = {
  username: string;
  email: string;
};
export type Card = {
  id: string;
  cardNumber: string;
  type: "credit" | "debit";
  network: "Visa" | "Mastercard" | null;
  lastFour: string;
};
