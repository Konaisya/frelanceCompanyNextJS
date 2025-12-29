'use client'

import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import Button from './Button'
import ThemeToggle from '../ThemeToggle'
import Link from 'next/link'
import Image from 'next/image'
import { LogOut, User, Menu, X, MessageSquare, Bell } from 'lucide-react'
import { useAuth } from '@/components/ui/login/AuthProvider'
import axios from 'axios'
import ChatWindow from './chat/ChatWindow'
import NotificationBell from './NotificationBell'
import { useChat } from './chat/useChat'


const navLinks = [
  { href: '/', label: 'Главная' },
  { href: '/services', label: 'Проекты' },
  { href: '/executors', label: 'Фрилансеры' },
  { href: '#contacts', label: 'Контакты' },
]

export default function Navbar() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const mobileMenuRef = useRef<HTMLDivElement | null>(null)

  const { isAuth, logout, accessToken, user } = useAuth()
  const { unreadCount } = useChat()
  const [userData, setUserData] = useState<{ name: string; image: string } | null>(null)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 30)
  })

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (!isAuth || !accessToken) return

    const fetchUser = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/users/me', {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        setUserData({ name: res.data.name, image: res.data.image })
      } catch (err) {
        console.error('Failed to fetch user', err)
      }
    }

    fetchUser()
  }, [isAuth, accessToken])

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`
          fixed top-0 left-0 right-0 z-50
          backdrop-blur-xl
          border-b transition-all duration-300
          ${scrolled
            ? 'bg-[var(--glass)] border-[var(--glass)] shadow-lg'
            : 'bg-transparent border-transparent'}
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-[color-mix(in_srgb,var(--text)_10%,transparent)]"
              aria-label="Открыть меню"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link href="/">
              <div className="font-extrabold text-xl tracking-tight">
                Freelance<span className="text-[var(--accent)]">Hub</span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-[var(--accent)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 relative" ref={menuRef}>
            {!isAuth ? (
              <>
                <Link href="/login">
                  <Button className="hidden sm:block">Войти</Button>
                </Link>
                <ThemeToggle />
              </>
            ) : (
              <>
                {/* Кнопка уведомлений */}
                <NotificationBell />
                
                {/* Кнопка чата */}
                <button
                  onClick={() => setShowChat(!showChat)}
                  className="relative p-2 rounded-lg hover:bg-[color-mix(in_srgb,var(--text)_10%,transparent)] transition-colors"
                  aria-label="Чаты"
                >
                  <MessageSquare className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 px-1 text-xs font-bold bg-red-500 text-white rounded-full">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>
                
                <button
                  onClick={() => setMenuOpen(v => !v)}
                  className="w-9 h-9 rounded-full overflow-hidden bg-[var(--accent)] flex items-center justify-center hover:scale-105 transition"
                >
                  {userData?.image ? (
                    <Image
                      src={`http://127.0.0.1:8000/${userData.image}`}
                      alt="Avatar"
                      width={36}
                      height={36}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </button>

                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-12 w-48 rounded-xl border bg-[var(--card)] border-[color-mix(in_srgb,var(--text)_10%,transparent)] shadow-xl overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-[color-mix(in_srgb,var(--text)_10%,transparent)]">
                      <span className="font-medium">{userData?.name || user?.name}</span>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 hover:bg-black/5"
                    >
                      <User className="w-4 h-4" />
                      Профиль
                    </Link>

                    <div className="px-4 py-3 flex items-center justify-between">
                      <span className="text-sm">Тема</span>
                      <ThemeToggle />
                    </div>

                    <button
                      onClick={() => {
                        logout()
                        setMenuOpen(false)
                      }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-red-500 hover:bg-red-500/10"
                    >
                      <LogOut className="w-4 h-4" />
                      Выйти
                    </button>
                  </motion.div>
                )}
                
                <ThemeToggle />
              </>
            )}
          </div>
        </div>
      </motion.nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          <motion.div
            ref={mobileMenuRef}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="absolute top-0 left-0 bottom-0 w-64 bg-[var(--card)] border-r border-[color-mix(in_srgb,var(--text)_10%,transparent)] shadow-2xl"
          >
            <div className="p-6 border-b border-[color-mix(in_srgb,var(--text)_10%,transparent)] flex items-center justify-between">
              <div className="font-extrabold text-xl tracking-tight">
                Freelance<span className="text-[var(--accent)]">Hub</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-[color-mix(in_srgb,var(--text)_10%,transparent)]"
                aria-label="Закрыть меню"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-lg hover:bg-[color-mix(in_srgb,var(--text)_10%,transparent)] hover:text-[var(--accent)] transition-colors font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {!isAuth ? (
                <div className="mt-8 pt-6 border-t border-[color-mix(in_srgb,var(--text)_10%,transparent)]">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button className="w-full">Войти</Button>
                  </Link>
                </div>
              ) : (
                <>
                  <div className="mt-6 pt-6 border-t border-[color-mix(in_srgb,var(--text)_10%,transparent)]">
                    <div className="px-4 mb-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-[var(--accent)] flex items-center justify-center">
                        {userData?.image ? (
                          <Image
                            src={`http://127.0.0.1:8000/${userData.image}`}
                            alt="Avatar"
                            width={40}
                            height={40}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <User className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <span className="font-medium">{userData?.name || user?.name}</span>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-[color-mix(in_srgb,var(--text)_10%,transparent)] mb-1"
                    >
                      <User className="w-4 h-4" />
                      Профиль
                    </Link>
                    
                    <button
                      onClick={() => {
                        setShowChat(true)
                        setMobileMenuOpen(false)
                      }}
                      className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-[color-mix(in_srgb,var(--text)_10%,transparent)] mb-1 w-full"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Чаты
                      {unreadCount > 0 && (
                        <span className="ml-auto flex items-center justify-center min-w-5 h-5 px-1 text-xs font-bold bg-red-500 text-white rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[color-mix(in_srgb,var(--text)_10%,transparent)]">
                    <div className="flex items-center justify-between px-4 py-3">
                      <span className="text-sm font-medium">Тема</span>
                      <ThemeToggle />
                    </div>
                    
                    <button
                      onClick={() => {
                        logout()
                        setMobileMenuOpen(false)
                      }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-lg mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Выйти
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
      
      {isAuth && showChat && <ChatWindow onClose={() => setShowChat(false)} />}
    </>
  )
}