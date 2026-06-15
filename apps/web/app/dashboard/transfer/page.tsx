"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "../_components/PageHeader";
import { NavIcon } from "../_components/nav-icon";
import { useBalance } from "@/features/balance/hooks/useBalance";
import { useAuthStore } from "@/features/auth/store/authStore";
import { BANKS, generateRecents } from "@/features/transfer/recents";
import { formatKRW } from "@/lib/format";

const QUICK_AMOUNTS = [10_000, 50_000, 100_000];

// Цвет аватара получателя по имени
const AVATAR_COLORS = [
  "from-blue-500 to-blue-700",
  "from-emerald-500 to-emerald-700",
  "from-purple-500 to-purple-700",
  "from-orange-500 to-orange-700",
  "from-pink-500 to-pink-700",
  "from-cyan-500 to-cyan-700",
];
const colorFor = (s: string) =>
  AVATAR_COLORS[
    [...s].reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_COLORS.length
  ]!;

export default function TransferPage() {
  const router = useRouter();
  const { balance } = useBalance();
  const userId = useAuthStore((s) => s.user?.id);

  const recents = useMemo(() => generateRecents(userId), [userId]);

  const [name, setName] = useState("");
  const [bank, setBank] = useState("");
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const available = balance?.total ?? 0;
  const tooMuch = amount > available;
  const canSend =
    name.trim() !== "" &&
    bank !== "" &&
    account.trim() !== "" &&
    amount > 0 &&
    !tooMuch;

  const selectRecipient = (r: (typeof recents)[number]) => {
    setSelectedId(r.id);
    setName(r.name);
    setBank(r.bank);
    setAccount(r.accountNumber);
  };

  const onAmountChange = (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    setAmount(digits ? Number(digits) : 0);
  };

  // --- Экран успеха ---
  if (sent) {
    return (
      <div className="max-w-2xl mx-auto min-h-[60vh] flex flex-col items-center justify-center text-center px-4 text-text-main">
        <div className="w-20 h-20 rounded-full bg-green-500/15 flex items-center justify-center mb-5">
          <svg
            viewBox="0 0 24 24"
            className="w-10 h-10 text-green-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="text-text-muted text-sm mb-1">Sent to {name}</p>
        <p className="text-3xl font-bold mb-6">₩{formatKRW(amount)}</p>
        <button
          onClick={() => router.push("/dashboard/balance")}
          className="w-full max-w-xs h-14 rounded-2xl bg-accent text-white font-semibold hover:opacity-90 transition-opacity"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-24 px-4 md:px-0 text-text-main">
      <PageHeader title="Send money" />

      {/* Доступный баланс */}
      <div className="bg-bg-card rounded-2xl p-4 transition-colors">
        <p className="text-text-muted text-xs mb-1">Available balance</p>
        <p className="text-text-main text-2xl font-bold">
          ₩{formatKRW(available)}
        </p>
      </div>

      {/* Недавние получатели */}
      {recents.length > 0 && (
        <div className="space-y-2">
          <p className="text-text-muted text-xs font-semibold uppercase tracking-wide">
            Recent
          </p>
          <div className="flex items-stretch gap-3 overflow-x-auto scrollbar-hide pb-1">
            {recents.map((r) => (
              <button
                key={r.id}
                onClick={() => selectRecipient(r)}
                className={`flex flex-col items-center gap-1.5 shrink-0 w-16 ${
                  selectedId === r.id ? "opacity-100" : "opacity-80"
                }`}
              >
                <span
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${colorFor(
                    r.name,
                  )} flex items-center justify-center text-white font-semibold ring-2 ${
                    selectedId === r.id ? "ring-accent" : "ring-transparent"
                  }`}
                >
                  {r.name[0]}
                </span>
                <span className="text-text-main text-[11px] truncate w-full text-center">
                  {r.name}
                </span>
                <span className="text-text-muted text-[9px] truncate w-full text-center">
                  {r.bank}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Форма */}
      <div className="space-y-3">
        <div>
          <label className="text-text-muted text-xs mb-1 block">Recipient</label>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setSelectedId(null);
            }}
            placeholder="Recipient name"
            className="w-full bg-bg-card text-text-main placeholder-text-muted rounded-2xl px-4 py-3 text-sm outline-none border border-transparent focus:border-accent transition-colors"
          />
        </div>

        <div>
          <label className="text-text-muted text-xs mb-1 block">Bank</label>
          <select
            value={bank}
            onChange={(e) => {
              setBank(e.target.value);
              setSelectedId(null);
            }}
            className="w-full bg-bg-card text-text-main rounded-2xl px-4 py-3 text-sm outline-none border border-transparent focus:border-accent transition-colors appearance-none"
          >
            <option value="" disabled>
              Select bank
            </option>
            {BANKS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-text-muted text-xs mb-1 block">
            Account number
          </label>
          <input
            value={account}
            onChange={(e) => {
              setAccount(e.target.value);
              setSelectedId(null);
            }}
            inputMode="numeric"
            placeholder="123-4567-890123"
            className="w-full bg-bg-card text-text-main placeholder-text-muted rounded-2xl px-4 py-3 text-sm outline-none border border-transparent focus:border-accent transition-colors font-mono"
          />
        </div>

        {/* Сумма */}
        <div>
          <label className="text-text-muted text-xs mb-1 block">Amount</label>
          <div
            className={`bg-bg-card rounded-2xl px-4 py-3 border ${
              tooMuch ? "border-red-500" : "border-transparent"
            } transition-colors flex items-center`}
          >
            <span className="text-text-main text-xl font-bold mr-1">₩</span>
            <input
              value={amount ? formatKRW(amount) : ""}
              onChange={(e) => onAmountChange(e.target.value)}
              inputMode="numeric"
              placeholder="0"
              className="flex-1 bg-transparent text-text-main text-xl font-bold placeholder-text-muted outline-none w-full"
            />
          </div>
          {tooMuch && (
            <p className="text-red-500 text-xs mt-1">
              Amount exceeds your balance.
            </p>
          )}
          <div className="flex gap-2 mt-2">
            {QUICK_AMOUNTS.map((q) => (
              <button
                key={q}
                onClick={() => setAmount((a) => a + q)}
                className="flex-1 bg-bg-card text-text-muted rounded-xl py-2 text-xs font-medium hover:text-text-main transition-colors"
              >
                +{formatKRW(q)}
              </button>
            ))}
            <button
              onClick={() => setAmount(available)}
              className="flex-1 bg-bg-card text-text-muted rounded-xl py-2 text-xs font-medium hover:text-text-main transition-colors"
            >
              Max
            </button>
          </div>
        </div>
      </div>

      <button
        disabled={!canSend}
        onClick={() => setSent(true)}
        className="w-full h-14 rounded-2xl bg-accent text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
      >
        <NavIcon name="arrow-up-right" className="w-5 h-5" />
        {amount > 0 ? `Send ₩${formatKRW(amount)}` : "Send"}
      </button>
    </div>
  );
}
