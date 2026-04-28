import type { ReactNode } from 'react'

type CardProps = {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-black rounded-2xl p-6 shadow-sm border border-gray-100 ${className}`}>
      {children}
    </div>
  )
}
