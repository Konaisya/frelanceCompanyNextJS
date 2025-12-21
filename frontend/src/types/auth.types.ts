export type AuthStep =
  | 'choose'
  | 'login'
  | 'signup_customer'
  | 'signup_executor'

export interface BackProps {
  onBack: () => void
}
