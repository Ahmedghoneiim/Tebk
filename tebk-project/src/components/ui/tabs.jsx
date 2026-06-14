import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

export const Tabs        = TabsPrimitive.Root
export const TabsList    = ({ className, ...props }) => (
  <TabsPrimitive.List
    className={cn('inline-flex items-center rounded-xl bg-clinical p-1 gap-1', className)}
    {...props}
  />
)
export const TabsTrigger = ({ className, ...props }) => (
  <TabsPrimitive.Trigger
    className={cn(
      'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-all',
      'text-muted hover:text-ink',
      'data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-soft',
      className
    )}
    {...props}
  />
)
export const TabsContent = ({ className, ...props }) => (
  <TabsPrimitive.Content
    className={cn('mt-4 outline-none', className)}
    {...props}
  />
)
