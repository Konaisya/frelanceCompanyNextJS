'use client'

import { motion } from 'framer-motion'

export default function ExecutorsHero() {
  return (
    <div className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Наши <span className="text-[var(--accent)]">Фрилансеры</span>
          </h1>
          <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto">
            Топовые специалисты в различных областях. Выбирайте проверенных исполнителей для ваших проектов
          </p>
        </motion.div>
      </div>
    </div>
  )
}