'use client'

import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Переключить тему"
      className="relative w-12 h-6 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center px-0.5 cursor-pointer"
    >
      <motion.div
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white dark:bg-gray-900 shadow flex items-center justify-center text-[10px]"
        animate={{ x: isDark ? 24 : 0 }}
        transition={{ type: 'spring', stiffness: 700, damping: 30 }}
      >
        {isDark ? '🌙' : '☀️'}
      </motion.div>
    </button>
  )
}