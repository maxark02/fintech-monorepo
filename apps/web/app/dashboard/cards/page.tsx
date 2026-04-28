"use client"

import { useState } from "react"
import { PageHeader } from "../_components/PageHeader"
import { NavIcon } from "../_components/nav-icon"

function CardItem({
  label,
  amount,
  cardNumber,
  expiry,
  network,
  gradient,
}: {
  label: string
  amount: string
  cardNumber: string
  expiry: string
  network: string
  gradient: string
}) {
  const [showNumber, setShowNumber] = useState(false)

  const maskedNumber = cardNumber.replace(/(\d{4})\s+•{4}\s+•{4}\s+(\d{4})/, (_, first, last) =>
    showNumber ? `${first}  1234  5678  ${last}` : `${first}  ••••  ••••  ${last}`
  )

  return (
    <div className="rounded-2xl p-5 mb-3" style={{ background: gradient }}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-white/60 text-sm">{label}</span>
        <button className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white">
          <NavIcon name="more-vertical" className="w-4 h-4" />
        </button>
      </div>

      <p className="text-white text-2xl font-bold mb-3">{amount}</p>

      {/* Chip */}
      <div className="w-8 h-6 rounded-md bg-[#c9a227] mb-3"></div>

      <div className="flex items-center justify-between">
        <span className="text-white/70 text-sm font-mono tracking-widest">{maskedNumber}</span>
        <button onClick={() => setShowNumber(!showNumber)} className="text-white/60 ml-2">
          <NavIcon name={showNumber ? "eye-off" : "eye"} className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div>
          <p className="text-white/50 text-xs">Valid Thru</p>
          <p className="text-white/80 text-sm">{expiry}</p>
        </div>
        <span className="text-white font-bold text-base">{network}</span>
      </div>
    </div>
  )
}

export default function CardsPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="My Cards"
        rightElement={
          <button className="w-9 h-9 rounded-full bg-[#3b5bdb] flex items-center justify-center text-white">
            <NavIcon name="plus" className="w-5 h-5" />
          </button>
        }
      />

      {/* Summary Card */}
      <div className="bg-[#1c1c22] rounded-2xl p-4">
        <p className="text-white/50 text-xs mb-1">Total Balance on Cards</p>
        <p className="text-white text-2xl font-bold mb-4">₽2,456,250</p>
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-[#3b5bdb] text-white rounded-xl py-2.5 text-sm font-semibold">
            Top Up
          </button>
          <button className="bg-[#252530] text-white rounded-xl py-2.5 text-sm font-semibold">
            Transfer
          </button>
        </div>
      </div>

      {/* Primary Card */}
      <CardItem
        label="Primary Card"
        amount="₽1,245,500"
        cardNumber="4532  ••••  ••••  9012"
        expiry="12/26"
        network="Visa"
        gradient="linear-gradient(135deg, #3b5bdb 0%, #2845c9 100%)"
      />

      {/* Card Actions */}
      <div className="grid grid-cols-3 gap-2 -mt-1">
        {["🔒 Lock", "Details", "Limits"].map((action) => (
          <button
            key={action}
            className="bg-[#1c1c22] rounded-full py-2.5 text-white/80 text-sm font-medium hover:bg-[#252530] transition-colors"
          >
            {action}
          </button>
        ))}
      </div>

      {/* Savings Card */}
      <CardItem
        label="Savings Card"
        amount="₽890,300"
        cardNumber="5412  ••••  ••••  1098"
        expiry="03/28"
        network="Mastercard"
        gradient="linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)"
      />

      {/* Card Actions */}
      <div className="grid grid-cols-3 gap-2 -mt-1">
        {["🔒 Lock", "Details", "Limits"].map((action) => (
          <button
            key={action}
            className="bg-[#1c1c22] rounded-full py-2.5 text-white/80 text-sm font-medium hover:bg-[#252530] transition-colors"
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  )
}
