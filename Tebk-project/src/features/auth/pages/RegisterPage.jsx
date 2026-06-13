import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, User, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useTranslation } from '@/hooks/useTranslation'
import { registerSchema } from '@/utils/validators'
import { toast } from '@/store/notificationStore'
import { usePageTitle } from '@/hooks/usePageTitle'

export function RegisterPage() {
  usePageTitle('Create Account')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const { register: registerUser, loading, error, clearError, user } = useAuthStore()
  const { t } = useTranslation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return
    const dest = user.role === 'admin' ? '/admin' : user.role === 'supplier' ? '/products' : '/'
    navigate(dest, { replace: true })
  }, [user])

  useEffect(() => { return () => clearError() }, [])

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'supplier' },
  })

  const role = watch('role')

  const onSubmit = async (data) => {
    const { data: result, error } = await registerUser(data)
    if (!error) {
      if (result?.session) {
        // Auto-confirm is enabled — user is now logged in
      } else {
        toast.success(t('auth.account_created'))
        navigate('/login')
      }
    }
  }

  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-modal overflow-hidden flex" style={{ minHeight: '620px' }}>

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
          <div className="mb-6">
            <h1 className="text-3xl font-display font-bold text-primary mb-1.5">{t('auth.save_account')}</h1>
            <p className="text-sm text-muted">{t('auth.register_subtitle')}</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-danger text-sm rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Full Name */}
            <div>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  placeholder={t('auth.full_name')}
                  className="w-full pl-11 pr-4 py-3.5 text-sm border border-border rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all placeholder:text-muted/60 text-ink"
                  {...register('fullName')}
                />
              </div>
              {errors.fullName && <p className="text-xs text-danger mt-1.5 ml-1">{errors.fullName.message}</p>}
            </div>

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

            {/* Account Type */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'supplier', label: t('auth.supplier') },
                { value: 'clinic',   label: t('auth.client')   },
              ].map(({ value, label }) => (
                <label
                  key={value}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border cursor-pointer transition-all text-sm font-medium ${
                    role === value
                      ? 'border-secondary bg-clinical text-secondary ring-2 ring-secondary/20'
                      : 'border-border text-muted hover:bg-clinical'
                  }`}
                >
                  <input type="radio" value={value} className="sr-only" {...register('role')} />
                  {label}
                </label>
              ))}
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

            {/* Confirm Password */}
            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder={t('auth.confirm_password')}
                  className="w-full pl-11 pr-12 py-3.5 text-sm border border-border rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all placeholder:text-muted/60 text-ink"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-danger mt-1.5 ml-1">{errors.confirmPassword.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl text-white text-sm font-semibold bg-secondary hover:bg-secondary-500 active:bg-secondary-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-1 shadow-soft"
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> {t('auth.creating')}</>
                : t('auth.register')
              }
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-muted mt-6">
            {t('auth.has_account')}{' '}
            <Link to="/login" className="font-semibold text-secondary hover:text-secondary-600 transition-colors">
              {t('auth.login_link')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
