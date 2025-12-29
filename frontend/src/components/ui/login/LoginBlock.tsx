'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { authService } from '@/lib/api/authService'
import { ArrowLeft, Mail, Lock } from 'lucide-react'
import axios from 'axios'
import { LoginProps } from '@/types/auth.types'
import { useAuth } from '@/components/ui/login/AuthProvider'
import { useRouter } from 'next/navigation'


export default function LoginBlock({ onBack, defaultEmail }: LoginProps) {
  const [form, setForm] = useState({
    email: defaultEmail ?? '',
    password: '',
  })
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
    const router = useRouter()
  
  useEffect(() => {
    if (defaultEmail) {
      setForm((f) => ({ ...f, email: defaultEmail }))
    }
  }, [defaultEmail])

const submit = async () => {
  if (loading) return

  setLoading(true)
  setError('')

  try {
    const res = await authService.login({
      email: form.email.trim(),
      password: form.password,
    })
    await login(res.access_token)
    router.push('/profile')

  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      if (e.response?.status === 422) {
        setError('Неверный email или пароль')
      } else {
        setError('Произошла ошибка')
      }
    } else {
      setError('Произошла ошибка')
    }
  } finally {
    setLoading(false)
  }
}


  return (
    <motion.div
      key="login-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full max-w-sm mx-auto p-4"
    >
      <div className="mb-6">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          onClick={onBack}
          className="
            flex items-center gap-2 text-sm
            text-muted hover:text-text
            mb-4 p-2 rounded-lg
            transition-colors duration-200
            hover:bg-[color-mix(in_srgb,var(--card)_90%,transparent)]
          "
        >
          <ArrowLeft className="w-4 h-4" />
          Назад
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <h1 className="text-xl font-semibold">Вход</h1>
          <p className="text-sm text-muted">
            Войдите в существующий аккаунт
          </p>
        </motion.div>
      </div>

      <motion.div 
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <motion.input
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.3 }}
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
              transition-all duration-200
            "
            placeholder="Email"
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <motion.input
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
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
              transition-all duration-200
            "
            placeholder="Пароль"
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
        </div>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-red-500 text-sm mt-3 overflow-hidden"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        onClick={submit}
        disabled={loading}
        className="
          w-full mt-6 px-4 py-3
          bg-[var(--accent)]
          text-[var(--accent-text)]
          font-medium rounded-xl
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200
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