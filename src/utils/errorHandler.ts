import { message } from 'ant-design-vue'
import type { AxiosError } from 'axios'

/**
 * Handles Axios errors or shows a default error message.
 * @param error - The Axios error object
 * @param defaultMessage - A fallback message to display
 */
export const handleAxiosError = (
  error: AxiosError,
  defaultMessage = 'Something went wrong. Please try again.',
) => {
  console.error(error)
  // Check for validation errors or specific server errors
  if (error?.response?.data?.error) {
    const serverError = error.response.data.error

    if (typeof serverError === 'string') {
      message.error(serverError)
    } else if (serverError?.error_message) {
      message.error(serverError.error_message)
    } else if (serverError?.message) {
      message.error(serverError.message)
    } else {
      message.error(defaultMessage)
    }
  } else {
    // If no specific error message is provided, show the default message
    message.error(defaultMessage)
  }
}

export const handleFormErrors = (
  error: AxiosError,
  errorMessages,
  resetFunction = () => {
    // Reset error messages first
    Object.keys(errorMessages).forEach((key) => {
      errorMessages[key as keyof typeof errorMessages] = ''
    })
  },
) => {
  resetFunction()
  // Check for validation errors
  if (error?.response && error?.response?.data && error?.response?.data?.error) {
    const validationErrors = error.response.data.error
    for (const field in validationErrors) {
      errorMessages[field as keyof typeof errorMessages] = validationErrors[field]
    }
  }
  // Check for generic error message
  if (error?.response && error?.response?.data && error?.response?.data?.error?.error_message) {
    message.error(error?.response?.data?.error?.error_message)
  }
}

export const resetFormErrors = <T extends Record<string, string>>(errorMessages: T): void => {
  Object.keys(errorMessages).forEach((key) => {
    errorMessages[key as keyof T] = '' as T[keyof T] // Assert the type for write access  , Reset each value to an empty string
  })
}
