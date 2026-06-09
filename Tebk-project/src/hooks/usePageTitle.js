import { useEffect } from 'react'

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — TEBK` : 'TEBK — Medical Supply Procurement'
    return () => {
      document.title = 'TEBK — Medical Supply Procurement'
    }
  }, [title])
}
