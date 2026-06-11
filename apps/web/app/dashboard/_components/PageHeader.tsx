"use client"

import { useRouter } from "next/navigation"
import { NavIcon } from "./nav-icon"

interface PageHeaderProps {
  title: string
  rightElement?: React.ReactNode
}

export function PageHeader({ title, rightElement }: PageHeaderProps) {
  const router = useRouter()

  return (
    <div className="flex items-center justify-between mb-6">
      <button
        onClick={() => router.back()}
        className="w-9 h-9 rounded-full bg-icon-bg flex items-center justify-center text-text-main hover:opacity-80 transition-opacity"
      >
        <NavIcon name="arrow-left" className="w-5 h-5" />
      </button>

      <h1 className="text-text-main font-semibold text-lg">{title}</h1>

      <div className="w-9 h-9 flex items-center justify-center">
        {rightElement ?? null}
      </div>
    </div>
  )
}
