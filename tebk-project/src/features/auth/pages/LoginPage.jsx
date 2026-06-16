import { useEffect, useState } from 'react'
import logonav from "@/assets/logo (2).svg"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { loginSchema } from '@/utils/validators'
import { toast } from '@/store/notificationStore'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useTranslation } from '@/hooks/useTranslation'

function MedicalIllustration() {
  return (
    <svg viewBox="0 0 320 360" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-72 h-72">
      {/* Clipboard body */}
      <rect x="70" y="55" width="160" height="210" rx="14" fill="white" filter="url(#shadow)"/>
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#C1E3C4" floodOpacity="0.18"/>
        </filter>
      </defs>

      {/* Clipboard clip */}
      <rect x="110" y="40" width="80" height="26" rx="8" fill="#C1E3C4"/>
      <circle cx="150" cy="43" r="10" fill="#1aada1"/>
      <circle cx="150" cy="43" r="5" fill="#e8f7f6"/>

      {/* Doctor photo card */}
      <rect x="88" y="88" width="76" height="90" rx="8" fill="#1a3363"/>

      {/* Doctor avatar */}
      <circle cx="126" cy="112" r="18" fill="#C1E3C4"/>
      <circle cx="126" cy="107" r="9" fill="white" opacity="0.9"/>
      <ellipse cx="126" cy="128" rx="14" ry="9" fill="white" opacity="0.9"/>

      {/* ID lines */}
      <rect x="172" y="96" width="44" height="6" rx="3" fill="#e0f5f4"/>
      <rect x="172" y="108" width="36" height="5" rx="2.5" fill="#e0f5f4"/>
      <rect x="172" y="120" width="40" height="5" rx="2.5" fill="#e0f5f4"/>

      {/* Separator lines */}
      <line x1="88" y1="196" x2="212" y2="196" stroke="#C1E3C4" strokeWidth="4" strokeLinecap="round"/>
      <line x1="88" y1="212" x2="180" y2="212" stroke="#b2e8e5" strokeWidth="4" strokeLinecap="round"/>

      {/* Stethoscope */}
      <circle cx="148" cy="258" r="14" fill="none" stroke="#C1E3C4" strokeWidth="3.5"/>
      <path d="M162,258 C182,258 196,244 196,226 C196,206 180,194 162,194" stroke="#C1E3C4" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <circle cx="162" cy="190" r="7" fill="#C1E3C4"/>
      <circle cx="162" cy="190" r="3.5" fill="white"/>
      <path d="M134,258 C114,258 100,244 100,226 C100,206 116,194 134,194" stroke="#C1E3C4" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <circle cx="134" cy="190" r="7" fill="#C1E3C4"/>
      <circle cx="134" cy="190" r="3.5" fill="white"/>

      {/* Medicine blisters - left */}
      <rect x="20" y="140" width="54" height="30" rx="6" fill="#c8eeec" transform="rotate(-15 20 140)"/>
      <circle cx="30" cy="152" r="7" fill="#C1E3C4" opacity="0.7"/>
      <circle cx="48" cy="148" r="7" fill="#C1E3C4" opacity="0.7"/>
      <circle cx="66" cy="144" r="7" fill="#C1E3C4" opacity="0.7"/>

      {/* Pills scattered */}
      <ellipse cx="44" cy="192" rx="9" ry="5" rx="9" ry="5" fill="#C1E3C4" opacity="0.5" transform="rotate(-30 44 192)"/>
      <ellipse cx="56" cy="208" rx="9" ry="5" fill="#b2e8e5" transform="rotate(20 56 208)"/>
      <ellipse cx="32" cy="220" rx="9" ry="5" fill="#C1E3C4" opacity="0.4" transform="rotate(-10 32 220)"/>

      {/* Medicine box - right */}
      <rect x="228" y="200" width="56" height="72" rx="8" fill="#C1E3C4" opacity="0.85"/>
      <rect x="234" y="226" width="44" height="38" rx="5" fill="white" opacity="0.35"/>
      <circle cx="244" cy="218" r="5" fill="white" opacity="0.6"/>
      <circle cx="256" cy="218" r="5" fill="white" opacity="0.6"/>
      <circle cx="268" cy="218" r="5" fill="white" opacity="0.6"/>
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg width="18" height="20" viewBox="0 0 814 1000" fill="currentColor">
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 1 666.3 1 541.8c0-207.5 135.4-317.5 268.7-317.5 99.8 0 183 65.8 245.3 65.8 59.2 0 152-65.8 268.7-65.8 49 0 165.3 4.5 247.6 185.7zm-156.7-130.5c-35.2 46.9-93.7 80.1-148.6 80.1-6.4 0-12.8-.6-19.2-1.9 2.6-50.9 28.8-100.5 61.9-134.1 37.2-37.2 97.5-67.2 150.1-71.9 2.6 55.5-14.4 109.7-44.2 147.8z"/>
    </svg>
  )
}

