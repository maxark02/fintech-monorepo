"use client";
import { NavIcon } from "../_components/nav-icon";
import { BalanceCard } from "../../../features/balance";
import Link from "next/link";

const weeklyData = [
  { day: "Mon", value: 4300 },
  { day: "Tue", value: 2700 },
  { day: "Wed", value: 0 },
  { day: "Thu", value: 5800 },
  { day: "Fri", value: 2500 },
  { day: "Sat", value: 6300 },
  { day: "Sun", value: 8300 },
];

function WeeklyBarChart() {
  const maxY = 10000;
  const chartWidth = 280;
  const chartHeight = 120;
  const barWidth = 22;
  const gap =
    (chartWidth - weeklyData.length * barWidth) / (weeklyData.length + 1);
  const yLabels = [0, 25000, 50000, 75000, 100000];

  return (
    <div className="flex gap-2">
      {/* Y-axis labels */}
      <div
        className="flex flex-col justify-between items-end"
        style={{ height: chartHeight + 20 }}
      >
        {[...yLabels].reverse().map((label) => (
          <span key={label} className="text-[9px] text-white/40 leading-none">
            {label === 0 ? "0" : label >= 1000 ? `${label / 1000}k` : label}
          </span>
        ))}
      </div>

      {/* SVG Chart */}
      <div className="flex-1 overflow-hidden">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight + 24}`}
          className="w-full"
          style={{ height: chartHeight + 24 }}
        >
          {/* Dashed grid lines */}
          {yLabels.map((label) => {
            const y = chartHeight - (label / maxY) * chartHeight;
            return (
              <line
                key={label}
                x1={0}
                y1={y}
                x2={chartWidth}
                y2={y}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Bars */}
          {weeklyData.map((d, i) => {
            const x = gap + i * (barWidth + gap);
            const barHeight = (d.value / maxY) * chartHeight;
            const y = chartHeight - barHeight;

            return (
              <g key={d.day}>
                {d.value > 0 && (
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    rx={4}
                    fill="#5b9cf6"
                  />
                )}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight + 14}
                  textAnchor="middle"
                  fontSize={9}
                  fill="rgba(255,255,255,0.4)"
                >
                  {d.day}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export default function BalancePage() {
  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#3b5bdb] flex items-center justify-center text-white font-bold text-sm">
            <Link href="/dashboard/profile">M</Link>
          </div>
          <Link href="/dashboard/profile">
            <div>
              <p className="text-white/50 text-xs">Welcome back,</p>
              <p className="text-white font-bold text-sm">Maksim Arkhipov</p>
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative w-9 h-9 rounded-full bg-[#1c1c22] flex items-center justify-center text-white">
            <NavIcon name="bell" className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <Link href="/dashboard/settings">
            {" "}
            <button className="w-9 h-9 rounded-full bg-[#1c1c22] flex items-center justify-center text-white">
              <NavIcon name="settings" className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </div>

      {/* Balance Card */}
      <BalanceCard />

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center gap-2">
          <button className="w-30 h-14 rounded-2xl bg-[#3d1515] flex items-center justify-center">
            <NavIcon name="arrow-up-right" className="w-6 h-6 text-red-500" />
          </button>
          <span className="text-white/70 text-xs">Send</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <button className="w-30 h-14 rounded-2xl bg-[#0f2d18] flex items-center justify-center">
            <NavIcon
              name="arrow-down-left"
              className="w-6 h-6 text-green-500"
            />
          </button>
          <span className="text-white/70 text-xs">Request</span>
        </div>

        <Link href="/dashboard/cards">
          <div className="flex flex-col items-center gap-2">
            <button className="w-30 h-14 rounded-2xl bg-[#0f1a35] flex items-center justify-center">
              <NavIcon name="card" className="w-6 h-6 text-blue-400" />
            </button>
            <span className="text-white/70 text-xs">Cards</span>
          </div>
        </Link>
      </div>

      {/* Weekly Spending Card */}
      <div className="bg-[#1c1c22] rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-white font-semibold">Weekly Spending</span>
          <span className="text-white/50 text-sm">Total:</span>
        </div>
        <WeeklyBarChart />
      </div>
    </div>
  );
}
