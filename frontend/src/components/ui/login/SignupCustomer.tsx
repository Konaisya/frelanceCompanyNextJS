'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { authService } from '@/lib/api/authService'
import { BackProps } from '@/types/auth.types'
import { ArrowLeft, User, Mail, Lock, Building, Phone } from 'lucide-react'
import { SignupProps } from '@/types/auth.types'

export default function SignupCustomer({ onBack, onSuccess }: SignupProps) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
    contacts: '',
  })

  const [loading, setLoading] = useState(false)

 const submit = async () => {
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

    onSuccess(form.email)
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
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full max-w-sm mx-auto p-4"
    >
      <div className="mb-6">
        <motion.button 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          onClick={onBack} 
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-4 transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5"
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
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Регистрация заказчика
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
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
            transition={{ delay: 0.3 + (index * 0.05), duration: 0.3 }}
            className="relative"
          >
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              className="w-full pl-10 pr-3 py-3 text-sm bg-white/60 dark:bg-white/5 backdrop-blur-sm 
                       border border-gray-200 dark:border-white/10 rounded-xl 
                       focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
                       placeholder:text-gray-400 dark:placeholder:text-gray-500
                       text-gray-900 dark:text-white
                       transition-all duration-200"
              placeholder={placeholder}
              type={type}
              value={value}
              onChange={onChange}
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
        className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700
                 text-white font-medium rounded-xl
                 disabled:opacity-50 disabled:cursor-not-allowed
                 flex items-center justify-center gap-2
                 transition-all duration-200
                 hover:shadow-lg hover:-translate-y-0.5
                 active:translate-y-0
                 relative overflow-hidden group"
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