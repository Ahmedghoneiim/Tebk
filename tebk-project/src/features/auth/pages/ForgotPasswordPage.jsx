import { useState } from 'react'
import logonav from "@/assets/logo (2).svg"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { Loader2, Mail, CheckCircle, ArrowLeft } from 'lucide-react'
import { forgotPasswordSchema } from '@/utils/validators'
import { sendPasswordResetEmail } from '@/services/authService'

function ForgotIllustration() {
  return (
    <svg viewBox="0 0 320 340" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-72 h-64">
      <defs>
        <filter id="fshadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#C1E3C4" floodOpacity="0.18"/>
        </filter>
      </defs>

      {/* Big lock body */}
      <rect x="95" y="148" width="130" height="110" rx="16" fill="white" filter="url(#fshadow)"/>
      <rect x="95" y="148" width="130" height="44" rx="16" fill="#1a3363"/>
      <rect x="95" y="174" width="130" height="18" fill="#1a3363"/>

      {/* Lock shackle */}
      <path d="M128,148 L128,112 Q128,80 160,80 Q192,80 192,112 L192,148"
        stroke="#C1E3C4" strokeWidth="14" fill="none" strokeLinecap="round"/>

      {/* Keyhole */}
      <circle cx="160" cy="205" r="16" fill="#C1E3C4"/>
      <rect x="154" y="210" width="12" height="20" rx="4" fill="#C1E3C4"/>
      <circle cx="160" cy="205" r="7" fill="#1a3363"/>

      {/* Envelope - floating left */}
      <rect x="24" y="100" width="82" height="60" rx="10" fill="white" filter="url(#fshadow)"/>
      <path d="M24,110 L65,136 L106,110" stroke="#C1E3C4" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <line x1="24" y1="145" x2="52" y2="145" stroke="#b2e8e5" strokeWidth="3" strokeLinecap="round"/>
      <line x1="24" y1="154" x2="64" y2="154" stroke="#b2e8e5" strokeWidth="3" strokeLinecap="round"/>

      {/* Email @ symbol floating right */}
      <circle cx="260" cy="120" r="32" fill="#e8f7f6" filter="url(#fshadow)"/>
      <text x="260" y="128" textAnchor="middle" fill="#C1E3C4" fontSize="26" fontWeight="bold">@</text>

      {/* Dots / sparkles */}
      <circle cx="52" cy="200" r="5" fill="#C1E3C4" opacity="0.5"/>
      <circle cx="66" cy="222" r="4" fill="#C1E3C4" opacity="0.3"/>
      <circle cx="40" cy="232" r="3" fill="#C1E3C4" opacity="0.4"/>

      <circle cx="265" cy="188" r="5" fill="#C1E3C4" opacity="0.5"/>
      <circle cx="280" cy="206" r="3.5" fill="#b2e8e5" opacity="0.7"/>
      <circle cx="252" cy="215" r="4" fill="#C1E3C4" opacity="0.3"/>

      {/* Arrow pointing to lock */}
      <path d="M96,130 Q80,148 96,160" stroke="#C1E3C4" strokeWidth="2" strokeDasharray="5 3" fill="none" strokeLinecap="round"/>
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

export function ForgotPasswordPage() {
  const [sent, setSent]               = useState(false)
  const [loading, setLoading]         = useState(false)
  const [serverError, setServerError] = useState('')

  const { register, handleSubmit, getValues, formState: { errors, isValid } } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
  })

  const onSubmit = async ({ email }) => {
    setLoading(true)
    setServerError('')
    const { error } = await sendPasswordResetEmail(email)
    setLoading(false)
    if (error) { setServerError(error.message); return }
    setSent(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-visible flex relative"
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
            <ForgotIllustration />
          </div>

          <p className="absolute bottom-8 left-0 right-0 text-center text-xs font-medium z-10" style={{ color: '#1a3363', opacity: 0.6 }}>
            Secure password recovery
          </p>
        </div>

        {/* ── Right – Form Panel ── */}
        <div className="flex-1 flex flex-col justify-center px-10 py-14">
          <div className="max-w-sm mx-auto w-full">

            {sent ? (
              /* ── Success State ── */
              <div className="text-center">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #C1E3C4, #1aada1)' }}
                >
                  <CheckCircle className="w-10 h-10 text-white" strokeWidth={1.8} />
                </div>

                <h1 className="text-2xl font-bold mb-2" style={{ color: '#1a3363' }}>Check your inbox</h1>
                <p className="text-gray-400 text-sm leading-relaxed mb-2">
                  We sent a password reset link to
                </p>
                <p className="text-sm font-semibold mb-8" style={{ color: '#4ea055' }}>
                  {getValues('email')}
                </p>

                <div
                  className="rounded-2xl px-5 py-4 mb-8 text-left"
                  style={{ background: '#e8f7f6' }}
                >
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Didn't receive the email? Check your spam folder or wait a few minutes.
                  </p>
                </div>

                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm font-semibold hover:underline"
                  style={{ color: '#1a3363' }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </Link>
              </div>
            ) : (
              /* ── Form State ── */
              <>
                <img src={logonav} alt="TEBK Logo" className="h-20 w-auto block mx-auto mb-6" />
                <h1 className="text-3xl font-bold mb-1" style={{ color: '#1a3363' }}>Forgot Password?</h1>
                <p className="text-gray-400 text-sm mb-8">
                  Enter your email and we'll send you a reset link
                </p>

                {serverError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
                    {serverError}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1 ml-1">{errors.email.message}</p>
                    )}
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
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                      : 'Send Reset Link'
                    }
                  </button>
                </form>

                <p className="text-center mt-6">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
                    style={{ color: '#1a3363' }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
