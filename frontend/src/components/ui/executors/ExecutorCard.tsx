'use client'

import { motion } from 'framer-motion';
import { Star, Briefcase, ChevronRight } from 'lucide-react';

interface Executor {
  id: number
  name: string
  image: string
  rating?: number
  completed_projects?: number
  skills?: string[]
}

export function ExecutorCard({ executor, onSelect }: { executor: Executor; onSelect: () => void }) {
  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group relative overflow-hidden rounded-2xl bg-[var(--card)] border border-[color-mix(in_srgb,var(--text)_10%,transparent)] p-6 text-left transition-all duration-300 hover:shadow-xl hover:border-[var(--accent)]/30"
    >
      <div className="relative flex flex-col items-center">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-[var(--card)] ring-offset-2 ring-offset-[var(--bg)] shadow-lg">
            <img
              src={`http://127.0.0.1:8000/${executor.image}`}
              alt={executor.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <div className="absolute -bottom-2 right-4 bg-gradient-to-r from-[var(--accent)] to-purple-500 text-white rounded-full px-3 py-1 text-xs font-bold shadow-lg">
            PRO
          </div>
        </div>

        <h3 className="text-lg font-bold mb-2 text-[var(--text)]">{executor.name}</h3>

        <div className="flex items-center gap-4 mb-4 text-[var(--text)]">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold">{executor.rating?.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Briefcase className="w-4 h-4 text-[var(--muted)]" />
            <span className="text-sm text-[var(--muted)]">{executor.completed_projects}+</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {executor.skills?.map((skill, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] text-[var(--accent)] rounded-full text-xs font-medium"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 text-[var(--accent)] font-medium text-sm group-hover:gap-3 transition-all">
          <span>Посмотреть услуги</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.button>
  )
}
