'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { authService } from '@/lib/api/authService'
import { ArrowLeft, User, Mail, Lock, Briefcase, Eye, EyeOff } from 'lucide-react'
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
  const [showPassword, setShowPassword] = useState(false)
  
  const validatePassword = (password: string): boolean => {
    if (password.length < 8) {
      return false
    }
    
    const uppercaseCount = (password.match(/[A-ZА-Я]/g) || []).length
    const digitCount = (password.match(/\d/g) || []).length
    
    return uppercaseCount >= 2 && digitCount >= 3
  }

  const validate = () => {
    if (!form.name || !form.email || !form.password || !form.skills) {
      showToast({
        type: 'error',
        title: 'Не все поля заполнены',
        description: 'Имя, Email, пароль и навыки обязательны',
      })
      return false
    }

    if (!validatePassword(form.password)) {
      showToast({
        type: 'error',
        title: 'Пароль не соответствует требованиям',
        description: 'Пароль должен содержать минимум 8 символов и хотя бы 2 заглавные буквы',
      })
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      showToast({
        type: 'error',
        title: 'Неверный формат email',
      })
      return false
    }

    return true
  }

  const handleChange = (field: keyof typeof form) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm({ ...form, [field]: e.target.value })
    }

 const getPasswordStrength = (password: string): { strength: number; message: string } => {
  let strength = 0
  let message = ''

  if (password.length >= 8) strength += 1
  if (password.length >= 12) strength += 1
  
  const uppercaseCount = (password.match(/[A-ZА-Я]/g) || []).length
  if (uppercaseCount >= 1) strength += 1
  if (uppercaseCount >= 2) strength += 1
  
  const lowercaseCount = (password.match(/[a-zа-я]/g) || []).length
  if (lowercaseCount >= 1) strength += 1
  
  const numbersCount = (password.match(/\d/g) || []).length
  if (numbersCount >= 1) strength += 1
  if (numbersCount >= 3) strength += 1
  
  const specialCount = (password.match(/[^A-Za-zА-Яа-я0-9]/g) || []).length
  if (specialCount >= 1) strength += 1

  if (strength >= 7) message = 'Сильный пароль'
  else if (strength >= 5) message = 'Средний пароль'
  else if (strength >= 3) message = 'Слабый пароль'
  else message = 'Очень слабый пароль'

  return { strength, message }
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

  const passwordStrength = getPasswordStrength(form.password)
  const passwordStrengthColors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-emerald-500',
  ]

  const inputs = [
    { id: 'name', placeholder: 'Имя', icon: User, type: 'text', value: form.name, onChange: handleChange('name') },
    { id: 'email', placeholder: 'Email', icon: Mail, type: 'email', value: form.email, onChange: handleChange('email') },
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
          transition={{ delay: 0.45, duration: 0.3 }}
          className="relative"
        >
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            className="
              w-full pl-10 pr-10 py-3 text-sm
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
            placeholder="Пароль (минимум 8 символов, 2 заглавные буквы, 3 цифры)"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </motion.div>

        {form.password && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted">Сложность пароля:</span>
              <span className={`font-medium ${
                passwordStrength.strength >= 4 ? 'text-green-500' :
                passwordStrength.strength >= 2 ? 'text-yellow-500' :
                'text-red-500'
              }`}>
                {passwordStrength.message}
              </span>
            </div>
            
            <div className="h-1 w-full bg-[color-mix(in_srgb,var(--text)_10%,transparent)] rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  passwordStrengthColors[Math.min(passwordStrength.strength, passwordStrengthColors.length - 1)]
                }`}
                style={{ width: `${Math.min((passwordStrength.strength / 6) * 100, 100)}%` }}
              />
            </div>

          <div className="grid grid-cols-2 gap-1 text-xs text-muted">
            <div className={`flex items-center gap-1 ${form.password.length >= 8 ? 'text-green-500' : ''}`}>
              <div className={`w-1 h-1 rounded-full ${form.password.length >= 8 ? 'bg-green-500' : 'bg-current'}`} />
              ≥ 8 символов
            </div>
            <div className={`flex items-center gap-1 ${((form.password.match(/[A-ZА-Я]/g) || []).length >= 2) ? 'text-green-500' : ''}`}>
              <div className={`w-1 h-1 rounded-full ${((form.password.match(/[A-ZА-Я]/g) || []).length >= 2) ? 'bg-green-500' : 'bg-current'}`} />
              ≥ 2 заглавных букв
            </div>
            <div className={`flex items-center gap-1 ${(form.password.match(/[a-zа-я]/g) || []).length >= 1 ? 'text-green-500' : ''}`}>
              <div className={`w-1 h-1 rounded-full ${(form.password.match(/[a-zа-я]/g) || []).length >= 1 ? 'bg-green-500' : 'bg-current'}`} />
              ≥ 1 строчной буквы
            </div>
            <div className={`flex items-center gap-1 ${(form.password.match(/\d/g) || []).length >= 3 ? 'text-green-500' : ''}`}>
              <div className={`w-1 h-1 rounded-full ${(form.password.match(/\d/g) || []).length >= 3 ? 'bg-green-500' : 'bg-current'}`} />
              ≥ 3 цифры
            </div>
          </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="relative"
        >
          <Briefcase className="absolute left-3 top-3 w-4 h-4 text-muted" />
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