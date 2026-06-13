import { create } from 'zustand'

let _id = 0

export const useNotificationStore = create((set) => ({
  toasts: [],

  addToast: ({ message, type = 'info', duration = 4000 }) => {
    const id = ++_id
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, duration)
  },

  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

export const toast = {
  success: (message) => useNotificationStore.getState().addToast({ message, type: 'success' }),
  error:   (message) => useNotificationStore.getState().addToast({ message, type: 'error' }),
  info:    (message) => useNotificationStore.getState().addToast({ message, type: 'info' }),
  warning: (message) => useNotificationStore.getState().addToast({ message, type: 'warning' }),
}
