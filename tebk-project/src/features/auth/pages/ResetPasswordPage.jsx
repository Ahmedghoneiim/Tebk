import { useState } from 'react'
import logonav from "@/assets/logo (2).svg"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Loader2, Lock, Eye, EyeOff } from 'lucide-react'
import { resetPasswordSchema } from '@/utils/validators'
import { updatePassword } from '@/services/authService'
import { toast } from '@/store/notificationStore'
import { useTranslation } from '@/hooks/useTranslation'

function ResetIllustration() {
  return (
    <svg viewBox="0 0 320 340" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-72 h-64">
      <defs>
        <filter id="rpshadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#C1E3C4" floodOpacity="0.18"/>
        </filter>
      </defs>

      {/* Shield */}
      <path d="M160,50 L220,78 L220,148 Q220,200 160,230 Q100,200 100,148 L100,78 Z"
        fill="white" filter="url(#rpshadow)"/>
      <path d="M160,66 L208,88 L208,148 Q208,190 160,214 Q112,190 112,148 L112,88 Z"
        fill="#e8f7f6"/>

      {/* Checkmark inside shield */}
      <path d="M135,148 L152,165 L185,130"
        stroke="#C1E3C4" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>

      {/* Key - floating left */}
      <circle cx="62" cy="180" r="22" fill="white" filter="url(#rpshadow)"/>
      <circle cx="62" cy="180" r="12" fill="none" stroke="#C1E3C4" strokeWidth="3.5"/>
      <rect x="70" y="178" width="32" height="7" rx="3.5" fill="#C1E3C4"/>
      <rect x="96" y="178" width="7" height="12" rx="3" fill="#C1E3C4"/>
      <rect x="86" y="178" width="7" height="10" rx="3" fill="#C1E3C4"/>

      {/* Lock open - floating right */}
      <rect x="240" y="155" width="54" height="48" rx="10" fill="white" filter="url(#rpshadow)"/>
      <path d="M252,155 L252,136 Q252,120 267,120 Q282,120 282,136"
        stroke="#C1E3C4" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <circle cx="267" cy="180" r="8" fill="#C1E3C4"/>
      <rect x="263" y="182" width="8" height="10" rx="3" fill="#C1E3C4"/>

      {/* New password field visual */}
      <rect x="72" y="258" width="176" height="32" rx="10" fill="white" filter="url(#rpshadow)"/>
      <circle cx="92" cy="274" r="6" fill="#C1E3C4" opacity="0.5"/>
      <rect x="106" y="270" width="60" height="8" rx="4" fill="#b2e8e5"/>
      <circle cx="232" cy="274" r="5" fill="#e0f0f0"/>

      {/* Stars / sparkles */}
      <circle cx="46" cy="110" r="4" fill="#C1E3C4" opacity="0.5"/>
      <circle cx="36" cy="128" r="3" fill="#C1E3C4" opacity="0.3"/>
      <circle cx="56" cy="135" r="2.5" fill="#C1E3C4" opacity="0.4"/>

      <circle cx="274" cy="110" r="4" fill="#C1E3C4" opacity="0.5"/>
      <circle cx="288" cy="128" r="3" fill="#b2e8e5" opacity="0.7"/>
      <circle cx="264" cy="130" r="2.5" fill="#C1E3C4" opacity="0.35"/>
    </svg>
  )
}

function DotsGrid() {
  return (
    <div className="grid grid-cols-5 gap-2.5">
      {Array.from({ length: 25 }).map((_, i) => (
        <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: '#C1E3C4', opacity: 0.45 }} />
      ))}
    </div>
  )
}

export function ResetPasswordPage() {
  const { t } = useTranslation()
  const [loading, setLoading]         = useState(false)
  const [serverError, setServerError] = useState('')
  const [showPw, setShowPw]           = useState(false)
  const [showConfPw, setShowConfPw]   = useState(false)
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
  })

  const onSubmit = async ({ password }) => {
    setLoading(true)
    setServerError('')
    const { error } = await updatePassword(password)
    setLoading(false)
    if (error) { setServerError(error.message); return }
    toast.success(t('auth.password_updated_toast'))
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div
        className="w-full max-w-sm sm:max-w-4xl bg-white rounded-3xl shadow-2xl overflow-visible flex relative"
        style={{ minHeight: '500px' }}
      >

        {/* ── Left – Illustration Panel ── */}
        <div
          className="hidden lg:flex w-[44%] flex-col items-center justify-center relative overflow-hidden rounded-l-3xl"
          style={{ background: '#e8f7f6' }}
        >
          <div className="absolute top-8 left-8"><DotsGrid /></div>
          <div className="absolute bottom-14 right-6"><DotsGrid /></div>

          <svg className="absolute bottom-0 right-0" width="110" height="110" viewBox="0 0 110 110">
            <path d="M110,110 L0,110 Q55,55 110,0 Z" fill="#C1E3C4" opacity="0.35"/>
          </svg>

          <div className="relative z-10">
            <ResetIllustration />
          </div>

          <p className="absolute bottom-8 left-0 right-0 text-center text-xs font-medium z-10" style={{ color: '#1a3363', opacity: 0.6 }}>
            {t('auth.strong_password')}
          </p>
        </div>

        {/* ── Right – Form Panel ── */}
        <div className="flex-1 flex flex-col justify-center px-5 py-8 sm:px-10 sm:py-14">
          <div className="max-w-sm mx-auto w-full">

            <img src={logonav} alt="TEBK Logo" className="h-20 w-auto block mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-1" style={{ color: '#1a3363' }}>Set New Password</h1>
            <p className="text-gray-400 text-sm mb-8">
              {t('auth.new_password_subtitle')}
            </p>

            {serverError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* New Password */}
              <div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder={t('auth.new_password')}
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
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1 ml-1">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input
                    type={showConfPw ? 'text' : 'password'}
                    placeholder={t('auth.confirm_new_password')}
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
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1 ml-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Password hint */}
              <div className="rounded-2xl px-4 py-3" style={{ background: '#e8f7f6' }}>
                <p className="text-xs text-gray-500">
                  {t('auth.password_hint')}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !isValid}
                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 ease-in-out ${
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
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> {t('auth.updating')}</>
                  : t('auth.update_password')
                }
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
