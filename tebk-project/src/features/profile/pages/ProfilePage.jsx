import { useAuthStore } from '@/store/authStore'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useTranslation } from '@/hooks/useTranslation'

function Field({ label, value }) {
  const { t } = useTranslation()
  return (
    <div>
      <p className="text-xs font-semibold text-muted mb-1">{label}</p>
      <p className="text-sm text-ink py-2.5 border-b border-border">
        {value || <span className="text-muted/50 italic">{t('profile.not_provided')}</span>}
      </p>
    </div>
  )
}

export function ProfilePage() {
  usePageTitle('Profile')
  const { t } = useTranslation()
  const { user } = useAuthStore()

  const initials = user?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'
  const roleLabel = user?.role === 'supplier' ? t('profile.role_supplier') : user?.role === 'client' ? t('profile.role_client') : user?.role || '—'

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="section-title">{t('profile.title')}</h1>

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
        <h2 className="font-semibold text-primary mb-5">{t('profile.account_info')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label={t('profile.field_full_name')} value={user?.full_name} />
          <Field label={t('profile.field_phone')}     value={user?.phone} />
          <Field label={t('profile.field_org')}       value={user?.clinic_name} />
          <Field label={t('profile.field_city')}      value={user?.city} />
          <div className="sm:col-span-2">
            <Field label={t('profile.field_address')} value={user?.address} />
          </div>
          <div className="sm:col-span-2">
            <Field label={t('profile.field_email')} value={user?.email} />
          </div>
        </div>
        <p className="text-xs text-muted mt-5">
          {t('profile.contact_support')}{' '}
          <a href="mailto:support@tebk.com" className="text-secondary hover:underline">support@tebk.com</a>.
        </p>
      </div>
    </div>
  )
}
