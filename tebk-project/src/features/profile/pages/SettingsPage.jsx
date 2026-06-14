import { useThemeStore } from '@/store/themeStore'
import { useLanguageStore } from '@/store/languageStore'
import { useAuthStore } from '@/store/authStore'
import { useTranslation } from '@/hooks/useTranslation'
import { Button } from '@/components/ui/button'
import { Sun, Moon, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from '@/store/notificationStore'

export function SettingsPage() {
  const { theme, setTheme } = useThemeStore()
  const { language, setLanguage } = useLanguageStore()
  const { logout } = useAuthStore()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    toast.info(t('user_menu.sign_out'))
    navigate('/')
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="section-title">{t('settings.title')}</h1>

      <div className="card space-y-5">
        <h2 className="font-semibold text-primary">{t('settings.appearance')}</h2>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-ink">{t('settings.theme')}</p>
            <p className="text-xs text-muted">Choose light or dark interface</p>
          </div>
          <div className="flex items-center gap-2 bg-clinical p-1 rounded-xl">
            <button
              onClick={() => setTheme('light')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${theme === 'light' ? 'bg-white shadow-soft text-primary' : 'text-muted'}`}
            >
              <Sun className="w-4 h-4" /> {t('settings.light')}
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${theme === 'dark' ? 'bg-white shadow-soft text-primary' : 'text-muted'}`}
            >
              <Moon className="w-4 h-4" /> {t('settings.dark')}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <p className="text-sm font-medium text-ink">{t('settings.language')}</p>
            <p className="text-xs text-muted">Select interface language</p>
          </div>
          <div className="flex items-center gap-2 bg-clinical p-1 rounded-xl">
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${language === 'en' ? 'bg-white shadow-soft text-primary' : 'text-muted'}`}
            >
              {t('settings.english')}
            </button>
            <button
              onClick={() => setLanguage('ar')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${language === 'ar' ? 'bg-white shadow-soft text-primary' : 'text-muted'}`}
            >
              {t('settings.arabic')}
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold text-primary mb-4">{t('settings.account')}</h2>
        <Button variant="danger" onClick={handleLogout}>
          <LogOut className="w-4 h-4" /> {t('settings.sign_out')}
        </Button>
      </div>
    </div>
  )
}
