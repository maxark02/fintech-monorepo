import type { ReactNode } from 'react'

type CardProps = {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-[#1c1c22] rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  )
}
