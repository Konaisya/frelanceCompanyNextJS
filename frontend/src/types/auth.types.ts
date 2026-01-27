export type AuthStep =
  | 'choose'
  | 'login'
  | 'signup_customer'
  | 'signup_executor'

export interface BackProps {
  onBack: () => void
}

export interface SignupProps extends BackProps {
  onSuccess: (email: string) => void
}

export interface LoginProps extends BackProps {
  defaultEmail?: string
}
