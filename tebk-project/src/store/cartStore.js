import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        set((s) => {
          const key = `${product.id}-${product.variantId || ''}`
          const existing = s.items.find((i) => `${i.id}-${i.variantId || ''}` === key)
          if (existing) {
            return {
              items: s.items.map((i) =>
                `${i.id}-${i.variantId || ''}` === key
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            }
          }
          return { items: [...s.items, { ...product, quantity }] }
        })
      },

      removeItem: (productId, variantId) =>
        set((s) => ({ items: s.items.filter((i) => !(i.id === productId && (i.variantId || '') === (variantId || ''))) })),

      updateQuantity: (productId, quantity, variantId) => {
        if (quantity < 1) { get().removeItem(productId, variantId); return }
        set((s) => ({
          items: s.items.map((i) =>
            i.id === productId && (i.variantId || '') === (variantId || '')
              ? { ...i, quantity }
              : i
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
