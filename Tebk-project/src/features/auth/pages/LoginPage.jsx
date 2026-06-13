import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useTranslation } from '@/hooks/useTranslation'
import { loginSchema } from '@/utils/validators'
import { toast } from '@/store/notificationStore'
import { usePageTitle } from '@/hooks/usePageTitle'

export function LoginPage() {
  usePageTitle('Login')
  const [showPassword, setShowPassword] = useState(false)
  const { login, loading, error, clearError, user } = useAuthStore()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  const rawFrom = location.state?.from?.pathname
  const from = (rawFrom && rawFrom !== '/' && !rawFrom.startsWith('/login') && !rawFrom.startsWith('/register'))
    ? rawFrom : null

  useEffect(() => {
    if (!user) return
    const dest = from || (user.role === 'supplier' ? '/products' : '/')
    navigate(dest, { replace: true })
  }, [user])

  useEffect(() => { return () => clearError() }, [])

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data) => {
    const { error } = await login(data.email, data.password)
    if (!error) toast.success(t('auth.welcome_toast'))
  }

  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-modal overflow-hidden flex" style={{ minHeight: '580px' }}>

        {/* ── Left panel – illustration ── */}
        <div className="hidden md:flex md:w-5/12 relative flex-col overflow-hidden bg-gradient-to-br from-secondary-50 via-secondary-100 to-secondary-200">

          {/* Dot grid – top-left */}
          <div className="absolute top-6 left-6 grid grid-cols-5 gap-2.5">
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-secondary-400 opacity-40" />
            ))}
          </div>

          {/* Dot grid – bottom-right */}
          <div className="absolute bottom-20 right-6 grid grid-cols-4 gap-2.5">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-secondary-500 opacity-30" />
            ))}
          </div>

          {/* Wave bottom */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 400 90" preserveAspectRatio="none" className="w-full h-20">
              <path d="M0,50 Q100,10 200,50 Q300,90 400,50 L400,90 L0,90 Z" fill="#21cdc0" opacity="0.25" />
              <path d="M0,65 Q100,30 200,65 Q300,95 400,65 L400,90 L0,90 Z" fill="#21cdc0" opacity="0.2" />
            </svg>
          </div>

          {/* Medical illustration */}
          <div className="flex-1 flex items-center justify-center p-10">
            <div className="relative">
              <div className="w-44 h-52 bg-white rounded-2xl shadow-modal flex flex-col items-center pt-8 px-4 pb-4 relative">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-10 h-7 bg-secondary rounded-lg flex items-center justify-center">
                  <div className="w-4 h-3 bg-white rounded-sm" />
                </div>
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-3 overflow-hidden">
                  <svg viewBox="0 0 40 40" className="w-12 h-12" fill="white">
                    <circle cx="20" cy="15" r="7" />
                    <path d="M5,38 Q5,27 20,27 Q35,27 35,38" />
                  </svg>
                </div>
                <div className="w-20 h-2 bg-secondary-200 rounded-full mb-2" />
                <div className="w-16 h-2 bg-secondary-100 rounded-full mb-2" />
                <div className="w-14 h-2 bg-secondary-100 rounded-full" />
                <div className="absolute -bottom-5 -right-5 w-14 h-14 bg-white rounded-full shadow-card flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-secondary-300 rounded-full" />
                </div>
              </div>
              <div className="absolute -bottom-2 right-3 w-1.5 h-10 bg-secondary-300 rounded-full rotate-12" />
              <div className="absolute -top-5 -right-10 flex gap-1 rotate-12">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-3 h-3 rounded-full bg-secondary-300 opacity-70" />
                ))}
              </div>
              <div className="absolute bottom-6 -left-14">
                <div className="w-24 h-9 bg-secondary-200 rounded-xl flex items-center justify-center gap-1.5 px-3 shadow-soft">
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} className="w-3 h-3 bg-white rounded-full opacity-80" />
                  ))}
                </div>
              </div>
              <div className="absolute -top-8 -left-6 flex flex-col gap-1.5 -rotate-12">
                <div className="w-2.5 h-2.5 rounded-full bg-secondary-400 opacity-60" />
                <div className="w-2 h-2 rounded-full bg-secondary-300 opacity-50" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Right panel – form ── */}
        <div className="flex-1 relative flex flex-col justify-center px-8 py-10 md:px-12">

          {/* Logo – top right */}
          <div className="absolute top-6 right-6">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-card">
              <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 4 Q20 4 20 8 L20 14 Q20 16 22 16 Q24 16 24 18 Q24 20 22 20 L20 20 L20 26 Q20 28 16 28 Q12 28 12 26 L12 20 L10 20 Q8 20 8 18 Q8 16 10 16 Q12 16 12 14 L12 8 Q12 4 16 4 Z" />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-7">
            <h1 className="text-3xl font-display font-bold text-primary mb-1.5">{t('auth.welcome_back')}</h1>
            <p className="text-sm text-muted">{t('auth.login_subtitle')}</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-danger text-sm rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Email */}
            <div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="email"
                  placeholder={t('auth.email')}
                  className="w-full pl-11 pr-4 py-3.5 text-sm border border-border rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all placeholder:text-muted/60 text-ink"
                  {...register('email')}
                />
              </div>
              {errors.email && <p className="text-xs text-danger mt-1.5 ml-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('auth.password')}
                  className="w-full pl-11 pr-12 py-3.5 text-sm border border-border rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all placeholder:text-muted/60 text-ink"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-danger mt-1.5 ml-1">{errors.password.message}</p>}
            </div>

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border accent-secondary cursor-pointer"
                />
                <span className="text-sm text-muted">{t('auth.remember_me')}</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-secondary hover:text-secondary-600 transition-colors"
              >
                {t('auth.forgot_password')}
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl text-white text-sm font-semibold bg-secondary hover:bg-secondary-500 active:bg-secondary-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-1 shadow-soft"
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> {t('auth.signing_in')}</>
                : t('auth.login_btn')
              }
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted whitespace-nowrap">{t('auth.or_login_with')}</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Social buttons */}
          <div className="flex items-center justify-center gap-4">
            {/* Google */}
            <button
              type="button"
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-clinical transition-colors shadow-soft"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </button>

            {/* Apple */}
            <button
              type="button"
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-clinical transition-colors shadow-soft"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-ink" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-muted mt-6">
            {t('auth.no_account')}{' '}
            <Link to="/register" className="font-semibold text-secondary hover:text-secondary-600 transition-colors">
              {t('auth.register')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
