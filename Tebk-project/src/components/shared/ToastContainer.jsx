import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'
import { useNotificationStore } from '@/store/notificationStore'
import { cn } from '@/lib/utils'

const icons = {
  success: <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />,
  error:   <XCircle    className="w-5 h-5 text-danger  flex-shrink-0" />,
  warning: <AlertCircle className="w-5 h-5 text-warning flex-shrink-0" />,
  info:    <Info        className="w-5 h-5 text-secondary flex-shrink-0" />,
}

const colors = {
  success: 'border-l-4 border-success',
  error:   'border-l-4 border-danger',
  warning: 'border-l-4 border-warning',
  info:    'border-l-4 border-secondary',
}

export function ToastContainer() {
  const { toasts, removeToast } = useNotificationStore()

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'flex items-start gap-3 bg-white rounded-xl shadow-modal p-4 animate-in slide-in-from-right-full fade-in-0 duration-300',
            colors[t.type]
          )}
        >
          {icons[t.type]}
          <p className="text-sm text-ink flex-1">{t.message}</p>
          <button onClick={() => removeToast(t.id)} className="text-muted hover:text-ink transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
