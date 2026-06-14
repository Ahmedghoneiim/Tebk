import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-danger" />
      </div>
      <h3 className="text-lg font-semibold text-primary mb-1">Something went wrong</h3>
      <p className="text-sm text-muted max-w-xs">{message || 'An unexpected error occurred. Please try again.'}</p>
      {onRetry && (
        <Button className="mt-6" variant="outline" onClick={onRetry}>Try Again</Button>
      )}
    </div>
  )
}
