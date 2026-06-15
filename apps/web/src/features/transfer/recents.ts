// Недавние получатели перевода — детерминированно по user.id, чтобы у каждого
// аккаунта был свой стабильный список «кому уже отправлял деньги».

export type Recipient = {
  id: string;
  name: string;
  bank: string;
  accountNumber: string;
  lastSent: number;
};

export const BANKS: readonly string[] = [
  "Toss Bank",
  "KB Kookmin",
  "Shinhan",
  "Woori",
  "Hana",
  "NH Nonghyup",
  "Kakao Bank",
  "IBK",
  "K Bank",
  "SC Jeil",
];

const NAMES: readonly string[] = [
  "Min-jun",
  "Seo-yeon",
  "Ji-ho",
  "Ha-eun",
  "Do-yun",
  "Soo-ah",
  "Eun-woo",
  "Ji-woo",
  "Hyun-woo",
  "Yu-jin",
  "Jae-won",
  "Na-eun",
  "Seo-jun",
  "Da-eun",
];

// --- Детерминированный ГПСЧ (cyrb53 + mulberry32) ---
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

export function generateRecents(userId?: string | null): Recipient[] {
  const rng = mulberry32(
    cyrb53(userId && userId.length > 0 ? `${userId}:recents` : "guest:recents"),
  );
  const randInt = (min: number, max: number) =>
    Math.floor(rng() * (max - min + 1)) + min;

  const namePool = [...NAMES];
  const count = randInt(3, 6);
  const recipients: Recipient[] = [];

  for (let i = 0; i < count && namePool.length > 0; i++) {
    const name = namePool.splice(Math.floor(rng() * namePool.length), 1)[0]!;
    const bank = BANKS[Math.floor(rng() * BANKS.length)]!;
    const accountNumber = `${randInt(100, 999)}-${randInt(1000, 9999)}-${randInt(
      100000,
      999999,
    )}`;
    const lastSent = Math.round(randInt(5_000, 500_000) / 100) * 100;
    recipients.push({ id: String(i + 1), name, bank, accountNumber, lastSent });
  }

  return recipients;
}
