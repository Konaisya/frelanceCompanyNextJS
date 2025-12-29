export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message

  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error
  ) {
    const response = (error as { response?: { data?: { message?: string } } }).response
    if (response?.data?.message) return response.data.message
  }

  return 'Попробуйте позже'
}