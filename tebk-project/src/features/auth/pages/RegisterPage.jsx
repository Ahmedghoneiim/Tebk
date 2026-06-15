import { useEffect, useState } from 'react'
import { TebkLogo } from '@/components/shared/TebkLogo'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, User, Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { registerSchema } from '@/utils/validators'
import { toast } from '@/store/notificationStore'
import { usePageTitle } from '@/hooks/usePageTitle'

function RegisterIllustration() {
  return (
    <svg viewBox="0 0 320 360" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-72 h-72">
      {/* Main document */}
      <rect x="60" y="50" width="170" height="220" rx="14" fill="white" filter="url(#rshadow)"/>
      <defs>
        <filter id="rshadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#C1E3C4" floodOpacity="0.18"/>
        </filter>
      </defs>

      {/* Header of document */}
      <rect x="60" y="50" width="170" height="52" rx="14" fill="#1a3363"/>
      <rect x="60" y="88" width="170" height="14" fill="#1a3363"/>

      {/* Logo on doc */}
      <circle cx="110" cy="75" r="18" fill="#C1E3C4"/>
      <text x="110" y="80" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">T</text>

      {/* Title lines */}
      <rect x="136" y="67" width="70" height="8" rx="4" fill="white" opacity="0.8"/>
      <rect x="136" y="80" width="52" height="6" rx="3" fill="white" opacity="0.4"/>

      {/* Form fields on doc */}
      <rect x="76" y="116" width="138" height="18" rx="6" fill="#e8f7f6"/>
      <rect x="76" y="142" width="138" height="18" rx="6" fill="#e8f7f6"/>
      <rect x="76" y="168" width="138" height="18" rx="6" fill="#e8f7f6"/>
      <rect x="76" y="194" width="62" height="18" rx="6" fill="#C1E3C4" opacity="0.25"/>
      <rect x="152" y="194" width="62" height="18" rx="6" fill="#e8f7f6"/>

      {/* Field icons hints */}
      <circle cx="90" cy="125" r="4" fill="#C1E3C4" opacity="0.5"/>
      <circle cx="90" cy="151" r="4" fill="#C1E3C4" opacity="0.5"/>
      <circle cx="90" cy="177" r="4" fill="#C1E3C4" opacity="0.5"/>

      {/* Submit button */}
      <rect x="76" y="224" width="138" height="24" rx="10" fill="#C1E3C4"/>
      <rect x="106" y="231" width="78" height="10" rx="5" fill="white" opacity="0.8"/>

      {/* Floating checkmark badge */}
      <circle cx="245" cy="100" r="26" fill="#C1E3C4" filter="url(#rshadow)"/>
      <path d="M233,100 L241,108 L257,92" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>

      {/* Floating user badges */}
      <rect x="22" y="130" width="48" height="60" rx="10" fill="#1a3363" filter="url(#rshadow)"/>
      <circle cx="46" cy="152" r="12" fill="#C1E3C4"/>
      <circle cx="46" cy="147" r="6" fill="white" opacity="0.9"/>
      <ellipse cx="46" cy="163" rx="9" ry="6" fill="white" opacity="0.9"/>

      {/* Floating pills */}
      <ellipse cx="264" cy="200" rx="10" ry="6" fill="#C1E3C4" opacity="0.6" transform="rotate(-30 264 200)"/>
      <ellipse cx="280" cy="220" rx="10" ry="6" fill="#b2e8e5" transform="rotate(20 280 220)"/>
      <ellipse cx="258" cy="235" rx="10" ry="6" fill="#C1E3C4" opacity="0.4" transform="rotate(-10 258 235)"/>

      {/* Small stars / sparkles */}
      <circle cx="44" cy="210" r="4" fill="#C1E3C4" opacity="0.5"/>
      <circle cx="56" cy="225" r="3" fill="#C1E3C4" opacity="0.3"/>
      <circle cx="270" cy="155" r="3.5" fill="#C1E3C4" opacity="0.5"/>
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

export function RegisterPage() {
  usePageTitle('Create Account')
  const { register: registerUser, loading, error, clearError, user } = useAuthStore()
  const navigate = useNavigate()
  const [showPw, setShowPw]         = useState(false)
  const [showConfPw, setShowConfPw] = useState(false)

  useEffect(() => {
    if (!user) return
    const dest = user.role === 'admin' ? '/admin' : user.role === 'supplier' ? '/products' : '/'
    navigate(dest, { replace: true })
  }, [user])

  useEffect(() => { return () => clearError() }, [])

  const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'client' },
    mode: 'onChange',
  })

  const role = watch('role')

  const onSubmit = async (data) => {
    const { data: result, error } = await registerUser(data)
    if (!error) {
      if (result?.session) {
        // auto-confirm → useEffect handles redirect
      } else {
        toast.success('Account created! Please check your email to verify.')
        navigate('/login')
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-visible flex relative" style={{ minHeight: '620px' }}>


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

          {/* Teal wave */}
          <svg className="absolute bottom-0 right-0" width="110" height="110" viewBox="0 0 110 110">
            <path d="M110,110 L0,110 Q55,55 110,0 Z" fill="#C1E3C4" opacity="0.35"/>
          </svg>

          <div className="relative z-10">
            <RegisterIllustration />
          </div>

          {/* Bottom badge */}
          <div className="absolute bottom-6 left-6 flex items-center gap-1.5 z-10">
            <ShieldCheck className="w-4 h-4" style={{ color: '#4ea055' }} />
            <span className="text-xs font-semibold" style={{ color: '#1a3363' }}>ISO Certified Platform</span>
          </div>
        </div>

        {/* ── Right – Form Panel ── */}
        <div className="flex-1 flex flex-col justify-center px-10 py-10">
          <div className="max-w-sm mx-auto w-full">

            <h1 className="text-3xl font-bold mb-1" style={{ color: '#1a3363' }}>Create Account</h1>
            <p className="text-gray-400 text-sm mb-7">Join TEBK to access medical supplies</p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
              {/* Full Name */}
              <div>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input
                    placeholder="Full Name"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-teal-400 transition-colors placeholder:text-gray-300"
                    {...register('fullName')}
                  />
                </div>
                {errors.fullName && <p className="text-xs text-red-500 mt-1 ml-1">{errors.fullName.message}</p>}
              </div>

              {/* Email */}
              <div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-teal-400 transition-colors placeholder:text-gray-300"
                    {...register('email')}
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1 ml-1">{errors.email.message}</p>}
              </div>

              {/* Account Type */}
              <div>
                <p className="text-xs font-semibold text-gray-400 mb-2 ml-1">Account Type</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'supplier', label: 'Supplier' },
                    { value: 'client',   label: 'Client'   },
                  ].map(({ value, label }) => (
                    <label
                      key={value}
                      className={`flex items-center justify-center gap-2 py-3 rounded-2xl border cursor-pointer transition-all text-sm font-medium select-none ${
                        role === value
                          ? 'border-teal-400 bg-teal-50 text-teal-600'
                          : 'border-gray-200 text-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      <input type="radio" value={value} className="sr-only" {...register('role')} />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="Password"
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

              {/* Confirm Password */}
              <div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input
                    type={showConfPw ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    className="w-full pl-11 pr-11 py-3.5 rounded-2xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-teal-400 transition-colors placeholder:text-gray-300"
                    {...register('confirmPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfPw(p => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                  >
                    {showConfPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500 mt-1 ml-1">{errors.confirmPassword.message}</p>}
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
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account…</>
                  : 'Register'
                }
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 whitespace-nowrap">or register with</span>
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
            <p className="text-center text-sm text-gray-400 mt-5">
              Already have an account?{' '}
              <Link to="/login" className="font-bold hover:underline" style={{ color: '#1a3363' }}>
                Login
              </Link>
            </p>

            {/* Terms */}
            <p className="text-center text-xs text-gray-300 mt-3">
              By registering you agree to our{' '}
              <Link to="/terms" className="underline">Terms</Link>
              {' '}and{' '}
              <Link to="/privacy" className="underline">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
