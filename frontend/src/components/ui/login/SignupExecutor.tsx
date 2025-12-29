'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { authService } from '@/lib/api/authService'
import { ArrowLeft, User, Mail, Lock, Briefcase } from 'lucide-react'
import { SignupProps } from '@/types/auth.types'
import { useToast } from '../ToastProvider'
import { getErrorMessage } from './errormsg'

export default function SignupExecutor({ onBack, onSuccess }: SignupProps) {
  const { showToast } = useToast()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    skills: '',
    description: '',
  })
  const [loading, setLoading] = useState(false)
  const validate = () => {
  if (!form.name || !form.email || !form.password || !form.skills) {
    showToast({
      type: 'error',
      title: 'Не все поля заполнены',
      description: 'Имя, Email, пароль и навыки обязательны',
    })
    return false
  }

  if (form.password.length < 6) {
    showToast({
      type: 'error',
      title: 'Пароль слишком короткий',
    })
    return false
  }

  return true
}

  const handleChange = (field: keyof typeof form) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm({ ...form, [field]: e.target.value })
    }

  const submit = async () => {
  if (loading) return
  if (!validate()) return

  setLoading(true)
  try {
    await authService.signup({
      user: {
        name: form.name,
        email: form.email,
        password: form.password,
        role: 'EXECUTOR',
      },
      executor_profile: {
        id_specialization: 1,
        contacts: '',
        experience: 0,
        skills: form.skills,
        hourly_rate: 0,
        description: form.description,
      },
      customer_profile: null,
    })

    showToast({
      type: 'success',
      title: 'Аккаунт создан',
      description: 'Теперь вы можете войти',
    })

    onSuccess(form.email)
} catch (e: unknown) {
  showToast({
    type: 'error',
    title: 'Ошибка регистрации',
    description: getErrorMessage(e),
  })
  } finally {
    setLoading(false)
  }
}


  const inputs = [
    { id: 'name', placeholder: 'Имя', icon: User, type: 'text', value: form.name, onChange: handleChange('name') },
    { id: 'email', placeholder: 'Email', icon: Mail, type: 'email', value: form.email, onChange: handleChange('email') },
    { id: 'password', placeholder: 'Пароль', icon: Lock, type: 'password', value: form.password, onChange: handleChange('password') },
    { id: 'skills', placeholder: 'Навыки', icon: Briefcase, type: 'text', value: form.skills, onChange: handleChange('skills') },
  ]

  return (
    <motion.div 
      key="signup-executor-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full max-w-md mx-auto p-4"
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
            transition-colors
            hover:bg-[color-mix(in_srgb,var(--card)_90%,transparent)]
          "
        >
          <ArrowLeft className="w-4 h-4" />
          Назад к выбору
        </motion.button>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="mb-2"
        >
          <h1 className="text-xl font-semibold">
            Регистрация исполнителя
          </h1>
          <p className="text-sm">
            Создайте аккаунт, чтобы предлагать услуги
          </p>
        </motion.div>
      </div>

      <motion.div 
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        {inputs.map(({ id, placeholder, icon: Icon, type, value, onChange }, index) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + (index * 0.05), duration: 0.3 }}
            className="relative"
          >
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
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
                transition-all duration-200
              "
              placeholder={placeholder}
              type={type}
              value={value}
              onChange={onChange}
            />
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="relative"
        >
          <Briefcase className="absolute left-3 top-3 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <textarea
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
              resize-none h-24
            "
            placeholder="Описание"
            value={form.description}
            onChange={handleChange('description')}
          />

        </motion.div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.3 }}
        onClick={submit}
        disabled={loading}
        className="w-full mt-6 px-4 py-3 bg-[var(--accent)]
                 text-white font-medium rounded-xl
                 disabled:opacity-50 disabled:cursor-not-allowed
                 flex items-center justify-center gap-2
                 transition-all duration-200
                 hover:shadow-lg hover:-translate-y-0.5
                 active:translate-y-0 relative overflow-hidden group"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Регистрация...</span>
          </>
        ) : (
          <>
            <span>Зарегистрироваться</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                          -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </>
        )}
      </motion.button>
    </motion.div>
  )
}