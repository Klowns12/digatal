import { useState } from 'react'
import { Toast, ToastProps } from './toast'

type ToastOptions = Omit<ToastProps, 'onClose'>

export const toast = {
  success: (message: string, duration?: number) => {
    const event = new CustomEvent('toast', {
      detail: { message, type: 'success', duration }
    })
    window.dispatchEvent(event)
  },
  error: (message: string, duration?: number) => {
    const event = new CustomEvent('toast', {
      detail: { message, type: 'error', duration }
    })
    window.dispatchEvent(event)
  },
  warning: (message: string, duration?: number) => {
    const event = new CustomEvent('toast', {
      detail: { message, type: 'warning', duration }
    })
    window.dispatchEvent(event)
  },
  info: (message: string, duration?: number) => {
    const event = new CustomEvent('toast', {
      detail: { message, type: 'info', duration }
    })
    window.dispatchEvent(event)
  }
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastOptions[]>([])

  const showToast = (options: ToastOptions) => {
    setToasts(prev => [...prev, options])
  }

  const removeToast = (index: number) => {
    setToasts(prev => prev.filter((_, i) => i !== index))
  }

  return {
    toasts,
    showToast,
    removeToast,
    Toast
  }
}
