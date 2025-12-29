'use client'

import { useState } from 'react'
import { MessageSquare } from 'lucide-react'
import { useAuth } from '@/components/ui/login/AuthProvider'
import { useChat } from './useChat'
import ChatWindow from './ChatWindow'

interface ChatButtonProps {
  executorId: number
  executorName: string
  executorImage: string
  orderId?: number
}

export default function ChatButton({ 
  executorId, 
  executorName, 
  executorImage,
  orderId 
}: ChatButtonProps) {
  const { isAuth } = useAuth()
  const { openChat, currentChatUserId } = useChat()
  const [isChatOpen, setIsChatOpen] = useState(false)

  const handleClick = () => {
    if (!isAuth) {
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname)
      return
    }
    
    openChat(executorId, executorName, executorImage)
    setIsChatOpen(true)
  }

  const handleCloseChat = () => {
    setIsChatOpen(false)
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="flex-1 bg-[var(--accent)] text-[var(--accent-text)] font-medium py-3 rounded-lg hover:bg-[var(--accent)]/90 transition-colors flex items-center justify-center gap-2 relative"
      >
        <MessageSquare className="w-5 h-5" />
        <span>Написать сообщение</span>
      </button>

      {isChatOpen && currentChatUserId === executorId && (
        <ChatWindow
          onClose={handleCloseChat}
        />
      )}
    </>
  )
}