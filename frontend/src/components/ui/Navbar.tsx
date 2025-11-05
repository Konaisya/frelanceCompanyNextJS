'use client'

import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { useState } from 'react'
import Button from './Button'
import ThemeToggle from '../ThemeToggle'
import Link from 'next/link'

export default function Navbar() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 30)
  })

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`
        fixed top-0 left-0 right-0 z-50
        backdrop-blur-xl
        border-b transition-all duration-300
        ${scrolled ? 'bg-[var(--glass)] border-[var(--glass)] shadow-lg' : 'bg-transparent border-transparent'}
      `}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="font-extrabold text-xl tracking-tight cursor-pointer select-none"
        >
          Freelance<span className="text-[var(--accent)]">Hub</span>
        </motion.div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="#how" className="hover:text-[var(--accent)] transition-colors">Как это работает</Link>
          <Link href="#jobs" className="hover:text-[var(--accent)] transition-colors">Проекты</Link>
          <Link href="#freelancers" className="hover:text-[var(--accent)] transition-colors">Фрилансеры</Link>
          <Link href="#contacts" className="hover:text-[var(--accent)] transition-colors">Контакты</Link>
        </div>

        <div className="flex items-center gap-3">
          <Button className="hidden sm:block">Войти</Button>
          <ThemeToggle />
        </div>
      </div>
    </motion.nav>
  )
}
