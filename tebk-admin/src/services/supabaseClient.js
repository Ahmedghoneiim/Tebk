import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
  console.warn('[tebk-admin] Running in mock mode — set VITE_SUPABASE_URL in .env.local')
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseKey || 'placeholder', {
  auth: {
    autoRefreshToken:   true,
    persistSession:     true,
    detectSessionInUrl: true,
    storageKey:         'tebk_admin_auth', // Isolate from main app's session in localStorage
  },
})
