"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { navItems } from "./nav-items"
import { NavIcon } from "./nav-icon"

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1c1c22] border-t border-white/5 flex items-center justify-around px-2 py-3 z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-colors
              ${isActive ? "text-[#3b5bdb]" : "text-white/40 hover:text-white/70"}`}
          >
            <NavIcon name={item.icon} className="w-6 h-6" />
            <span className={`text-[10px] font-medium ${isActive ? "text-white" : ""}`}>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
