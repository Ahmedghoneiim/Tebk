# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**TEBK** is a B2B AI-powered medical supply procurement platform for clinics and healthcare providers in Egypt. It is a React 19 + Vite SPA backed exclusively by Supabase (auth, database, storage). There is no custom backend server.

---

## Commands

```bash
npm run dev        # Dev server on http://localhost:5173
npm run build      # Production build to dist/
npm run preview    # Serve the production build locally
npm run lint       # ESLint check
```

There are no tests. There is no test runner configured.

---

## Environment

Copy `.env.local` and set real Supabase credentials:

```
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

**Mock mode:** `productService.js` (and related services) detect a placeholder/missing `VITE_SUPABASE_URL` and fall back to `src/utils/mockData.js`. Auth still calls real Supabase — only catalog and order data is mocked. The `.env.local` file already contains real credentials.

---

## Architecture

### Data flow

```
Component → useQuery / Zustand store → service function → Supabase (or mock)
```

- **Server data** (products, orders): TanStack Query with 5-minute stale time. Always call via service functions in `src/services/`.
- **Client state** (cart, auth, theme, language, wishlist, compare, toasts): Zustand stores in `src/store/`. Cart, wishlist, theme, and language are persisted to localStorage via `persist` middleware.
- **Forms**: React Hook Form + Zod schemas from `src/utils/validators.js`. Never use local `useState` for form field values.

### Auth

`authStore.initAuth()` runs once on app mount in `App.jsx`. It calls `supabase.auth.getSession()` then subscribes to `onAuthStateChange`. The `user` object in the store is a merge of `supabase.auth.User` and the `profiles` table row — so `user.role`, `user.full_name`, `user.clinic_name` etc. come from `profiles`, not from `auth.users`.

During `initializing: true`, `App.jsx` renders a fullscreen splash screen instead of routing — this prevents the Navbar from flashing before auth resolves.

### Routing and guards

All routes are defined in `src/routes/AppRoutes.jsx`. Three protection tiers:

| Wrapper | Behavior |
|---|---|
| `<PublicLayout>` | No auth required |
| `<ProtectedRoute>` | Redirects to `/login` if not authenticated |
| `<RoleRoute roles={[...]}>` | Redirects to `/dashboard` if role doesn't match |

Role values: `'admin'`, `'clinic'`, `'supplier'` — stored in `profiles.role`.

### Layout system

Three layouts wrap page content via React Router `<Outlet>`:

- `PublicLayout` — Navbar + Footer + MobileBottomNav + ToastContainer
- `DashboardLayout` — Navbar + Sidebar + MobileBottomNav + ToastContainer
- `AdminLayout` — Navbar + Sidebar + ToastContainer (no mobile bottom nav)

The Sidebar renders different link sets based on `user.role`.

### i18n

Language state lives in `languageStore` (persisted). Use `useTranslation()` from `src/hooks/useTranslation.js` to get translated strings — it reads from `src/i18n/en.json` or `src/i18n/ar.json` by dot-path key (e.g. `t('nav.products')`). When Arabic is active, the `<html>` element gets `dir="rtl" lang="ar"`.

### Toast notifications

Do not use a toast library. Call `toast.success / .error / .info / .warning(message)` imported from `src/store/notificationStore`. These are plain functions that call `useNotificationStore.getState()` directly and work outside React components.

### AI Buyer Assistant

The recommendation engine is entirely client-side in `src/utils/ai.js`. `generateRecommendations({ clinicType, patientVolume, budget, caseTypes })` maps clinic type → product categories, scales quantities by patient volume, applies budget multipliers, and returns a recommendation list with cost totals. No external API is called.

---

## Key Conventions

### Path alias
`@` maps to `./src`. Always use `@/` for imports instead of relative `../` paths.

### Design tokens
Use Tailwind classes only — never inline styles. Custom tokens defined in `tailwind.config.js`:

| Token | Value | Use for |
|---|---|---|
| `primary` | `#0A2540` (navy) | Headings, key UI chrome |
| `secondary` | `#2EC4B6` (teal) | CTAs, active states, highlights |
| `background` | `#F8FAFC` | Page background |
| `ink` | `#1E293B` | Body text |
| `clinical` | `#E0F2FE` | Light blue tint for cards/highlights |
| `muted` | `#64748B` | Secondary text |
| `danger` | `#E11D48` | Errors, destructive actions |

Font families: `font-sans` (Inter), `font-display` (Poppins). Box shadows: `shadow-soft`, `shadow-card`, `shadow-modal`. Dark mode is class-based (`darkMode: 'class'`).

### CSS utilities (defined in `src/index.css`)
Prefer these over rebuilding with raw Tailwind: `.card`, `.btn-primary`, `.btn-secondary`, `.btn-outline`, `.page-container`, `.section-title`, `.input-base`, `.text-gradient`, `.glass`, `.badge-*`.

### Component patterns
- UI primitives live in `src/components/ui/` (Radix-based: Button, Input, Badge, Dialog, DropdownMenu, Tabs, Avatar, Progress, Separator, Skeleton).
- Button uses CVA variants: `default | secondary | outline | ghost | danger | link` and sizes `sm | md | lg | icon`.
- Badge uses CVA variants: `default | secondary | success | warning | danger | outline`.
- Shared app components (ProductCard, Navbar, Sidebar, StatCard, etc.) live in `src/components/shared/`.
- `cn()` from `src/lib/utils.js` is the standard classname merger (clsx + tailwind-merge).

### Hooks
- `usePageTitle(title)` — sets `<title>` for the current page.
- `useScrollToTop()` — fires on every route change (already wired in `App.jsx`).
- `useTranslation()` — returns `{ t, language }` for i18n.

### Adding a new page
1. Create the component under `src/features/<feature>/pages/`.
2. Add the route in `src/routes/AppRoutes.jsx` inside the correct layout group.
3. Call `usePageTitle('Page Name')` at the top of the component.

### Adding a new service
1. Create the file in `src/services/`.
2. Add a `USE_MOCK` flag that checks `VITE_SUPABASE_URL` for placeholder text.
3. Return `{ data, error }` from every function to match Supabase client conventions.

---

## Supabase Schema (Phase 1)

| Table | Key columns |
|---|---|
| `profiles` | `id` (FK → auth.users), `email`, `full_name`, `role`, `clinic_name`, `phone`, `address`, `city` |
| `products` | `id`, `name`, `category_id`, `price`, `unit`, `stock`, `featured`, `image_url`, `description` |
| `categories` | `id`, `name` |
| `orders` | `id`, `user_id`, `status`, `total`, `shipping_name`, `payment_method`, `created_at` |
| `order_items` | `id`, `order_id`, `product_id`, `name`, `price`, `quantity` |

Phase 2 will add: `subscriptions`, `inventory_items`, `bundles`, `bundle_items`.
Phase 3 will add: `notifications`, `purchase_requests`, `returns`.

---

## Phase Roadmap

| Phase | Status | Key features |
|---|---|---|
| 1 — MVP | Complete | Auth, catalog, cart/checkout, AI assistant, dashboards |
| 2 — Growth | Scaffolded (mock data only) | Smart Bundles backend, Subscriptions, Inventory, Supplier fulfillment |
| 3 — Optimization | Scaffolded (mock data only) | Image Search AI, Realtime Notifications, Purchase Requests approval |
| 4 — Scale | Not started | Recharts analytics, multi-clinic, full Arabic RTL polish |
