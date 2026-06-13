import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        if (get().items.find((i) => i.id === product.id)) return
        set((s) => ({ items: [...s.items, product] }))
      },

      removeItem: (productId) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== productId) })),

      toggle: (product) => {
        const exists = get().items.find((i) => i.id === product.id)
        exists ? get().removeItem(product.id) : get().addItem(product)
      },

      isWishlisted: (productId) =>
        get().items.some((i) => i.id === productId),

      clear: () => set({ items: [] }),
    }),
    { name: 'tebk-wishlist' }
  )
)
