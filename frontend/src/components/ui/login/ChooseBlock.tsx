'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { panelAnim } from './panelAnim'
import { AuthStep } from '@/types/auth.types'
import { User, Briefcase, Search, ArrowRight } from 'lucide-react'

interface Props {
  onSelect: (step: AuthStep) => void
}

export default function ChooseBlock({ onSelect }: Props) {
  const options = [
    {
      id: 'login' as AuthStep,
      title: 'Вход',
      subtitle: 'Уже есть аккаунт',
      icon: <User className="w-5 h-5" />,
      color: 'var(--accent)',
      delay: 0.1,
    },
    {
      id: 'signup_customer' as AuthStep,
      title: 'Я заказчик',
      subtitle: 'Найти исполнителя',
      icon: <Search className="w-5 h-5" />,
      color: '#10b981',
      delay: 0.2,
    },
    {
      id: 'signup_executor' as AuthStep,
      title: 'Я исполнитель',
      subtitle: 'Предлагать услуги',
      icon: <Briefcase className="w-5 h-5" />,
      color: '#8b5cf6',
      delay: 0.3,
    },
  ]

  return (
    <motion.div {...panelAnim} className="w-full max-w-sm mx-auto p-4">
      <div className="text-center mb-6">
        <motion.h1
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-2xl font-semibold mb-2"
        >
          Добро пожаловать
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-muted"
        >
          Выберите тип аккаунта
        </motion.p>
      </div>

      <div className="space-y-3">
        {options.map((option) => (
          <motion.button
            key={option.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: option.delay }}
            onClick={() => onSelect(option.id)}
            style={{ '--choice-color': option.color } as React.CSSProperties}
            className="
              group relative w-full rounded-2xl p-4 text-left
              bg-[var(--glass)] backdrop-blur-xl
              border border-[color:color-mix(in_srgb,var(--text)_10%,transparent)]
              transition-all duration-200
              overflow-hidden
            "
          >
            <span
              className="
                absolute left-0 top-0 h-full w-[3px]
                bg-[var(--choice-color)]
                opacity-70
                transition-all
                group-hover:w-1 group-hover:opacity-100
              "
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: `color-mix(in srgb, ${option.color} 15%, transparent)`,
                    color: option.color,
                  }}
                >
                  {option.icon}
                </div>

                <div>
                  <div className="font-medium">{option.title}</div>
                  <div className="text-xs text-muted">{option.subtitle}</div>
                </div>
              </div>

              <ArrowRight
                className="
                  w-4 h-4
                  text-muted
                  transition-all
                  group-hover:text-[var(--choice-color)]
                  group-hover:translate-x-1
                "
              />
            </div>
          </motion.button>
        ))}
      </div>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[color:color-mix(in_srgb,var(--text)_15%,transparent)]" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 text-xs text-muted bg-[var(--bg)]">
            или
          </span>
        </div>
      </div>


      <Link href="/services" className="text-[var(--accent)] hover:underline">
      <button
        onClick={() => onSelect('login')}
        className="
          w-full py-3 text-sm rounded-xl
          border border-dashed
          border-[color:color-mix(in_srgb,var(--text)_20%,transparent)]
          text-muted
          transition
          hover:text-text
          hover:border-[color:color-mix(in_srgb,var(--text)_35%,transparent)]
        "
      >
        Продолжить как гость
      </button>
      </Link>
    </motion.div>
  )
}
