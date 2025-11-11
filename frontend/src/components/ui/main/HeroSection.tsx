'use client'

import { motion } from 'framer-motion'
import Button from '../Button'

export default function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center px-6 h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--accent)]/10 via-transparent to-transparent blur-3xl"></div>
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
      >
        Свобода работать <br /> <span className="text-[var(--accent)]">на себя</span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-lg md:text-xl text-muted max-w-2xl mb-12"
      >
        FreelanceHub — место, где заказчики находят лучших специалистов, а фрилансеры получают достойные проекты.  
        Без посредников. Без лишнего шума.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="flex gap-4 flex-wrap justify-center"
      >
        <Button>Найти заказы</Button>
        <Button className="bg-transparent border border-[var(--accent)] text-[var(--accent)] hover:opacity-80">
          Стать исполнителем
        </Button>
      </motion.div>
    </section>
  )
}
