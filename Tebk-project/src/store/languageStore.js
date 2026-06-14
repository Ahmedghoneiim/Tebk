import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useLanguageStore = create(
  persist(
    (set) => ({
      language: 'en',
      direction: 'ltr',
      setLanguage: (lang) => {
        const dir = lang === 'ar' ? 'rtl' : 'ltr'
        document.documentElement.setAttribute('lang', lang)
        document.documentElement.setAttribute('dir', dir)
        set({ language: lang, direction: dir })
      },
    }),
    { name: 'tebk-language' }
  )
)
