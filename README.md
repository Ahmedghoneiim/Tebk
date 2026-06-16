<div align="center">

# TEBK — AI-Powered Medical Supply Procurement Platform

**B2B SaaS platform that transforms how healthcare providers purchase medical supplies**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-tebk.store-17C3CE?style=for-the-badge&logo=vercel)](https://tebk.store)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://tebk-project.vercel.app)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)
[![License](https://img.shields.io/badge/License-MIT-1a3363?style=for-the-badge)](LICENSE)

</div>

---

## Overview

**TEBK** is a full-stack B2B medical supply procurement platform built for clinics, hospitals, and healthcare procurement teams. It combines AI-powered recommendations, smart bundled kits, image-based product search, and subscription-based auto-refill — all in one platform purpose-built for the healthcare sector.

> **For B2B procurement only. Not for direct patient care.**

---

## Live Demo

| Environment | URL |
|-------------|-----|
| Production | [tebk.store](https://tebk.store) |
| Staging / Preview | [tebk-project.vercel.app](https://tebk-project.vercel.app) |

---

## Features

### Core Platform
- **AI Buyer Assistant** — Answer 4 questions, get a full procurement recommendation tailored to your clinic type and budget
- **Smart Bundles** — Pre-built, AI-adjusted supply kits for dental, ICU, lab, and general clinics with bulk savings up to 22%
- **Image Search** — Photograph any medical item and instantly find the exact product or closest alternative (Cloudinary-powered)
- **Auto-Refill Subscriptions** — Subscribe to consumables, pause or change frequency anytime
- **Inventory Management** — Track stock levels, get low-stock alerts, and generate reorder suggestions

### Authentication & Security
- Email/password authentication with Zod form validation
- Google OAuth (one-click login/register)
- Role-based access control (Client / Supplier / Admin)
- Password reset via email link
- Protected routes with session persistence

### E-Commerce
- Full product catalog with categories and search
- Product detail pages with rich media
- Shopping cart with quantity management
- Checkout flow
- Order history and order tracking
- Wishlist and product comparison
- Purchase requests management
- Returns and RMA management

### Admin Panel
- Dedicated dark-sidebar admin panel
- Manage users, products, orders, inventory, payments
- Reports and analytics dashboard
- Admin-level notifications

### Supplier Portal
- Supplier dashboard and product management
- Role-restricted access

### UX & Accessibility
- Fully responsive (mobile-first, Tailwind CSS)
- Dark mode support
- Arabic / English bilingual UI (`ar` + `en`)
- Mobile bottom navigation
- Animated page transitions (Framer Motion)
- Toast notifications system
- Loading skeletons and error boundaries

---

## Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | React | 19.2.6 |
| Build Tool | Vite | 8.0 |
| Routing | React Router | 7.15 |
| State Management | Zustand | 5.0 |
| Server State | TanStack React Query | 5.100 |
| Backend / Auth / DB | Supabase | 2.105 |
| Styling | Tailwind CSS | 3.4 |
| UI Primitives | Radix UI | latest |
| Forms | React Hook Form + Zod | 7.76 / 4.4 |
| Animations | Framer Motion | 12.38 |
| Icons | Lucide React | latest |
| Image Management | Cloudinary | 2.9 |
| i18n | Custom (AR/EN JSON) | — |

---

## Project Structure

```
tebk-project/
├── public/
│   └── logo.svg
├── src/
│   ├── assets/                  # Images and SVG assets
│   ├── components/
│   │   ├── shared/              # 15 reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── RoleRoute.jsx
│   │   │   └── ...
│   │   └── ui/                  # 10 Radix UI components
│   │       ├── button.jsx
│   │       ├── dialog.jsx
│   │       └── ...
│   ├── features/                # 20 feature modules (46 pages)
│   │   ├── auth/pages/          # Login, Register, Forgot/Reset Password, OAuth Callback
│   │   ├── home/pages/          # Landing Page
│   │   ├── products/pages/      # Catalog, Categories, Product Detail
│   │   ├── bundles/pages/       # Bundles listing and detail
│   │   ├── assistant/pages/     # AI Chat Assistant
│   │   ├── image-search/pages/  # Image-based search
│   │   ├── dashboard/pages/     # User dashboard, Orders
│   │   ├── cart/pages/          # Cart, Checkout, Order Success
│   │   ├── profile/pages/       # Profile, Settings
│   │   ├── admin/pages/         # 10 admin management pages
│   │   ├── supplier/pages/      # Supplier dashboard & products
│   │   ├── subscriptions/pages/ # Subscription management
│   │   ├── inventory/pages/     # Inventory tracking
│   │   ├── wishlist/pages/      # Wishlist
│   │   ├── compare/pages/       # Product comparison
│   │   ├── notifications/pages/ # Notifications center
│   │   ├── purchase-requests/   # Purchase requests
│   │   ├── returns/pages/       # Returns / RMA
│   │   ├── legal/pages/         # Terms, Privacy, Medical Disclaimer
│   │   └── errors/              # 404, Offline
│   ├── hooks/                   # usePageTitle, useScrollToTop, useTranslation
│   ├── i18n/                    # ar.json, en.json
│   ├── layouts/                 # 6 layout templates
│   │   ├── PublicLayout.jsx
│   │   ├── AuthLayout.jsx
│   │   ├── DashboardLayout.jsx
│   │   ├── AssistantLayout.jsx
│   │   ├── AdminLayout.jsx
│   │   └── AdminPanelLayout.jsx
│   ├── lib/
│   │   └── utils.js
│   ├── routes/
│   │   └── AppRoutes.jsx
│   ├── services/                # 10 Supabase API service modules
│   │   ├── supabaseClient.js
│   │   ├── authService.js
│   │   ├── productService.js
│   │   └── ...
│   ├── store/                   # 8 Zustand stores
│   │   ├── authStore.js
│   │   ├── cartStore.js
│   │   ├── themeStore.js
│   │   └── ...
│   ├── utils/                   # Format, validators, permissions, AI, Cloudinary
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.local                   # (not committed) environment variables
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## Pages & Routes

### Public Routes
| Path | Page | Description |
|------|------|-------------|
| `/` | Landing Page | Hero, features, products slider, bundles |
| `/products` | Catalog | Full product catalog |
| `/products/:id` | Product Detail | Single product page |
| `/categories` | Categories | Browse by category |
| `/bundles` | Bundles | Pre-built supply kits |
| `/bundles/:id` | Bundle Detail | Bundle detail view |
| `/assistant` | AI Assistant | Chat-based procurement advisor |
| `/image-search` | Image Search | Photo-to-product search |
| `/about` | About | About TEBK |
| `/terms` | Terms | Terms of service |
| `/privacy` | Privacy | Privacy policy |
| `/medical-disclaimer` | Disclaimer | Medical use disclaimer |

### Auth Routes
| Path | Page |
|------|------|
| `/login` | Login |
| `/register` | Register |
| `/forgot-password` | Forgot Password |
| `/reset-password` | Reset Password |
| `/auth/callback` | OAuth Callback (Google) |

### Protected Dashboard Routes (requires login)
| Path | Page |
|------|------|
| `/dashboard` | Dashboard Home |
| `/orders` | Order History |
| `/orders/:id` | Order Detail |
| `/cart` | Shopping Cart |
| `/checkout` | Checkout |
| `/wishlist` | Wishlist |
| `/compare` | Product Comparison |
| `/subscriptions` | Subscriptions |
| `/inventory` | Inventory |
| `/purchase-requests` | Purchase Requests |
| `/returns` | Returns |
| `/notifications` | Notifications |
| `/profile` | Profile |
| `/settings` | Settings |

### Supplier Routes (requires `supplier` or `admin` role)
| Path | Page |
|------|------|
| `/supplier` | Supplier Dashboard |
| `/supplier/products` | Manage Products |

### Admin Routes (requires `admin` role)
| Path | Page |
|------|------|
| `/admin` | Admin Dashboard |
| `/admin/products` | Manage Products |
| `/admin/orders` | Manage Orders |
| `/admin/users` | Manage Users |
| `/admin/inventory` | Inventory Control |
| `/admin/payments` | Payments |
| `/admin/reports` | Reports |
| `/admin/notifications` | Notifications |
| `/admin/profile` | Admin Profile |
| `/admin/settings` | Platform Settings |

---

## User Roles

| Role | Access |
|------|--------|
| **Client** | Public pages + Full dashboard (orders, cart, wishlist, subscriptions, etc.) |
| **Supplier** | Public pages + Supplier portal (dashboard + product management) |
| **Admin** | Full access to everything including the dedicated Admin Panel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A [Supabase](https://supabase.com) project

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/tebk.git
cd tebk/tebk-project

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file in the `tebk-project/` directory:

```env
# Required — Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional — Cloudinary (for image search feature)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Run Development Server

```bash
npm run dev
# App runs on http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview
```

---

## Supabase Setup

### 1. Create a Supabase Project
Go to [supabase.com](https://supabase.com), create a new project, and copy your Project URL and `anon` public key into `.env.local`.

### 2. Database Tables
The app expects these core tables in your Supabase database:
- `profiles` — User profiles (linked to `auth.users`)
- `products` — Medical product catalog
- `bundles` — Pre-built supply kits
- `orders` / `order_items` — Order management
- `cart_items` — Shopping cart
- `wishlist_items` — Wishlists
- `notifications` — In-app notifications
- `subscriptions` — Auto-refill subscriptions
- `inventory` — Inventory tracking
- `purchase_requests` — Purchase request management
- `returns` — Returns / RMA

### 3. Google OAuth Setup

**In Supabase Dashboard → Authentication → Providers → Google:**
- Enable Google provider
- Add your Google OAuth Client ID and Secret

**In Supabase Dashboard → Authentication → URL Configuration → Redirect URLs**, add:
```
https://tebk.store/auth/callback
https://tebk-project.vercel.app/auth/callback
http://localhost:5173/auth/callback
```

---

## Deployment

The project is deployed on **Vercel** with automatic deployments from the `main` branch.

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Set **Root Directory** to `tebk-project`
4. Add environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
5. Deploy

### Custom Domain

The production site uses the custom domain `tebk.store` configured via Vercel's domain settings.

---

## Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Teal (Primary Action) | `#17C3CE` | Buttons, links, highlights |
| Navy (Brand Primary) | `#1a3363` | Headings, logo, text |
| Mint (Background Tint) | `#C1E3C4` | Subtle backgrounds, badges |

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add: your feature description'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please ensure your code follows the existing patterns (Tailwind CSS, Zustand stores, Supabase services) and does not introduce console.log statements.

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with by the TEBK Team

[tebk.store](https://tebk.store) · [Report Bug](https://github.com/your-username/tebk/issues) · [Request Feature](https://github.com/your-username/tebk/issues)

</div>
