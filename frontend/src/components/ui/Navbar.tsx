'use client'

import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { useState } from 'react'
import Button from './Button'
import ThemeToggle from '../ThemeToggle'
import Link from 'next/link'

const navLinks = [
  { href: '/', label: 'Главная' },
  { href: '/services', label: 'Проекты' },
  { href: '#freelancers', label: 'Фрилансеры' },
  { href: '#contacts', label: 'Контакты' },
]

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
          whileHover={{ scale: 1.02 }}
          className="font-extrabold text-xl tracking-tight cursor-pointer select-none"
        >
          Freelance<span className="text-[var(--accent)]">Hub</span>
        </motion.div>

        <div className="flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-[var(--accent)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login"><Button className="hidden sm:block">Войти</Button></Link>
          <ThemeToggle />
        </div>
      </div>
    </motion.nav>
  )
}
