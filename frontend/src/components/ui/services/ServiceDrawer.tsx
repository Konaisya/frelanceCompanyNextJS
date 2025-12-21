'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  open: boolean
  onClose: () => void
  children?: React.ReactNode
}

export default function ServiceDrawer({ open, onClose, children }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 70, damping: 18 }}
            className="
              fixed top-0 right-0 h-full w-full sm:w-[450px] 
              bg-[var(--glass)]/90 backdrop-blur-2xl 
              border-l border-white/10
              z-100 p-6
            "
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-lg opacity-70 hover:opacity-100"
            >
              ✕
            </button>

            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
