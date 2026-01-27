'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ExecutorCard } from './ExecutorCard'
import { Executor } from '@/types/executor'

interface ExecutorsGridProps {
  executors: Executor[]
  loading: boolean
  onExecutorSelect: (executor: Executor) => void
}

function ExecutorCardSkeleton() {
  return (
    <div className="animate-pulse group relative overflow-hidden rounded-2xl bg-[var(--card)] border border-[color-mix(in_srgb,var(--text)_10%,transparent)] p-4 sm:p-6">
      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-[color-mix(in_srgb,var(--text)_15%,transparent)] mb-3 sm:mb-4 mx-auto" />
      <div className="h-4 sm:h-5 bg-[color-mix(in_srgb,var(--text)_15%,transparent)] rounded mb-1 sm:mb-2 w-3/4 mx-auto" />
      <div className="h-3 sm:h-4 bg-[color-mix(in_srgb,var(--text)_10%,transparent)] rounded mb-2 sm:mb-3 w-1/2 mx-auto" />
      <div className="flex justify-center gap-1 sm:gap-2 mt-3 sm:mt-4">
        <div className="h-5 sm:h-6 w-12 sm:w-16 bg-[color-mix(in_srgb,var(--text)_15%,transparent)] rounded-full" />
        <div className="h-5 sm:h-6 w-12 sm:w-16 bg-[color-mix(in_srgb,var(--text)_15%,transparent)] rounded-full" />
      </div>
    </div>
  )
}

export default function ExecutorsGrid({ executors, loading, onExecutorSelect }: ExecutorsGridProps) {
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.05 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ExecutorCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (executors.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <div className="text-[var(--muted)] text-sm sm:text-base">
          Исполнители не найдены
        </div>
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
    >
      <AnimatePresence>
        {executors.map((executor) => (
          <motion.div
            key={executor.id}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: 10 }}
            className="w-full"
          >
            <ExecutorCard executor={executor} onSelect={() => onExecutorSelect(executor)} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}