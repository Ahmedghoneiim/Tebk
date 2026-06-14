import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { Loader2, CheckCircle } from 'lucide-react'
import { forgotPasswordSchema } from '@/utils/validators'
import { sendPasswordResetEmail } from '@/services/authService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-primary">Reset your password</h1>
          <p className="text-muted mt-2">We'll send a reset link to your email</p>
        </div>

        <div className="card">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle className="w-12 h-12 text-success mx-auto mb-3" />
              <h3 className="font-semibold text-primary text-lg">Check your inbox</h3>
              <p className="text-sm text-muted mt-2 mb-6">A password reset link has been sent to your email address.</p>
              <Link to="/login" className="link text-sm">Back to sign in</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {serverError && (
                <div className="bg-red-50 border border-red-200 text-danger text-sm rounded-xl px-4 py-3">{serverError}</div>
              )}
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Email address</label>
                <Input type="email" placeholder="you@gmail.com" {...register('email')} />
                {errors.email && <p className="text-xs text-danger mt-1">{errors.email.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</> : 'Send Reset Link'}
              </Button>
              <p className="text-center text-sm">
                <Link to="/login" className="link">Back to sign in</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
