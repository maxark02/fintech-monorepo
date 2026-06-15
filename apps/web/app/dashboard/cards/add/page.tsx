"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@fin/api-client";
import { PageHeader } from "../../_components/PageHeader";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useLedgerStore } from "@/features/ledger/ledgerStore";

// Определяем платёжную сеть по первой цифре номера
function detectNetwork(digits: string): Card["network"] {
  if (digits.startsWith("4")) return "Visa";
  if (digits.startsWith("5")) return "Mastercard";
  return null;
}

// Группируем номер по 4 цифры: 1234 5678 9012 3456
const formatCardNumber = (raw: string) =>
  raw
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();

const formatExpiry = (raw: string) => {
  const d = raw.replace(/\D/g, "").slice(0, 4);
  return d.length <= 2 ? d : `${d.slice(0, 2)}/${d.slice(2)}`;
};

export default function AddCardPage() {
  const router = useRouter();
  const userId = useAuthStore((s) => s.user?.id);
  const addCard = useLedgerStore((s) => s.addCard);

  const [number, setNumber] = useState("");
  const [holder, setHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [type, setType] = useState<Card["type"]>("credit");

  const digits = number.replace(/\D/g, "");
  const network = detectNetwork(digits);
  const lastFour = digits.slice(-4);

  const valid =
    digits.length === 16 &&
    holder.trim() !== "" &&
    /^\d{2}\/\d{2}$/.test(expiry) &&
    cvv.length === 3;

  const handleAdd = () => {
    if (!valid || !userId) return;
    const card: Card = {
      id: `c-${Date.now()}`,
      cardNumber: formatCardNumber(number),
      type,
      network,
      lastFour,
      balance: 0,
    };
    addCard(userId, card);
    router.push("/dashboard/cards");
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-24 px-4 md:px-0 text-text-main">
      <PageHeader title="Add card" />

      {/* Живое превью карты */}
      <div
        className="rounded-2xl p-5 h-48 flex flex-col justify-between text-white"
        style={{
          background: "linear-gradient(135deg, #0f1a35 0%, #1c1c22 100%)",
        }}
      >
        <div className="flex items-center justify-between">
          <span className="text-white/60 text-sm capitalize">{type}</span>
          <span className="text-sm font-bold">{network ?? ""}</span>
        </div>
        <div className="font-mono tracking-widest text-lg">
          {formatCardNumber(number) || "•••• •••• •••• ••••"}
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="uppercase tracking-wide truncate max-w-[60%]">
            {holder || "CARDHOLDER NAME"}
          </span>
          <span className="font-mono">{expiry || "MM/YY"}</span>
        </div>
      </div>

      {/* Форма */}
      <div className="space-y-3">
        <div>
          <label className="text-text-muted text-xs mb-1 block">
            Card number
          </label>
          <input
            value={formatCardNumber(number)}
            onChange={(e) => setNumber(e.target.value)}
            inputMode="numeric"
            placeholder="1234 5678 9012 3456"
            className="w-full bg-bg-card text-text-main placeholder-text-muted rounded-2xl px-4 py-3 text-sm outline-none border border-transparent focus:border-accent transition-colors font-mono"
          />
        </div>

        <div>
          <label className="text-text-muted text-xs mb-1 block">
            Cardholder name
          </label>
          <input
            value={holder}
            onChange={(e) => setHolder(e.target.value.toUpperCase())}
            placeholder="JOHN DOE"
            className="w-full bg-bg-card text-text-main placeholder-text-muted rounded-2xl px-4 py-3 text-sm outline-none border border-transparent focus:border-accent transition-colors uppercase"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-text-muted text-xs mb-1 block">Expiry</label>
            <input
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              inputMode="numeric"
              placeholder="MM/YY"
              className="w-full bg-bg-card text-text-main placeholder-text-muted rounded-2xl px-4 py-3 text-sm outline-none border border-transparent focus:border-accent transition-colors font-mono"
            />
          </div>
          <div>
            <label className="text-text-muted text-xs mb-1 block">CVV</label>
            <input
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
              inputMode="numeric"
              placeholder="•••"
              className="w-full bg-bg-card text-text-main placeholder-text-muted rounded-2xl px-4 py-3 text-sm outline-none border border-transparent focus:border-accent transition-colors font-mono"
            />
          </div>
        </div>

        <div>
          <label className="text-text-muted text-xs mb-1 block">Card type</label>
          <div className="grid grid-cols-2 gap-2">
            {(["credit", "debit"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`rounded-2xl py-3 text-sm font-medium capitalize transition-colors ${
                  type === t
                    ? "bg-accent text-white"
                    : "bg-bg-card text-text-muted hover:text-text-main"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        disabled={!valid}
        onClick={handleAdd}
        className="w-full h-14 rounded-2xl bg-accent text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
      >
        Add card
      </button>
    </div>
  );
}
