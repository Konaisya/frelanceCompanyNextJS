'use client'
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
  useRef,
  useMemo
} from 'react'
import { useAuth } from '@/components/ui/login/AuthProvider'
import { useToast } from '../ToastProvider'

interface Message {
  id: number
  sender_id: number
  recipient_id: number
  order_id?: number | null
  message: string
  created_at: string
  is_read: boolean
  sender_name?: string
  sender_image?: string
}

interface Chat {
  userId: number
  userName: string
  userImage?: string
  lastMessage?: string
  lastMessageTime?: string
  unreadCount: number
  isOnline: boolean
}

interface ChatContextType {
  messages: Message[]
  chats: Chat[]
  activeChats: number[]
  sendMessage: (recipientId: number, message: string, orderId?: number) => Promise<boolean>
  unreadCount: number
  isConnected: boolean
  currentChatUserId: number | null
  openChat: (userId: number, userName?: string, userImage?: string) => void
  closeChat: (userId: number) => void
  closeAllChats: () => void
  toggleChat: (userId: number, userName?: string, userImage?: string) => void
  markAsRead: (userId: number) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const { accessToken, user } = useAuth()
  const socketRef = useRef<WebSocket | null>(null)
  const { showToast } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [chats, setChats] = useState<Chat[]>([])
  const [activeChats, setActiveChats] = useState<number[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [currentChatUserId, setCurrentChatUserId] = useState<number | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)

  const calculatedUnreadCount = useMemo(() => {
    return chats.reduce((sum, c) => sum + c.unreadCount, 0)
  }, [chats])

  useEffect(() => {
    setUnreadCount(calculatedUnreadCount)
  }, [calculatedUnreadCount])

  const usersCache = useRef<Record<number, { name: string; image?: string }>>({})

  const loadUser = useCallback(
    async (userId: number) => {
      if (usersCache.current[userId]) return usersCache.current[userId]
      if (!accessToken) return null

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
        if (!res.ok) return null

        const data = await res.json()
        usersCache.current[userId] = {
          name: data.name,
          image: data.image
        }
        return usersCache.current[userId]
      } catch {
        return null
      }
    },
    [accessToken]
  )

  const markAsRead = useCallback(
    (userId: number) => {
      setMessages(prev =>
        prev.map(m =>
          m.sender_id === userId && m.recipient_id === user?.id
            ? { ...m, is_read: true }
            : m
        )
      )

      setChats(prev =>
        prev.map(c =>
          c.userId === userId ? { ...c, unreadCount: 0 } : c
        )
      )
    },
    [user?.id]
  )

  const sendMessage = useCallback(
    async (recipientId: number, message: string, orderId?: number) => {
      if (recipientId === user?.id) {
        showToast({
          title: 'Нельзя написать самому себе',
          description: 'Выберите другого пользователя для общения',
          type: 'error',
        })
        return false
      }

      const ws = socketRef.current
      if (!ws || ws.readyState !== WebSocket.OPEN || !message.trim()) {
        return false
      }

      ws.send(
        JSON.stringify({
          type: 'message',
          recipient_id: recipientId,
          message: message.trim(),
          order_id: orderId ?? null
        })
      )

      return true
    },
    [user?.id, showToast]
  )

  const openChat = useCallback(
    (userId: number, userName?: string, userImage?: string) => {
      setCurrentChatUserId(userId)
      setActiveChats(prev => (prev.includes(userId) ? prev : [...prev, userId]))
      markAsRead(userId)

      setChats(prev => {
        if (prev.some(c => c.userId === userId)) return prev
        if (!userName) return prev

        return [
          ...prev,
          {
            userId,
            userName,
            userImage,
            unreadCount: 0,
            isOnline: true
          }
        ]
      })
    },
    [markAsRead]
  )

  const closeChat = useCallback((userId: number) => {
    setActiveChats(prev => prev.filter(id => id !== userId))
    setCurrentChatUserId(prev => (prev === userId ? null : prev))
  }, [])

  const closeAllChats = useCallback(() => {
    setActiveChats([])
    setCurrentChatUserId(null)
  }, [])

  const toggleChat = useCallback(
    (userId: number, userName?: string, userImage?: string) => {
      if (activeChats.includes(userId)) {
        closeChat(userId)
      } else {
        openChat(userId, userName, userImage)
      }
    },
    [activeChats, closeChat, openChat]
  )

  useEffect(() => {
    if (!user?.id) return

    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_API_WS}${user.id}`)
    socketRef.current = ws

    const handleOpen = () => setIsConnected(true)
    const handleClose = () => setIsConnected(false)

    const handleMessage = async (event: MessageEvent) => {
      const data = JSON.parse(event.data)
      if (data.type !== 'message') return

      const newMessage: Message = {
        id: data.id,
        sender_id: data.sender_id,
        recipient_id: data.recipient_id,
        order_id: data.order_id,
        message: data.message,
        created_at: data.created_at,
        is_read: data.recipient_id !== user.id
      }

      setMessages(prev => [...prev, newMessage])

      const chatUserId =
        data.sender_id === user.id ? data.recipient_id : data.sender_id

      let userData =
        data.sender_id === user.id ? data.recipient : data.sender

      if (!userData?.name) {
        userData = await loadUser(chatUserId)
      }

      if (!userData?.name) return

      setChats(prev => {
        const exists = prev.find(c => c.userId === chatUserId)

        if (exists) {
          return prev.map(c =>
            c.userId === chatUserId
              ? {
                  ...c,
                  userName: c.userName || userData.name,
                  userImage: c.userImage || userData.image,
                  lastMessage: data.message,
                  lastMessageTime: data.created_at,
                  unreadCount:
                    data.recipient_id === user.id
                      ? c.unreadCount + 1
                      : c.unreadCount,
                  isOnline: true
                }
              : c
          )
        }

        return [
          ...prev,
          {
            userId: chatUserId,
            userName: userData.name,
            userImage: userData.image,
            lastMessage: data.message,
            lastMessageTime: data.created_at,
            unreadCount: data.recipient_id === user.id ? 1 : 0,
            isOnline: true
          }
        ]
      })
    }

    ws.addEventListener('open', handleOpen)
    ws.addEventListener('close', handleClose)
    ws.addEventListener('message', handleMessage)

    return () => {
      ws.removeEventListener('open', handleOpen)
      ws.removeEventListener('close', handleClose)
      ws.removeEventListener('message', handleMessage)
      ws.close()
    }
  }, [user?.id, loadUser]) // Только эти зависимости

  const filteredMessages = useMemo(() => {
    if (!currentChatUserId || !user?.id) return []
    
    return messages
      .filter(
        m =>
          (m.sender_id === currentChatUserId &&
            m.recipient_id === user.id) ||
          (m.recipient_id === currentChatUserId &&
            m.sender_id === user.id)
      )
      .sort(
        (a, b) =>
          new Date(a.created_at).getTime() -
          new Date(b.created_at).getTime()
      )
  }, [messages, currentChatUserId, user?.id])

  const contextValue = useMemo(() => ({
    messages: filteredMessages,
    chats,
    activeChats,
    sendMessage,
    unreadCount,
    isConnected,
    currentChatUserId,
    openChat,
    closeChat,
    closeAllChats,
    toggleChat,
    markAsRead
  }), [
    filteredMessages,
    chats,
    activeChats,
    sendMessage,
    unreadCount,
    isConnected,
    currentChatUserId,
    openChat,
    closeChat,
    closeAllChats,
    toggleChat,
    markAsRead
  ])

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChat must be used within ChatProvider')
  return ctx
}