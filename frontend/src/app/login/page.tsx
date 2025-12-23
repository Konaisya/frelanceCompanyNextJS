'use client'

import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import ChooseBlock from '@/components/ui/login/ChooseBlock'
import LoginBlock from '@/components/ui/login/LoginBlock'
import SignupCustomer from '@/components/ui/login/SignupCustomer'
import SignupExecutor from '@/components/ui/login/SignupExecutor'
import { AuthStep } from '@/types/auth.types'

export default function AuthPage() {
  const [step, setStep] = useState<AuthStep>('choose')
  const [loginEmail, setLoginEmail] = useState<string>('')

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className=" relative w-full max-w-md bg-gradient-to-br from-[var(--glass)]/80 to-[var(--glass)]/40 
      backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)] overflow-hidden " >
        <AnimatePresence mode="wait">
          {step === 'choose' && (
            <ChooseBlock key="choose" onSelect={setStep} />
          )}

          {step === 'login' && (
            <LoginBlock
              key="login"
              onBack={() => setStep('choose')}
              defaultEmail={loginEmail}
            />
          )}

          {step === 'signup_customer' && (
            <SignupCustomer
              key="customer"
              onBack={() => setStep('choose')}
              onSuccess={(email) => {
                setLoginEmail(email)
                setStep('login')
              }}
            />
          )}

          {step === 'signup_executor' && (
            <SignupExecutor
              key="executor"
              onBack={() => setStep('choose')}
              onSuccess={(email) => {
                setLoginEmail(email)
                setStep('login')
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
