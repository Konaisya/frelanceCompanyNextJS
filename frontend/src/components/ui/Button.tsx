'use client'

import { ReactNode, MouseEvent } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  stopPropagation?: boolean
}

export default function Button({ 
  children, 
  onClick, 
  className = '', 
  disabled = false, 
  type = 'button',
  stopPropagation = false,
}: ButtonProps) {
  
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (stopPropagation) {
      e.stopPropagation()
    }
    if (onClick && !disabled) {
      onClick(e)
    }
  }

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`
        px-5 py-2 rounded-xl font-medium shadow-md
        bg-[var(--accent)] text-[var(--accent-text)]
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-1
        cursor-pointer
        ${disabled ? 'opacity-50 cursor-not-allowed hover:opacity-50' : 'hover:opacity-95 active:scale-[0.98]'}
        ${className}
      `}
    >
      {children}
    </button>
  )
}