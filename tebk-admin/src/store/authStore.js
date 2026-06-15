import { create } from 'zustand'
import { supabase } from '@/services/supabaseClient'

export const useAuthStore = create((set, get) => ({
  user:          null,
  session:       null,
  loading:       false,
  initializing:  true,
  error:         null,
  authError:     null,
  recoveryMode:  false,
  _subscription: null,

  initAuth: async () => {
    get()._subscription?.unsubscribe()

    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error

      if (session) {
        const profile = await get()._fetchProfile(session.user.id)
        set({ session, user: { ...session.user, ...profile }, initializing: false })
      } else {
        set({ initializing: false })
      }
    } catch (err) {
      set({
        initializing: false,
        authError: err.message || 'Failed to connect to authentication service',
      })
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'INITIAL_SESSION') return

      if (event === 'SIGNED_OUT') {
        set({ user: null, session: null })
        return
      }

      if (event === 'TOKEN_REFRESHED' && session) {
        // Only update session — no need to re-fetch profile on token refresh
        set(state => ({ session, user: state.user ? { ...state.user, ...session.user } : null }))
        return
      }

      if (event === 'PASSWORD_RECOVERY' && session) {
        set({ recoveryMode: true, session, user: { ...session.user } })
        return
      }

      if (event === 'USER_UPDATED' && session) {
        set(state => ({
          session,
          user: state.user ? { ...state.user, ...session.user } : null,
          recoveryMode: false,
        }))
        return
      }

      if (session) {
        const profile = await get()._fetchProfile(session.user.id)
        set({ session, user: { ...session.user, ...profile } })
      } else {
        set({ session: null, user: null })
      }
    })

    set({ _subscription: subscription })
  },

  _fetchProfile: async (userId) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (error) {
      // Profile row missing (e.g. user created directly in Supabase dashboard)
      console.warn('[authStore] Profile not found for user:', userId, '—', error.message)
      return {}
    }
    return data || {}
  },

  refreshProfile: async () => {
    const { session } = get()
    if (!session?.user?.id) return
    const profile = await get()._fetchProfile(session.user.id)
    set(state => ({ user: state.user ? { ...state.user, ...profile } : null }))
  },

  register: async (email, password, fullName) => {
    set({ loading: true, error: null })

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data:            { full_name: fullName, role: 'admin' },
        emailRedirectTo: `${window.location.origin}/`,
      },
    })

    if (error) {
      set({ loading: false, error: error.message })
      return { error }
    }

    // Email confirmation required — DB trigger on_auth_user_created handles profile creation
    if (!data.session) {
      set({ loading: false })
      return { data: { requiresEmailConfirmation: true } }
    }

    // Auto-login (email confirm disabled) — write profile row with admin role directly
    const { error: profileError } = await supabase.from('profiles').upsert({
      id:        data.user.id,
      email,
      full_name: fullName,
      role:      'admin',
    })

    if (profileError) {
      set({ loading: false, error: profileError.message })
      return { error: profileError }
    }

    const profile = { id: data.user.id, email, full_name: fullName, role: 'admin' }
    const user    = { ...data.user, ...profile }
    set({ user, session: data.session, loading: false })
    return { data: { user, requiresEmailConfirmation: false } }
  },

  login: async (email, password) => {
    set({ loading: true, error: null })
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { set({ loading: false, error: error.message }); return { error } }

    const profile = await get()._fetchProfile(data.user.id)
    if (!profile.role) {
      await supabase.auth.signOut()
      const msg = 'Admin profile not found. Ask a system administrator to set up your account.'
      set({ loading: false, error: msg })
      return { error: { message: msg } }
    }

    const user = { ...data.user, ...profile }
    set({ user, session: data.session, loading: false })
    return { data: { user, session: data.session } }
  },

  sendPasswordReset: async (email) => {
    set({ loading: true, error: null })
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    set({ loading: false })
    if (error) { set({ error: error.message }); return { error } }
    return { data: { sent: true } }
  },

  updatePassword: async (newPassword) => {
    set({ loading: true, error: null })
    const { data, error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) { set({ loading: false, error: error.message }); return { error } }
    set({ loading: false, recoveryMode: false })
    return { data }
  },

  logout: async () => {
    await supabase.auth.signOut()
    set({ user: null, session: null, recoveryMode: false })
  },

  clearError: () => set({ error: null }),
}))
