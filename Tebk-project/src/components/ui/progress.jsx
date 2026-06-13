import * as ProgressPrimitive from '@radix-ui/react-progress'
import { cn } from '@/lib/utils'

export function Progress({ className, value = 0, ...props }) {
  return (
    <ProgressPrimitive.Root
      className={cn('relative h-2 w-full overflow-hidden rounded-full bg-clinical', className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full bg-secondary transition-all duration-500 ease-out rounded-full"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}
