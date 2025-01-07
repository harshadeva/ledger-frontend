import type { AxiosError } from 'axios'

// Define the MenuItem type
export type MenuItem = {
  to: string // Route path
  name: string // Menu item name
  icon?: string
}

interface ServerError {
  error?: string | { error_message?: string; message?: string } | Record<string, string>
}

export type AxiosErrorWithData = AxiosError<{ error?: ServerError; message?: string }>
export type ErrorMessages = Record<string, string>
