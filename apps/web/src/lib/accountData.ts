import { Balance, Card, Transaction } from "@fin/api-client";

/**
 * Детерминированная генерация данных аккаунта.
 *
 * Каждому пользователю по его id выдаётся свой уникальный, но СТАБИЛЬНЫЙ
 * набор баланса/транзакций/карт. Стабильный — потому что seed берётся из
 * user.id, а не из Math.random(): данные не «прыгают» при перезагрузке
 * страницы, но у каждого аккаунта они свои. Так сайт выглядит живым.
 */

// --- Детерминированный ГПСЧ (cyrb53 хэш строки + mulberry32) ---

function cyrb53(str: string, seed = 0): number {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Rng = () => number;

const randInt = (rng: Rng, min: number, max: number) =>
  Math.floor(rng() * (max - min + 1)) + min;

const pick = <T>(rng: Rng, arr: readonly T[]): T =>
  arr[Math.floor(rng() * arr.length)]!;

// Случайная сумма в диапазоне, округлённая до шага (по умолчанию до 100 ₩)
const randAmount = (rng: Rng, min: number, max: number, step = 100) =>
  Math.round(randInt(rng, min, max) / step) * step;

// --- Шаблоны транзакций (KRW) ---

type Template = {
  title: string;
  merchant: string;
  category: string;
  emoji: string;
  type: "income" | "expense" | "transfer";
  min: number;
  max: number;
};

const INCOME_TEMPLATES: readonly Template[] = [
  { title: "Salary", merchant: "Toss", category: "Work", emoji: "💰", type: "income", min: 2_500_000, max: 4_200_000 },
  { title: "Freelance", merchant: "Client", category: "Work", emoji: "💻", type: "income", min: 150_000, max: 1_300_000 },
  { title: "Cashback", merchant: "Toss", category: "Reward", emoji: "🎁", type: "income", min: 500, max: 6_000 },
  { title: "Dividend", merchant: "Toss Securities", category: "Invest", emoji: "📈", type: "income", min: 8_000, max: 180_000 },
  { title: "Refund", merchant: "Coupang", category: "Shopping", emoji: "↩️", type: "income", min: 5_000, max: 95_000 },
  { title: "From friend", merchant: "Toss", category: "Transfer", emoji: "💸", type: "transfer", min: 5_000, max: 90_000 },
];

const EXPENSE_TEMPLATES: readonly Template[] = [
  { title: "Starbucks", merchant: "Starbucks", category: "Food", emoji: "☕", type: "expense", min: 4_500, max: 9_500 },
  { title: "Netflix", merchant: "Netflix", category: "Subscription", emoji: "🎬", type: "expense", min: 13_500, max: 17_000 },
  { title: "Spotify", merchant: "Spotify", category: "Subscription", emoji: "🎵", type: "expense", min: 10_900, max: 10_900 },
  { title: "Coupang", merchant: "Coupang", category: "Shopping", emoji: "📦", type: "expense", min: 8_000, max: 160_000 },
  { title: "Baemin", merchant: "Baemin", category: "Food", emoji: "🍗", type: "expense", min: 12_000, max: 48_000 },
  { title: "GS25", merchant: "GS25", category: "Convenience", emoji: "🏪", type: "expense", min: 1_500, max: 16_000 },
  { title: "Olive Young", merchant: "Olive Young", category: "Beauty", emoji: "💄", type: "expense", min: 12_000, max: 65_000 },
  { title: "Kakao Taxi", merchant: "Kakao T", category: "Transport", emoji: "🚕", type: "expense", min: 5_000, max: 26_000 },
  { title: "CGV", merchant: "CGV", category: "Entertainment", emoji: "🍿", type: "expense", min: 12_000, max: 32_000 },
  { title: "Apple", merchant: "Apple", category: "Shopping", emoji: "🍎", type: "expense", min: 19_000, max: 1_600_000 },
  { title: "Daiso", merchant: "Daiso", category: "Shopping", emoji: "🛍️", type: "expense", min: 2_000, max: 22_000 },
  { title: "Gym", merchant: "FitLab", category: "Health", emoji: "🏋️", type: "expense", min: 50_000, max: 120_000 },
  { title: "Metro", merchant: "Seoul Metro", category: "Transport", emoji: "🚇", type: "expense", min: 1_400, max: 3_000 },
  { title: "McDonald's", merchant: "McDonald's", category: "Food", emoji: "🍔", type: "expense", min: 6_000, max: 16_000 },
  { title: "Uniqlo", merchant: "Uniqlo", category: "Shopping", emoji: "👕", type: "expense", min: 19_000, max: 130_000 },
  { title: "To friend", merchant: "Toss", category: "Transfer", emoji: "💸", type: "transfer", min: 5_000, max: 120_000 },
];

const NETWORKS: readonly ("Visa" | "Mastercard")[] = ["Visa", "Mastercard"];

const toDateString = (daysAgo: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
};

export type AccountData = {
  transactions: Transaction[];
  cards: Card[];
  balance: Balance;
};

export function generateAccountData(userId?: string | null): AccountData {
  const seed = cyrb53(userId && userId.length > 0 ? userId : "guest");
  const rng = mulberry32(seed);

  // --- Карты (2–3 на аккаунт) ---
  const cardCount = randInt(rng, 2, 3);
  const cards: Card[] = Array.from({ length: cardCount }, (_, i) => {
    const lastFour = String(randInt(rng, 1000, 9999));
    const groups = Array.from({ length: 3 }, () =>
      String(randInt(rng, 1000, 9999)),
    );
    return {
      id: String(i + 1),
      cardNumber: `${groups[0]} ${groups[1]} ${groups[2]} ${lastFour}`,
      type: rng() > 0.4 ? "credit" : "debit",
      network: pick(rng, NETWORKS),
      lastFour,
      balance: randAmount(rng, 100_000, 3_500_000),
    };
  });
  const cardIds = cards.map((c) => c.id);

  // --- Транзакции ---
  const transactions: Transaction[] = [];
  let txId = 1;

  const addTx = (tpl: Template, daysAgo: number) => {
    const value = randAmount(rng, tpl.min, tpl.max);
    transactions.push({
      id: String(txId++),
      title: tpl.title,
      category: tpl.category,
      amount: tpl.type === "expense" ? -value : value,
      currency: "KRW",
      date: toDateString(daysAgo),
      merchant: tpl.merchant,
      type: tpl.type,
      emoji: tpl.emoji,
      cardId: pick(rng, cardIds),
    });
  };

  // Зарплата — недавняя
  addTx(INCOME_TEMPLATES[0]!, randInt(rng, 1, 8));

  // Доп. доходы (1–3)
  const extraIncome = randInt(rng, 1, 3);
  for (let i = 0; i < extraIncome; i++) {
    addTx(pick(rng, INCOME_TEMPLATES.slice(1)), randInt(rng, 0, 60));
  }

  // Расходы (10–18)
  const expenseCount = randInt(rng, 10, 18);
  for (let i = 0; i < expenseCount; i++) {
    addTx(pick(rng, EXPENSE_TEMPLATES), randInt(rng, 0, 65));
  }

  // Сортировка по дате (свежие сверху)
  transactions.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  // --- Баланс ---
  // Базовый «капитал» аккаунта берём по нелинейной шкале, чтобы у разных
  // аккаунтов балансы заметно отличались (от пары сотен тысяч до десятков млн),
  // а не кучковались в одном диапазоне.
  const net = transactions.reduce((s, t) => s + t.amount, 0);
  const base = randAmount(rng, 100_000, 40_000_000) * (0.4 + rng() * 1.6);
  const total = Math.max(50_000, Math.round((base + net) / 100) * 100);
  const changePct = Math.round((rng() * 8 - 3) * 10) / 10; // -3.0% … +5.0%
  const changeAmount = Math.round((total * changePct) / 100 / 100) * 100;

  const balance: Balance = {
    total,
    available: Math.max(0, total - randAmount(rng, 0, 50_000)),
    currency: "KRW",
    change: changePct,
    changeAmount,
    transactions,
    cards,
  };

  return { transactions, cards, balance };
}
