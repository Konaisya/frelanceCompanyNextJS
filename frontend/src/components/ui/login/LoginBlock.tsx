'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { authService } from '@/lib/api/authService'
import { panelAnim } from './panelAnim'
import { BackProps } from '@/types/auth.types'
import { ArrowLeft, Mail, Lock } from 'lucide-react'

export default function LoginBlock({ onBack }: BackProps) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async () => {
    setLoading(true)
    setError('')
    try {
      await authService.login({
        email: form.email.trim(),
        password: form.password,
      })
      alert('Вход выполнен!')
    } catch (e: any) {
      if (e.response?.status === 422) {
        setError('Неверный email или пароль')
      } else {
        setError('Произошла ошибка')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div {...panelAnim} className="w-full max-w-sm mx-auto p-4">
      <div className="mb-6">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="
            flex items-center gap-2 text-sm
            text-muted hover:text-text
            mb-4 p-2 rounded-lg
            transition-colors
            hover:bg-[color-mix(in_srgb,var(--card)_90%,transparent)]
          "
        >
          <ArrowLeft className="w-4 h-4" />
          Назад
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-xl font-semibold">Вход</h1>
          <p className="text-sm text-muted">
            Войдите в существующий аккаунт
          </p>
        </motion.div>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            className="
              w-full pl-10 pr-3 py-3 text-sm
              bg-[var(--glass)] backdrop-blur-sm
              border border-[color-mix(in_srgb,var(--text)_12%,transparent)]
              rounded-xl
              focus:outline-none
              focus:ring-2 focus:ring-[var(--accent)]/30
              focus:border-[var(--accent)]
              placeholder:text-muted
              text-text
              transition-all
            "
            placeholder="Email"
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="password"
            className="
              w-full pl-10 pr-3 py-3 text-sm
              bg-[var(--glass)] backdrop-blur-sm
              border border-[color-mix(in_srgb,var(--text)_12%,transparent)]
              rounded-xl
              focus:outline-none
              focus:ring-2 focus:ring-[var(--accent)]/30
              focus:border-[var(--accent)]
              placeholder:text-muted
              text-text
              transition-all
            "
            placeholder="Пароль"
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-3">{error}</p>
      )}

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onClick={submit}
        disabled={loading}
        className="
          w-full mt-6 px-4 py-3
          bg-[var(--accent)]
          text-[var(--accent-text)]
          font-medium rounded-xl
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all
          hover:shadow-lg
          hover:-translate-y-0.5
          active:translate-y-0
        "
      >
        {loading ? 'Входим…' : 'Войти'}
      </motion.button>
    </motion.div>
  )
}
