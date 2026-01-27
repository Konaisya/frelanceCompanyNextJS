'use client'

import { motion } from 'framer-motion'

export default function ServiceCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="
        relative overflow-hidden rounded-3xl
        bg-gradient-to-br from-[var(--glass)]/60 to-[var(--glass)]/30
        border border-white/10 backdrop-blur-xl
        p-6 flex flex-col justify-between
        shadow-[0_4px_20px_rgba(0,0,0,0.05)]
      "
    >
      <div className="flex items-center gap-4">
        <div className="w-[64px] h-[64px] rounded-full bg-white/10 animate-pulse" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-4 w-1/2 bg-white/10 rounded animate-pulse" />
          <div className="h-3 w-1/3 bg-white/10 rounded animate-pulse" />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <div className="h-3 w-full bg-white/10 rounded animate-pulse" />
        <div className="h-3 w-5/6 bg-white/10 rounded animate-pulse" />
        <div className="h-3 w-4/6 bg-white/10 rounded animate-pulse" />
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="h-5 w-16 bg-white/10 rounded animate-pulse" />
        <div className="h-10 w-24 bg-white/10 rounded-xl animate-pulse" />
      </div>
    </motion.div>
  )
}
