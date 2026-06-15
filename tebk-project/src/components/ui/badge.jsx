import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default:  'bg-primary-100 text-primary-700',
        secondary:'bg-secondary-100 text-secondary-700',
        success:  'bg-mint text-success',
        warning:  'bg-amber-100 text-warning',
        danger:   'bg-red-100 text-danger',
        outline:  'border border-border text-ink',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />
}
