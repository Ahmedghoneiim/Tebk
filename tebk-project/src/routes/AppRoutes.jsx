import { Routes, Route, Navigate } from 'react-router-dom'
import { PublicLayout }    from '@/layouts/PublicLayout'
import { AuthLayout }      from '@/layouts/AuthLayout'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { AdminLayout }      from '@/layouts/AdminLayout'
import { AdminPanelLayout } from '@/layouts/AdminPanelLayout'
import { ProtectedRoute }  from '@/components/shared/ProtectedRoute'
import { RoleRoute }       from '@/components/shared/RoleRoute'

// Auth pages (fullscreen, no navbar)
import { LoginPage }          from '@/features/auth/pages/LoginPage'
import { RegisterPage }       from '@/features/auth/pages/RegisterPage'
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage'
import { ResetPasswordPage }  from '@/features/auth/pages/ResetPasswordPage'

// Public pages
import { LandingPage }     from '@/features/home/pages/LandingPage'
import { CatalogPage }      from '@/features/products/pages/CatalogPage'
import { CategoriesPage }   from '@/features/products/pages/CategoriesPage'
import { ProductDetailPage } from '@/features/products/pages/ProductDetailPage'
import { BundlesPage }     from '@/features/bundles/pages/BundlesPage'
import { BundleDetailPage } from '@/features/bundles/pages/BundleDetailPage'
import { AssistantPage }   from '@/features/assistant/pages/AssistantPage'
import { ImageSearchPage } from '@/features/image-search/pages/ImageSearchPage'
import { TermsPage }       from '@/features/legal/pages/TermsPage'
import { PrivacyPage }     from '@/features/legal/pages/PrivacyPage'
import { MedicalDisclaimerPage } from '@/features/legal/pages/MedicalDisclaimerPage'
import { NotFoundPage }    from '@/features/errors/NotFoundPage'
import { OfflinePage }     from '@/features/errors/OfflinePage'

// Protected dashboard pages
import { DashboardHome }   from '@/features/dashboard/pages/DashboardHome'
import { OrderHistoryPage } from '@/features/dashboard/pages/OrderHistoryPage'
import { OrderDetailPage }  from '@/features/dashboard/pages/OrderDetailPage'
import { ProfilePage }     from '@/features/profile/pages/ProfilePage'
import { SettingsPage }    from '@/features/profile/pages/SettingsPage'
import { CartPage }        from '@/features/cart/pages/CartPage'
import { CheckoutPage }    from '@/features/cart/pages/CheckoutPage'
import { OrderSuccessPage } from '@/features/cart/pages/OrderSuccessPage'
import { WishlistPage }    from '@/features/wishlist/pages/WishlistPage'
import { ComparePage }     from '@/features/compare/pages/ComparePage'
import { SubscriptionsPage } from '@/features/subscriptions/pages/SubscriptionsPage'
import { InventoryPage }   from '@/features/inventory/pages/InventoryPage'
import { PurchaseRequestsPage } from '@/features/purchase-requests/pages/PurchaseRequestsPage'
import { ReturnsPage }     from '@/features/returns/pages/ReturnsPage'
import { NotificationsPage } from '@/features/notifications/pages/NotificationsPage'

// Supplier pages
import { SupplierDashboard } from '@/features/supplier/pages/SupplierDashboard'
import { SupplierProducts }  from '@/features/supplier/pages/SupplierProducts'

// Admin pages
import { AdminDashboard }      from '@/features/admin/pages/AdminDashboard'
import { AdminProducts }       from '@/features/admin/pages/AdminProducts'
import { AdminOrders }         from '@/features/admin/pages/AdminOrders'
import { AdminUsers }          from '@/features/admin/pages/AdminUsers'
import { AdminInventory }      from '@/features/admin/pages/AdminInventory'
import { AdminPayments }       from '@/features/admin/pages/AdminPayments'
import { AdminReports }        from '@/features/admin/pages/AdminReports'
import { AdminNotifications }  from '@/features/admin/pages/AdminNotifications'
import { AdminProfile }        from '@/features/admin/pages/AdminProfile'
import { AdminSettings }       from '@/features/admin/pages/AdminSettings'

export function AppRoutes() {
  return (
    <Routes>
      {/* Auth routes — fullscreen, no Navbar/Footer */}
      <Route element={<AuthLayout />}>
        <Route path="/login"           element={<LoginPage />} />
        <Route path="/register"        element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password"  element={<ResetPasswordPage />} />
      </Route>

      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/"                   element={<LandingPage />} />
        <Route path="/categories"         element={<CategoriesPage />} />
        <Route path="/products"           element={<CatalogPage />} />
        <Route path="/products/:id"       element={<ProductDetailPage />} />
        <Route path="/bundles"            element={<BundlesPage />} />
        <Route path="/bundles/:id"        element={<BundleDetailPage />} />
        <Route path="/assistant"          element={<AssistantPage />} />
        <Route path="/image-search"       element={<ImageSearchPage />} />
        <Route path="/terms"              element={<TermsPage />} />
        <Route path="/privacy"            element={<PrivacyPage />} />
        <Route path="/medical-disclaimer" element={<MedicalDisclaimerPage />} />
        <Route path="/offline"            element={<OfflinePage />} />
        <Route path="*"                   element={<NotFoundPage />} />
      </Route>

      {/* Protected dashboard routes */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/dashboard"          element={<DashboardHome />} />
        <Route path="/orders"             element={<OrderHistoryPage />} />
        <Route path="/orders/:id"         element={<OrderDetailPage />} />
        <Route path="/profile"            element={<ProfilePage />} />
        <Route path="/settings"           element={<SettingsPage />} />
        <Route path="/cart"               element={<CartPage />} />
        <Route path="/checkout"           element={<CheckoutPage />} />
        <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
        <Route path="/wishlist"           element={<WishlistPage />} />
        <Route path="/compare"            element={<ComparePage />} />
        <Route path="/subscriptions"      element={<SubscriptionsPage />} />
        <Route path="/inventory"          element={<InventoryPage />} />
        <Route path="/purchase-requests"  element={<PurchaseRequestsPage />} />
        <Route path="/returns"            element={<ReturnsPage />} />
        <Route path="/notifications"      element={<NotificationsPage />} />
      </Route>

      {/* Supplier routes */}
      <Route element={<ProtectedRoute><RoleRoute roles={['supplier', 'admin']}><AdminLayout /></RoleRoute></ProtectedRoute>}>
        <Route path="/supplier"           element={<SupplierDashboard />} />
        <Route path="/supplier/products"  element={<SupplierProducts />} />
      </Route>

      {/* Admin routes — dedicated AdminPanelLayout with dark sidebar */}
      <Route element={<ProtectedRoute><RoleRoute roles={['admin']}><AdminPanelLayout /></RoleRoute></ProtectedRoute>}>
        <Route path="/admin"                    element={<AdminDashboard />} />
        <Route path="/admin/orders"             element={<AdminOrders />} />
        <Route path="/admin/products"           element={<AdminProducts />} />
        <Route path="/admin/inventory"          element={<AdminInventory />} />
        <Route path="/admin/users"              element={<AdminUsers />} />
        <Route path="/admin/payments"           element={<AdminPayments />} />
        <Route path="/admin/reports"            element={<AdminReports />} />
        <Route path="/admin/notifications"      element={<AdminNotifications />} />
        <Route path="/admin/profile"            element={<AdminProfile />} />
        <Route path="/admin/settings"           element={<AdminSettings />} />
      </Route>
    </Routes>
  )
}
