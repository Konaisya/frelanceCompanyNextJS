'use client'

import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="mt-auto py-12 px-6 border-t border-[var(--glass)] bg-[var(--card)]/30 backdrop-blur-lg"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <div>
          <h2 className="text-2xl font-bold mb-3">Freelance<span className="text-[var(--accent)]">Hub</span></h2>
          <p className="text-muted text-sm">
            Платформа, где талантливые фрилансеры находят работу, а клиенты — идеальных исполнителей.
          </p>
        </div>


        <div>
          <h3 className="font-semibold mb-3">Навигация</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#features" className="hover:text-[var(--accent)]">О платформе</a></li>
            <li><a href="#jobs" className="hover:text-[var(--accent)]">Проекты</a></li>
            <li><a href="#freelancers" className="hover:text-[var(--accent)]">Фрилансеры</a></li>
          </ul>
        </div>


        <div>
          <h3 className="font-semibold mb-3">Контакты</h3>
          <p className="text-sm text-muted">support@freelancehub.com</p>
          <div className="flex justify-center md:justify-start gap-3 mt-3">
            <a href="#" className="hover:text-[var(--accent)]">🐦</a>
            <a href="#" className="hover:text-[var(--accent)]">💼</a>
            <a href="#" className="hover:text-[var(--accent)]">📸</a>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-muted mt-10">
        © {new Date().getFullYear()} FreelanceHub. Все права защищены.
      </p>
    </motion.footer>
  )
}
