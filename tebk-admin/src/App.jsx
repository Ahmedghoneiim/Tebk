import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { ForbiddenPage } from '@/components/ForbiddenPage'
import { AdminLayout } from '@/layouts/AdminLayout'
import { LoginPage }          from '@/pages/LoginPage'
import { SignUpPage }          from '@/pages/SignUpPage'
import { ForgotPasswordPage }  from '@/pages/ForgotPasswordPage'
import { ResetPasswordPage }   from '@/pages/ResetPasswordPage'
import { Dashboard } from '@/pages/Dashboard'
import { Orders } from '@/pages/Orders'
import { Products } from '@/pages/Products'
import { Inventory } from '@/pages/Inventory'
import { Customers } from '@/pages/Customers'
import { Payments } from '@/pages/Payments'
import { Reports } from '@/pages/Reports'
import { Notifications } from '@/pages/Notifications'
import { Profile } from '@/pages/Profile'
import { Settings } from '@/pages/Settings'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 5 * 60 * 1000, retry: 1 } },
})

function AuthInit({ children }) {
  const { initAuth } = useAuthStore()
  useEffect(() => {
    initAuth()
    return () => useAuthStore.getState()._subscription?.unsubscribe()
  }, [])
  return children
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/admin">
        <AuthInit>
          <Routes>
            {/* Public */}
            <Route path="/login"            element={<LoginPage />} />
            <Route path="/signup"           element={<SignUpPage />} />
            <Route path="/forgot-password"  element={<ForgotPasswordPage />} />
            <Route path="/reset-password"   element={<ResetPasswordPage />} />
            <Route path="/forbidden"        element={<ForbiddenPage />} />

            {/* Protected admin routes */}
            <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index                  element={<Dashboard />} />
              <Route path="orders"          element={<Orders />} />
              <Route path="products"        element={<Products />} />
              <Route path="inventory"       element={<Inventory />} />
              <Route path="users"           element={<Customers />} />
              <Route path="payments"        element={<Payments />} />
              <Route path="reports"         element={<Reports />} />
              <Route path="notifications"   element={<Notifications />} />
              <Route path="profile"         element={<Profile />} />
              <Route path="settings"        element={<Settings />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthInit>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
