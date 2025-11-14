
import { SignupData, LoginData } from '@/types/auth'
import { setToken, removeToken } from '../utils/token'
import api from './axios'

export const authService = {
  async signup(data: SignupData) {
    const res = await api.post('/auth/signup', data)
    return res.data
  },

  async login(data: LoginData) {
    const res = await api.post('/auth/login', data)
    const token = res.data?.access_token || res.data?.token
    if (token) setToken(token)
    return res.data
  },

  logout() {
    removeToken()
  },
}
