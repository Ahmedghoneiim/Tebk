import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/services/supabaseClient'
import { Loader2 } from 'lucide-react'

export function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        navigate('/', { replace: true })
      } else {
        const timeout = setTimeout(() => {
          navigate('/login', { replace: true })
        }, 1500)
        return () => clearTimeout(timeout)
      }
    }

    checkSession()
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#17C3CE' }} />
    </div>
  )
}
