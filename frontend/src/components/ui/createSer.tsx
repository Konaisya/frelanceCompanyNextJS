'use client'

import { useState } from 'react'
import { useAuth } from '@/components/ui/login/AuthProvider'

interface ServiceFormData {
  name: string
  description: string
  id_specialization: string
  price: string
  delivery_time: string
}

export default function CreateServiceForm() {
  const { accessToken, user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    description: '',
    id_specialization: '',
    price: '',
    delivery_time: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user?.id) {
      setError('Необходимо авторизоваться')
      return
    }
    
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('http://127.0.0.1:8000/api/services/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          id_specialization: parseInt(formData.id_specialization),
          id_user_executor: user.id,
          price: parseFloat(formData.price),
          delivery_time: parseInt(formData.delivery_time)
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Ошибка при создании сервиса')
      }

      setSuccess(true)
      setFormData({
        name: '',
        description: '',
        id_specialization: '',
        price: '',
        delivery_time: ''
      })
      
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-[var(--card)] rounded-xl shadow-lg mt-18">
      <h2 className="text-2xl font-bold mb-6 text-[var(--text)]">Создать новый сервис</h2>
      
      {success && (
        <div className="mb-4 p-3 bg-green-500/10 text-green-500 rounded-lg">
          ✅ Сервис успешно создан!
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 text-red-500 rounded-lg">
          ❌ {error}
        </div>
      )}
      
      {!user && (
        <div className="mb-4 p-3 bg-yellow-500/10 text-yellow-500 rounded-lg">
          ⚠️ Для создания сервиса необходимо авторизоваться
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--muted)] mb-1">
            Название сервиса *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-[var(--input)] border border-[color-mix(in_srgb,var(--text)_15%,transparent)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
            placeholder="Введите название сервиса"
            disabled={!user}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[var(--muted)] mb-1">
            Описание *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-2 bg-[var(--input)] border border-[color-mix(in_srgb,var(--text)_15%,transparent)] rounded-lg focus:outline-none focus:border-[var(--accent)] resize-none"
            placeholder="Опишите ваш сервис подробно"
            disabled={!user}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[var(--muted)] mb-1">
            ID специализации *
          </label>
          <input
            type="number"
            name="id_specialization"
            value={formData.id_specialization}
            onChange={handleChange}
            required
            min="1"
            className="w-full px-4 py-2 bg-[var(--input)] border border-[color-mix(in_srgb,var(--text)_15%,transparent)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
            placeholder="Введите ID специализации"
            disabled={!user}
          />
          <p className="text-xs text-[var(--muted)] mt-1">
            ID специализации из справочника (например, 1 - Веб-разработка, 2 - Дизайн)
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--muted)] mb-1">
              Цена (₽) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-2 bg-[var(--input)] border border-[color-mix(in_srgb,var(--text)_15%,transparent)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
              placeholder="1000"
              disabled={!user}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--muted)] mb-1">
              Срок выполнения (дней) *
            </label>
            <input
              type="number"
              name="delivery_time"
              value={formData.delivery_time}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-4 py-2 bg-[var(--input)] border border-[color-mix(in_srgb,var(--text)_15%,transparent)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
              placeholder="7"
              disabled={!user}
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading || !user}
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            loading || !user
              ? 'bg-[color-mix(in_srgb,var(--text)_20%,transparent)] text-[var(--muted)] cursor-not-allowed'
              : 'bg-[var(--accent)] text-[var(--accent-text)] hover:bg-[var(--accent)]/90'
          }`}
        >
          {loading ? 'Создание...' : user ? 'Создать сервис' : 'Необходима авторизация'}
        </button>
      </form>
    </div>
  )
}