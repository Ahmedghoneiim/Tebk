import { create } from 'zustand'

export const useCompareStore = create((set, get) => ({
  items: [],
  MAX: 4,

  addItem: (product) => {
    const { items, MAX } = get()
    if (items.length >= MAX || items.find((i) => i.id === product.id)) return
    set((s) => ({ items: [...s.items, product] }))
  },

  removeItem: (productId) =>
    set((s) => ({ items: s.items.filter((i) => i.id !== productId) })),

  clear: () => set({ items: [] }),

  isCompared: (productId) => get().items.some((i) => i.id === productId),
}))
