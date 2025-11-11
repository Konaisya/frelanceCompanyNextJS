'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Modal from '../Modal'


const features = [
  {
    title: 'Гарантия безопасности',
    desc: 'Мы используем безопасные сделки и защищённые платежи, чтобы вы были уверены в результате.',
    icon: '🛡',
  },
  {
    title: 'Умный поиск',
    desc: 'Продвинутая фильтрация и алгоритмы подбора для нахождения идеального исполнителя или проекта.',
    icon: '🤖',
  },
  {
    title: 'Сообщество профессионалов',
    desc: 'Будьте частью растущего сообщества талантливых фрилансеров и клиентов.',
    icon: '🌍',
  },
]

export default function FeaturesSection() {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <section id="features" className="relative py-32 px-6 overflow-hidden">
      <motion.h3
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-5xl md:text-6xl font-extrabold text-center mb-16 relative z-10"
      >
        Почему выбирают <span className="text-[var(--accent)]">FreelanceHub</span>
      </motion.h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto relative z-10">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.03 }}
            onClick={() => setSelected(i)}
            className="card group relative overflow-hidden p-12 rounded-2xl border border-[var(--glass)] 
                       bg-[var(--card)]/50 backdrop-blur-xl shadow-xl cursor-pointer flex flex-col items-center justify-center"
          >
            <div className="text-6xl mb-5">{f.icon}</div>
            <h4 className="text-xl font-semibold mb-2">{f.title}</h4>
            <p className="text-muted text-sm text-center">Нажмите, чтобы узнать больше</p>
          </motion.div>
        ))}
      </div>

      {selected !== null && (
        <Modal open={selected !== null} onClose={() => setSelected(null)}>
          <div className="flex flex-col items-center text-center">
            <div className="text-7xl mb-4">{features[selected].icon}</div>
            <h4 className="text-2xl font-bold mb-2">{features[selected].title}</h4>
            <p className="text-muted mb-6">{features[selected].desc}</p>
          </div>
        </Modal>
      )}
    </section>
  )
}
