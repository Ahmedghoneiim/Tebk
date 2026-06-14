import { cn } from '@/lib/utils'

export function Input({ className, type = 'text', ...props }) {
  return (
    <input
      type={type}
      className={cn(
        'w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-ink placeholder:text-muted',
        'focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent',
        'disabled:cursor-not-allowed disabled:opacity-50 transition',
        'dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400',
        className
      )}
      {...props}
    />
  )
}
