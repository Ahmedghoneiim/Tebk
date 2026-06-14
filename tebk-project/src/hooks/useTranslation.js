import { useLanguageStore } from '@/store/languageStore'
import en from '@/i18n/en.json'
import ar from '@/i18n/ar.json'

const TRANSLATIONS = { en, ar }

export function useTranslation() {
  const language = useLanguageStore((s) => s.language)
  const dict = TRANSLATIONS[language] ?? TRANSLATIONS.en

  function t(key) {
    const parts = key.split('.')
    let val = dict
    for (const part of parts) {
      val = val?.[part]
    }
    return val ?? key
  }

  return { t, language }
}
