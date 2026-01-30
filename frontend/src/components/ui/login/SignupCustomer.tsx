'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { authService } from '@/lib/api/authService'
import { ArrowLeft, User, Mail, Lock, Building, Phone } from 'lucide-react'
import { SignupProps } from '@/types/auth.types'
import { useToast } from '../ToastProvider'
import { getErrorMessage } from './errormsg'

export default function SignupCustomer({ onBack, onSuccess }: SignupProps) {
  const { showToast } = useToast()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
    contacts: '',
  })

  const [loading, setLoading] = useState(false)


    const validate = () => {
    if (!form.name || !form.email || !form.password) {
      showToast({
        type: 'error',
        title: 'Заполните обязательные поля',
        description: 'Имя, Email и пароль обязательны',
      })
      return false
    }

    if (!form.email.includes('@')) {
      showToast({
        type: 'error',
        title: 'Некорректный email',
        description: 'Проверьте адрес электронной почты',
      })
      return false
    }

    if (form.password.length < 6) {
      showToast({
        type: 'error',
        title: 'Слишком короткий пароль',
        description: 'Минимум 6 символов',
      })
      return false
    }

    return true
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
          role: 'CUSTOMER',
        },
        customer_profile: {
          company: form.company,
          contacts: form.contacts,
        },
        executor_profile: null,
      })

      showToast({
        type: 'success',
        title: 'Регистрация успешна',
        description: 'Теперь вы можете войти в свой аккаунт',
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


  const handleChange = (field: keyof typeof form) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [field]: e.target.value })
    }

  const inputs = [
    {
      id: 'name',
      placeholder: 'Имя',
      icon: User,
      type: 'text',
      value: form.name,
      onChange: handleChange('name')
    },
    {
      id: 'email',
      placeholder: 'Email',
      icon: Mail,
      type: 'email',
      value: form.email,
      onChange: handleChange('email')
    },
    {
      id: 'password',
      placeholder: 'Пароль',
      icon: Lock,
      type: 'password',
      value: form.password,
      onChange: handleChange('password')
    },
    {
      id: 'company',
      placeholder: 'Компания',
      icon: Building,
      type: 'text',
      value: form.company,
      onChange: handleChange('company')
    },
    {
      id: 'contacts',
      placeholder: 'Контакты (телефон, Telegram)',
      icon: Phone,
      type: 'text',
      value: form.contacts,
      onChange: handleChange('contacts')
    },
  ]

  return (
    <motion.div
      key="signup-customer-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
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
          <h1 className="text-xl font-semibold">Регистрация заказчика</h1>
          <p className="text-sm text-muted">
            Создайте аккаунт для размещения заказов
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
            transition={{ delay: 0.3 + index * 0.05, duration: 0.3 }}
            className="relative"
          >
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type={type}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
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
            />
          </motion.div>
        ))}
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.3 }}
        onClick={submit}
        disabled={loading}
        className="
          w-full mt-6 px-4 py-3
          bg-[var(--accent)]
          text-white
          font-medium rounded-xl
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200
          hover:shadow-lg
          hover:-translate-y-0.5
          active:translate-y-0
        "
      >
        {loading ? 'Регистрация…' : 'Зарегистрироваться'}
      </motion.button>
    </motion.div>
  )
}