'use client'

import { useState } from 'react'
import { authService } from '@/lib/api/authService'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await authService.login(form)
      console.log('✅ Вход успешен:', res)
      alert('Вход выполнен!')
    } catch (e: any) {
      console.error('❌ Ошибка входа:', e.response?.data || e)
      setError('Неверный логин или пароль')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm bg-[var(--glass)] backdrop-blur-xl p-6 rounded-2xl shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-6">Вход в систему</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 rounded-lg bg-transparent border border-[var(--glass)]"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Пароль"
          className="w-full mb-4 p-2 rounded-lg bg-transparent border border-[var(--glass)]"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-2 bg-[var(--accent)] text-white rounded-xl hover:opacity-90 transition"
        >
          {loading ? 'Входим...' : 'Войти'}
        </button>
      </div>
    </div>
  )
}
