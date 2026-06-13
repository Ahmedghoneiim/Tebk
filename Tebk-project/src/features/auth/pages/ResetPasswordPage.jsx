import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { resetPasswordSchema } from '@/utils/validators'
import { updatePassword } from '@/services/authService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/store/notificationStore'

export function ResetPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async ({ password }) => {
    setLoading(true)
    setServerError('')
    const { error } = await updatePassword(password)
    setLoading(false)
    if (error) { setServerError(error.message); return }
    toast.success('Password updated successfully!')
    navigate('/login')
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-primary">Set new password</h1>
          <p className="text-muted mt-2">Choose a strong new password for your account</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {serverError && (
              <div className="bg-red-50 border border-red-200 text-danger text-sm rounded-xl px-4 py-3">{serverError}</div>
            )}
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">New Password</label>
              <Input type="password" placeholder="Min 8 characters" {...register('password')} />
              {errors.password && <p className="text-xs text-danger mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Confirm New Password</label>
              <Input type="password" placeholder="••••••••" {...register('confirmPassword')} />
              {errors.confirmPassword && <p className="text-xs text-danger mt-1">{errors.confirmPassword.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating…</> : 'Update Password'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
