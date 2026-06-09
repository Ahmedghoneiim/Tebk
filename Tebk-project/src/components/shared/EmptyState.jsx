import { PackageOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function EmptyState({ icon: Icon = PackageOpen, title, description, action, actionLabel }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-clinical flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-secondary" />
      </div>
      <h3 className="text-lg font-semibold text-primary mb-1">{title}</h3>
      {description && <p className="text-sm text-muted max-w-xs">{description}</p>}
      {action && (
        <Button className="mt-6" onClick={action}>{actionLabel || 'Get started'}</Button>
      )}
    </div>
  )
}
