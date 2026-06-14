import { create } from 'zustand'
import { supabase } from '@/services/supabaseClient'
import { insertNotification } from '@/services/notificationService'

let _authSubscription = null

export const useAuthStore = create((set, get) => ({
  user:         null,
  session:      null,
  loading:      false,
  initializing: true,
  error:        null,
  isNewUser:    false,

  initAuth: async () => {
    // Load the initial session manually (fast, avoids waiting for INITIAL_SESSION event)
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      const profile = await get()._fetchProfile(session.user.id)
      set({ session, user: { ...session.user, ...profile }, initializing: false })
    } else {
      set({ initializing: false })
    }

    // Listen for future auth changes only — skip INITIAL_SESSION to avoid double profile fetch
    _authSubscription?.unsubscribe()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'INITIAL_SESSION') return
      if (session) {
        const profile = await get()._fetchProfile(session.user.id)
        set({ session, user: { ...session.user, ...profile } })
      } else {
        set({ session: null, user: null })
      }
    })
    _authSubscription = subscription
  },

  _fetchProfile: async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return data || {}
  },

  login: async (email, password) => {
    set({ loading: true, error: null })
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { set({ loading: false, error: error.message }); return { error } }
    const profile = await get()._fetchProfile(data.user.id)
    set({ user: { ...data.user, ...profile }, session: data.session, loading: false })
    return { data }
  },

  register: async ({ email, password, fullName, role = 'clinic', clinicName }) => {
    set({ loading: true, error: null })
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, role, clinic_name: clinicName } },
    })
    if (error) { set({ loading: false, error: error.message }); return { error } }

    if (data.user) {
      await supabase.from('profiles').upsert({
        id:          data.user.id,
        email,
        full_name:   fullName,
        role,
        clinic_name: clinicName || null,
      })
    }

    // Insert a welcome notification for the new user
    if (data.user) {
      await insertNotification({
        userId:  data.user.id,
        type:    'welcome',
        title:   'Welcome to TEBK!',
        message: 'Your account is ready. Browse medical supplies or let our AI assistant recommend what your clinic needs.',
      })
    }

    // If Supabase auto-confirmed the user (email confirmation disabled), set user in store
    if (data.session) {
      const profile = await get()._fetchProfile(data.user.id)
      set({ user: { ...data.user, ...profile }, session: data.session, loading: false, isNewUser: true })
    } else {
      set({ loading: false, isNewUser: true })
    }

    return { data }
  },

  logout: async () => {
    await supabase.auth.signOut()
    set({ user: null, session: null })
  },

  clearError:   () => set({ error: null }),
  clearNewUser: () => set({ isNewUser: false }),
}))
