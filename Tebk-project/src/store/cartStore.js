import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        set((s) => {
          const existing = s.items.find((i) => i.id === product.id)
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.id === product.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            }
          }
          return { items: [...s.items, { ...product, quantity }] }
        })
      },

      removeItem: (productId) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== productId) })),

      updateQuantity: (productId, quantity) => {
        if (quantity < 1) { get().removeItem(productId); return }
        set((s) => ({
          items: s.items.map((i) =>
            i.id === productId ? { ...i, quantity } : i
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      get itemCount() { return get().items.reduce((sum, i) => sum + i.quantity, 0) },
      get subtotal()  { return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0) },
    }),
    { name: 'tebk-cart' }
  )
)
