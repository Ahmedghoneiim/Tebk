import { create } from 'zustand'

export const useProductStore = create((set) => ({
  searchTerm: '',
  category:   'all',
  sortBy:     'name_asc',
  priceRange: [0, 50000],

  setSearchTerm: (searchTerm) => set({ searchTerm }),
  setCategory:   (category)   => set({ category }),
  setSortBy:     (sortBy)     => set({ sortBy }),
  setPriceRange: (priceRange) => set({ priceRange }),

  resetFilters: () =>
    set({ searchTerm: '', category: 'all', sortBy: 'name_asc', priceRange: [0, 50000] }),
}))
