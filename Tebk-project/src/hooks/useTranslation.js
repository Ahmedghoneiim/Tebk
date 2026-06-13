import { useLanguageStore } from '@/store/languageStore'
import en from '@/i18n/en.json'
import ar from '@/i18n/ar.json'

const TRANSLATIONS = { en, ar }

export function useTranslation() {
  const language = useLanguageStore((s) => s.language)
  const dict = TRANSLATIONS[language] ?? TRANSLATIONS.en

  function t(key, vars = {}) {
    const parts = key.split('.')
    let val = dict
    for (const part of parts) {
      val = val?.[part]
    }
    let result = val ?? key
    if (typeof result === 'string' && Object.keys(vars).length > 0) {
      Object.entries(vars).forEach(([k, v]) => {
        result = result.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v))
      })
    }
    return result
  }

  return { t, language }
}
