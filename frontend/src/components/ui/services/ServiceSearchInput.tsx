'use client'

import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'

interface Props {
  value: string
  onChange: (value: string) => void
}

export default function ServiceSearchInput({ value, onChange }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="
        relative w-full max-w-3xl mx-auto mb-10
        bg-gradient-to-br from-[var(--glass)]/70 to-[var(--glass)]/40
        backdrop-blur-2xl
        border border-white/10
        rounded-3xl
        shadow-[0_4px_20px_rgba(0,0,0,0.05)]
      "
    >

      <div className="absolute left-5 top-1/2 -translate-y-1/2 opacity-60">
        <Search size={20} />
      </div>


      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Поиск услуг…"
        className="
          w-full
          bg-transparent
          py-4 pl-14 pr-14
          text-sm
          outline-none
          placeholder:opacity-60
        "
      />


      {value && (
        <button
          onClick={() => onChange('')}
          className="
            absolute right-5 top-1/2 -translate-y-1/2
            opacity-60 hover:opacity-100 transition
          "
        >
          <X size={18} />
        </button>
      )}
    </motion.div>
  )
}
