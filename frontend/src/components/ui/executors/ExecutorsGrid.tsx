'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { ExecutorCard } from './ExecutorCard'

interface Executor {
  id: number
  name: string
  image: string
  rating?: number
  completed_projects?: number
  skills?: string[]
}

interface ExecutorsGridProps {
  executors: Executor[]
  loading: boolean
  onExecutorSelect: (executor: Executor) => void
}

function ExecutorCardSkeleton() {
  return (
    <div className="animate-pulse group relative overflow-hidden rounded-2xl bg-[var(--card)] border border-[color-mix(in_srgb,var(--text)_10%,transparent)] p-6">
      <div className="w-24 h-24 rounded-full bg-[color-mix(in_srgb,var(--text)_15%,transparent)] mb-4 mx-auto" />
      <div className="h-5 bg-[color-mix(in_srgb,var(--text)_15%,transparent)] rounded mb-2 w-3/4 mx-auto" />
      <div className="h-4 bg-[color-mix(in_srgb,var(--text)_10%,transparent)] rounded mb-2 w-1/2 mx-auto" />
      <div className="flex justify-center gap-2 mt-4">
        <div className="h-6 w-16 bg-[color-mix(in_srgb,var(--text)_15%,transparent)] rounded-full" />
        <div className="h-6 w-16 bg-[color-mix(in_srgb,var(--text)_15%,transparent)] rounded-full" />
      </div>
    </div>
  )
}

export default function ExecutorsGrid({ executors, loading, onExecutorSelect }: ExecutorsGridProps) {
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ExecutorCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <AnimatePresence>
        {executors.map((executor) => (
          <motion.div
            key={executor.id}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: 20 }}
          >
            <ExecutorCard executor={executor} onSelect={() => onExecutorSelect(executor)} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
