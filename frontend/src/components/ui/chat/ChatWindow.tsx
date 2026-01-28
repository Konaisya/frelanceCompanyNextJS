'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, User, ChevronLeft, ChevronRight, MessageSquare, Maximize2, Minimize2 } from 'lucide-react'
import { useChat } from './ChatProvider'
import { useAuth } from '../login/AuthProvider'
import Image from 'next/image'


interface ChatWindowProps {
  onClose: () => void
}

export default function ChatWindow({ onClose }: ChatWindowProps) {
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showChatList, setShowChatList] = useState(true)
  const { user } = useAuth()
  
  const { 
    sendMessage, 
    messages, 
    isConnected, 
    currentChatUserId,
    chats,
    toggleChat,
    closeAllChats,
    markAsRead
  } = useChat()
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const currentChat = chats.find(chat => chat.userId === currentChatUserId)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (currentChatUserId) {
      inputRef.current?.focus()
      markAsRead(currentChatUserId)
    }
  }, [currentChatUserId, markAsRead])

  const handleSend = async () => {
    if (!message.trim() || !currentChatUserId) return

    setIsLoading(true)
    const success = await sendMessage(currentChatUserId, message)
    setIsLoading(false)

    if (success) setMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed bottom-4 right-4 ${
        isExpanded 
          ? 'w-[800px] h-[600px]' 
          : showChatList 
            ? 'w-[700px] h-[500px]'
            : 'w-96 h-[500px]'
      } bg-[var(--card)] rounded-xl shadow-2xl z-50 flex flex-col border border-[color-mix(in_srgb,var(--text)_10%,transparent)] transition-all duration-300`}
    >

      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowChatList(!showChatList)}
            className="p-2 hover:bg-[color-mix(in_srgb,var(--text)_10%,transparent)] rounded-lg"
          >
            {showChatList ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
          
          {currentChat ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-[var(--accent)]">
                {currentChat.userImage ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${currentChat.userImage}`}
                    alt={currentChat.userName}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-white m-auto" />
                )}
              </div>
              <div>
                <h3 className="font-semibold">{currentChat.userName}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className={isConnected ? 'text-green-500' : 'text-red-500'}>
                    {isConnected ? 'Онлайн' : 'Офлайн'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6" />
              <h3 className="font-semibold">Чаты</h3>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-[color-mix(in_srgb,var(--text)_10%,transparent)] rounded-lg"
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-[color-mix(in_srgb,var(--text)_10%,transparent)] rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <AnimatePresence>
          {showChatList && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 250 }}
              exit={{ width: 0 }}
              className="border-r border-[color-mix(in_srgb,var(--text)_10%,transparent)] flex flex-col"
            >
              <div className="p-3 border-b border-[color-mix(in_srgb,var(--text)_10%,transparent)]">
                <input
                  type="text"
                  placeholder="Поиск чатов..."
                  className="w-full px-3 py-2 bg-[color-mix(in_srgb,var(--text)_5%,transparent)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {chats.length === 0 ? (
                  <div className="p-6 text-center text-[var(--muted)]">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Нет активных чатов</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[color-mix(in_srgb,var(--text)_5%,transparent)]">
                    {chats.map(chat => (
                      <div
                        key={chat.userId}
                        className={`p-3 hover:bg-[color-mix(in_srgb,var(--text)_5%,transparent)] cursor-pointer transition-colors ${
                          currentChatUserId === chat.userId ? 'bg-[color-mix(in_srgb,var(--accent)_10%,transparent)]' : ''
                        }`}
                        onClick={() =>
                          toggleChat(chat.userId, chat.userName, chat.userImage)
                        }

                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center overflow-hidden">
                              {chat.userImage ? (
                                  <Image
                                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${chat.userImage}`}
                                    alt={chat.userName}
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-cover"
                                  />

                              ) : (
                                <div className="w-6 h-6 text-white font-semibold">
                                  {chat.userName.charAt(0)}
                                </div>
                              )}
                            </div>
                            {chat.unreadCount > 0 && (
                              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-4 h-4 text-xs font-bold bg-red-500 text-white rounded-full px-1">
                                {chat.unreadCount}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium truncate">{chat.userName}</span>
                              {chat.lastMessageTime && (
                                <span className="text-xs text-[var(--muted)]">
                                  {formatTime(chat.lastMessageTime)}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-[var(--muted)] truncate">{chat.lastMessage || 'Нет сообщений'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {chats.length > 0 && (
                <button
                  onClick={closeAllChats}
                  className="m-3 p-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  Закрыть все чаты
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 flex flex-col">
          {currentChatUserId ? (
            <>
              <div className="flex-1 overflow-y-auto p-4">
                {messages.length === 0 ? (
                  <div className="text-center py-8 text-[var(--muted)]">
                    Нет сообщений. Начните общение!
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isOwn = msg.sender_id === user?.id
                    return (
                      <div key={`${msg.id}-${msg.created_at}-${msg.sender_id}`}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
                        <div className={`max-w-[70%] rounded-xl p-3 ${
                          isOwn
                            ? 'bg-[var(--accent)] text-[var(--accent-text)] rounded-tr-none'
                            : 'bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] rounded-tl-none'
                        }`}>
                          <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                          <div className={`text-xs mt-1 ${isOwn ? 'text-[var(--accent-text)]/80' : 'text-[var(--muted)]'}`}>
                            {formatTime(msg.created_at)}
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <textarea
                    ref={inputRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Напишите сообщение..."
                    disabled={isLoading || !isConnected}
                    className="flex-1 w-full p-3 bg-[color-mix(in_srgb,var(--card)_95%,var(--accent))] border border-[color-mix(in_srgb,var(--text)_15%,transparent)] rounded-lg resize-none focus:outline-none focus:border-[var(--accent)] disabled:opacity-50"
                    rows={2}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!message.trim() || isLoading || !isConnected}
                    className={`p-3 rounded-lg transition-colors ${
                      message.trim() && !isLoading && isConnected
                        ? 'bg-[var(--accent)] text-[var(--accent-text)] hover:bg-[var(--accent)]/90'
                        : 'bg-[color-mix(in_srgb,var(--text)_20%,transparent)] text-[var(--muted)] cursor-not-allowed'
                    }`}
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {!isConnected && <p className="text-xs text-red-500 mt-2">Нет подключения к чату</p>}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-[var(--muted)]">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Выберите чат для общения</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}