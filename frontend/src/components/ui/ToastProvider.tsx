'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

interface Toast {
  id: string
  title: string
  description?: string
  type?: 'success' | 'error' | 'info'
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within a ToastProvider')
  return context
}

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const showToast = (toast: Omit<Toast, 'id'>) => {
    const id = crypto.randomUUID()

    setToasts(prev => {
      const newToasts = [...prev, { ...toast, id }]
      if (newToasts.length > 3) {
        const oldestId = newToasts[0].id
        setTimeout(() => removeToast(oldestId), 300)
        return newToasts.slice(1)
      }
      return newToasts
    })

    setTimeout(() => removeToast(id), 5000)
  }

  const typeColors = {
    success: ['#4ade80', '#22c55e'],
    error: ['#f87171', '#ef4444'],   
    info: ['#60a5fa', '#3b82f6'],    
  }

  const typeIcons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast, index) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  type: 'spring',
                  stiffness: 500,
                  damping: 30,
                  delay: index * 0.05,
                },
              }}
              exit={{
                opacity: 0,
                x: 100,
                scale: 0.9,
                transition: { duration: 0.2, ease: 'easeIn' },
              }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, info) => {
                if (Math.abs(info.offset.x) > 100) removeToast(toast.id)
              }}
              className={`
                relative w-80 p-4 rounded-lg shadow-2xl border
                backdrop-blur-xl bg-white/10 border-white/10
                cursor-pointer select-none pointer-events-auto
                overflow-hidden group
              `}
            >
              <motion.div
                className="absolute top-0 left-0 h-1.5 rounded-t-2xl"
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 5, ease: 'linear' }}
                style={{
                  background: `linear-gradient(to right, ${typeColors[toast.type || 'info'][0]}, ${typeColors[toast.type || 'info'][1]})`,
                  boxShadow: `0 0 6px ${typeColors[toast.type || 'info'][1]}80`,

                }}
              />

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm">
                  <span className="font-bold text-sm">{typeIcons[toast.type || 'info']}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold  text-sm truncate">{toast.title}</h4>
                  {toast.description && (
                    <p className="text-sm mt-1 line-clamp-2">{toast.description}</p>
                  )}
                </div>

                <button
                  onClick={() => removeToast(toast.id)}
                  className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
