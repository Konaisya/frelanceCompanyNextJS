'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import api from '@/lib/api/axios'

interface User {
  id: number
  name: string
  email: string
  role: string
  image?: string
}

interface AuthContextType {
  isAuth: boolean
  isLoading: boolean
  accessToken: string | null
  user: User | null
  login: (token: string) => void
  logout: () => void
  fetchUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const isAuth = !!accessToken

  const fetchUser = async () => {
    if (!accessToken) return
    
    try {
      const response = await api.get('/users/me', {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      setUser(response.data)
    } catch (error) {
      console.error('Failed to fetch user:', error)
      logout()
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      setAccessToken(token)
    }
    setIsLoading(false)
  }, [])


  useEffect(() => {
    if (accessToken) {
      fetchUser()
    }
  }, [accessToken])

  const login = (token: string) => {
    localStorage.setItem('access_token', token)
    setAccessToken(token)
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    setAccessToken(null)
    setUser(null)
  }

  return (
  <AuthContext.Provider
    value={{
      isAuth,
      isLoading,
      accessToken,
      user,
      login,
      logout,
      fetchUser
    }}
  >
    {children}
  </AuthContext.Provider>
  )
}