export function LoginPage() {
  usePageTitle('Login')
  const { t } = useTranslation()
  const { login, loading, error, clearError, user } = useAuthStore()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [showPw, setShowPw] = useState(false)

  const rawFrom = location.state?.from?.pathname
  const from    = (rawFrom && rawFrom !== '/' && !rawFrom.startsWith('/login') && !rawFrom.startsWith('/register'))
    ? rawFrom : null

  useEffect(() => {
    if (!user) return
    const dest = from || (user.role === 'supplier' ? '/products' : '/')
    navigate(dest, { replace: true })
  }, [user])

  useEffect(() => { return () => clearError() }, [])

  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  })

  const onSubmit = async (data) => {
    const { error } = await login(data.email, data.password)
    if (!error) toast.success(t('auth.welcome_back'))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-visible flex relative" style={{ minHeight: '540px' }}>


        {/* ── Left – Illustration Panel ── */}
        <div
          className="hidden lg:flex w-[44%] flex-col items-center justify-center relative overflow-hidden rounded-l-3xl"
          style={{ background: '#e8f7f6' }}
        >
          {/* Dots top-left */}
          <div className="absolute top-8 left-8 grid grid-cols-5 gap-2.5">
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: '#C1E3C4', opacity: 0.45 }} />
            ))}
          </div>

          {/* Dots bottom-right */}
          <div className="absolute bottom-14 right-6 grid grid-cols-5 gap-2.5">
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: '#C1E3C4', opacity: 0.45 }} />
            ))}
          </div>

          {/* Teal wave – bottom right corner */}
          <svg className="absolute bottom-0 right-0" width="110" height="110" viewBox="0 0 110 110">
            <path d="M110,110 L0,110 Q55,55 110,0 Z" fill="#C1E3C4" opacity="0.35"/>
          </svg>

          {/* Illustration */}
          <div className="relative z-10">
            <MedicalIllustration />
          </div>
        </div>

        {/* ── Right – Form Panel ── */}
        <div className="flex-1 flex flex-col justify-center px-10 py-14">
          <div className="max-w-sm mx-auto w-full">

            <img src={logonav} alt="TEBK Logo" className="h-20 w-auto block mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-1" style={{ color: '#1a3363' }}>Welcome Back!</h1>
            <p className="text-gray-400 text-sm mb-8">Login to your account</p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input
                    type="email"
                    placeholder={t('auth.email')}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-teal-400 transition-colors placeholder:text-gray-300"
                    {...register('email')}
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1 ml-1">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder={t('auth.password')}
                    className="w-full pl-11 pr-11 py-3.5 rounded-2xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-teal-400 transition-colors placeholder:text-gray-300"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(p => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1 ml-1">{errors.password.message}</p>}
              </div>

              {/* Remember me + Forgot password */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-teal-500" />
                  <span className="text-sm text-gray-500">{t('auth.remember_me')}</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-semibold hover:underline"
                  style={{ color: '#1a3363' }}
                >
                  {t('auth.forgot_password')}
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !isValid}
                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 ease-in-out mt-1 ${
                  isValid && !loading
                    ? 'hover:scale-[1.02] hover:shadow-lg hover:opacity-90'
                    : 'cursor-not-allowed'
                }`}
                style={{
                  background: isValid ? '#C1E3C4' : '#e5e7eb',
                  color:      isValid ? '#1a3363' : '#9ca3af',
                  opacity:    loading ? 0.7 : 1,
                }}
              >
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> {t('auth.signing_in')}</>
                  : t('auth.login')
                }
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 whitespace-nowrap">{t('auth.or_login_with')}</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Social buttons */}
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
              >
                <GoogleIcon />
              </button>
              <button
                type="button"
                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
              >
                <AppleIcon />
              </button>
            </div>

            {/* Footer */}
            <p className="text-center text-sm text-gray-400 mt-6">
              {t('auth.no_account')}{' '}
              <Link to="/register" className="font-bold hover:underline" style={{ color: '#1a3363' }}>
                {t('auth.register')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
