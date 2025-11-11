'use client'

import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
}

export default function Button({ children, onClick, className = '', disabled = false }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-5 py-2 rounded-xl font-medium shadow-md
        bg-[var(--accent)] text-[var(--accent-text)]
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-1
        cursor-pointer
        ${disabled ? 'opacity-50 cursor-not-allowed hover:opacity-50' : 'hover:opacity-95'}
        ${className}
      `}
    >
      {children}
    </button>
  )
}