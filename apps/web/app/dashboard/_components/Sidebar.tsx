"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { navItems } from "./nav-items"
import { NavIcon } from "./nav-icon"

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-white/10 px-3 py-6 gap-1 bg-[#0f0f13]">
      <div className="px-3 mb-6">
        <span className="text-white font-bold text-lg tracking-tight">FinApp</span>
      </div>

      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
              ${isActive
                ? "bg-[#3b5bdb]/20 text-[#3b5bdb]"
                : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
          >
            <NavIcon name={item.icon} className="w-5 h-5 shrink-0" />
            {item.label}
          </Link>
        )
      })}
    </aside>
  )
}
