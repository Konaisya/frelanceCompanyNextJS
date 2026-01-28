'use client'
import { useState, useRef, useEffect } from 'react'
import { Bell, MessageSquare, Check, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChat } from './chat/ChatProvider'
import Link from 'next/link'
import { useAuth } from '@/components/ui/login/AuthProvider'
import Image from 'next/image'

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { unreadCount, chats, markAsRead } = useChat()
  const { isAuth } = useAuth()

  useEffect(() => {
    if (!isAuth) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () =>
      document.removeEventListener('mousedown', handleClickOutside)
  }, [isAuth])

  if (!isAuth) return null

  const handleNotificationClick = (userId: number) => {
    markAsRead(userId)
    setIsOpen(false)
  }

  const unreadChats = chats.filter(chat => chat.unreadCount > 0)

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-[color-mix(in_srgb,var(--text)_10%,transparent)] transition-colors"
        aria-label="Уведомления"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 px-1 text-xs font-bold bg-red-500 text-white rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-12 w-80 max-h-96 overflow-y-auto bg-[var(--card)] border border-[color-mix(in_srgb,var(--text)_10%,transparent)] rounded-xl shadow-2xl z-50"
          >
            <div className="p-4 border-b border-[color-mix(in_srgb,var(--text)_10%,transparent)] flex items-center justify-between">
              <h3 className="font-semibold">Уведомления</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-[color-mix(in_srgb,var(--text)_10%,transparent)] rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {unreadChats.length === 0 ? (
              <div className="p-8 text-center text-[var(--muted)]">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Нет новых уведомлений</p>
              </div>
            ) : (
              <div className="divide-y divide-[color-mix(in_srgb,var(--text)_10%,transparent)]">
                {unreadChats.map(chat => (
                  <div
                    key={chat.userId}
                    className="p-4 hover:bg-[color-mix(in_srgb,var(--text)_5%,transparent)] transition-colors cursor-pointer group"
                    onClick={() => handleNotificationClick(chat.userId)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center overflow-hidden">
                          {chat.userImage ? (
                            <Image
                              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${chat.userImage}`}
                              alt={chat.userName}
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-6 h-6 text-white font-semibold">
                              {chat.userName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[var(--card)]" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold truncate">{chat.userName}</span>
                          <span className="text-xs text-[var(--muted)]">
                            {chat.lastMessageTime && new Date(chat.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--muted)] line-clamp-2">{chat.lastMessage}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs px-2 py-0.5 bg-red-500 text-white rounded-full">
                            {chat.unreadCount} новое сообщение
                          </span>
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[color-mix(in_srgb,var(--text)_10%,transparent)] rounded">
                            <Check className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="p-3 border-t border-[color-mix(in_srgb,var(--text)_10%,transparent)] bg-[color-mix(in_srgb,var(--text)_3%,transparent)]">
              <Link 
                href="/chats"
                className="text-sm text-[var(--accent)] hover:underline text-center block"
                onClick={() => setIsOpen(false)}
              >
                Показать все чаты
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}