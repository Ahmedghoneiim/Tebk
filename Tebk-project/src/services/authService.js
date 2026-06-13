import { supabase } from './supabaseClient'

export async function signIn(email, password) {
  return supabase.auth.signInWithPassword({ email, password })
}

export async function signUp(email, password, metadata = {}) {
  return supabase.auth.signUp({ email, password, options: { data: metadata } })
}

export async function signOut() {
  return supabase.auth.signOut()
}

export async function getSession() {
  return supabase.auth.getSession()
}

export async function sendPasswordResetEmail(email) {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
}

export async function updatePassword(newPassword) {
  return supabase.auth.updateUser({ password: newPassword })
}

export async function getProfile(userId) {
  return supabase.from('profiles').select('*').eq('id', userId).single()
}

export async function updateProfile(userId, updates) {
  return supabase.from('profiles').update(updates).eq('id', userId)
}
