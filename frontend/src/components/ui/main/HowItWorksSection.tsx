'use client'

import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'

const steps = [
  {
    icon: '🧩',
    title: 'Создай заказ или профиль',
    desc: 'Начни с простого — оформи задачу или расскажи о себе как о специалисте.',
  },
  {
    icon: '💬',
    title: 'Общайся напрямую',
    desc: 'Без посредников и комиссий — просто обсуди детали и начни работу.',
  },
  {
    icon: '🚀',
    title: 'Заверши и получи оплату',
    desc: 'Система безопасных сделок гарантирует, что всё пройдёт честно.',
  },
]

export default function HowItWorksSection() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const bubbleBg =
    theme === 'dark' ? 'rgba(255,111,97,0.08)' : 'rgba(37,99,235,0.08)'
  const shadowColor =
    theme === 'dark' ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)'

  return (
    <section
      id="how-it-works"
      className="relative py-20 px-6 flex flex-col items-center text-center overflow-hidden"
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-5xl md:text-6xl font-extrabold mb-28"
      >
        Как это <span className="text-[var(--accent)]">работает</span>
      </motion.h2>

      <div className="relative flex flex-col items-start gap-32 max-w-4xl mx-auto">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            className={`flex items-center md:items-start gap-8 md:gap-16 w-full ${
              i % 2 === 0 ? 'flex-row' : 'flex-row-reverse self-end'
            }`}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: i * 0.2 }}
            viewport={{ once: true }}
            style={{ marginTop: i === 0 ? 0 : -40 }}
          >
            <div className="relative flex flex-col items-center justify-center">
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: 'easeInOut',
                }}
                className="relative flex items-center justify-center w-28 h-28 rounded-full backdrop-blur-xl"
                style={{
                  background: bubbleBg,
                }}
              >
                <motion.span
                  className="text-4xl md:text-5xl"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  {step.icon}
                </motion.span>
              </motion.div>

              <motion.div
                className="absolute bottom-[-20px] rounded-full"
                style={{
                  width: '70%',
                  height: '10px',
                  background: `radial-gradient(ellipse at center, ${shadowColor} 0%, transparent 70%)`,
                  filter: 'blur(8px)',
                }}
                animate={{
                  scaleX: [1.2, 0.8, 1.2],
                  opacity: [0.6, 0.2, 0.6],
                  y: [0, 5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: 'easeInOut',
                }}
              />
            </div>
            <motion.div
              initial={{ opacity: 0, x: i % 2 === 0 ? 60 : -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.2 }}
              viewport={{ once: true }}
              className="max-w-sm text-left"
            >
              <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted text-base leading-relaxed">{step.desc}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
