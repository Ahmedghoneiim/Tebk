import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default:  'bg-primary-100 text-primary-800',
        secondary:'bg-secondary/20 text-secondary-600',
        success:  'bg-green-100 text-green-800',
        warning:  'bg-yellow-100 text-yellow-800',
        danger:   'bg-red-100 text-red-800',
        outline:  'border border-border text-ink',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />
}
