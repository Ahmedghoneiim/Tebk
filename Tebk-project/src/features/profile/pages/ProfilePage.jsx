import { useAuthStore } from '@/store/authStore'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { usePageTitle } from '@/hooks/usePageTitle'

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted mb-1">{label}</p>
      <p className="text-sm text-ink py-2.5 border-b border-border">
        {value || <span className="text-muted/50 italic">Not provided</span>}
      </p>
    </div>
  )
}

export function ProfilePage() {
  usePageTitle('Profile')
  const { user } = useAuthStore()

  const initials = user?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'
  const roleLabel = user?.role === 'supplier' ? 'Supplier' : user?.role === 'clinic' ? 'Client' : user?.role || '—'

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="section-title">My Profile</h1>

      <div className="card flex items-center gap-4">
        <Avatar className="w-16 h-16">
          <AvatarFallback className="text-xl">{initials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-primary">{user?.full_name || '—'}</p>
          <p className="text-sm text-muted">{user?.email}</p>
          <span className="badge-primary mt-1 capitalize">{roleLabel}</span>
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold text-primary mb-5">Account Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Full Name"    value={user?.full_name} />
          <Field label="Phone"        value={user?.phone} />
          <Field label="Organisation" value={user?.clinic_name} />
          <Field label="City"         value={user?.city} />
          <div className="sm:col-span-2">
            <Field label="Address" value={user?.address} />
          </div>
          <div className="sm:col-span-2">
            <Field label="Email" value={user?.email} />
          </div>
        </div>
        <p className="text-xs text-muted mt-5">
          To update your information, please contact support at{' '}
          <a href="mailto:support@tebk.com" className="text-secondary hover:underline">support@tebk.com</a>.
        </p>
      </div>
    </div>
  )
}
