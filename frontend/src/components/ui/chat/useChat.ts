'use client'

import { useChat as useChatContext } from './ChatProvider'

export function useChat() {
  return useChatContext()
}