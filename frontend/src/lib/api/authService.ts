
import { SignupData } from '@/types/auth'
import { setToken, removeToken } from '../utils/token'
import api from './axios'

export const authService = {
  async signup(data: SignupData) {
    const res = await api.post('/auth/signup', data)
    return res.data
  },

  async login(data: { email: string; password: string }) {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    const res = await api.post("/auth/login", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    const token = res.data?.access_token || res.data?.token;
    if (token) setToken(token);
    return res.data;
  },

  logout() {
    removeToken();
  },
};