// Merges tebk-project/dist and tebk-admin/dist into a single root dist/
// so both apps can be served from the same Vercel deployment.
//
// Output structure:
//   dist/             ← tebk-project (main site, base "/")
//   dist/admin/       ← tebk-admin   (admin panel, base "/admin")

const { cpSync, mkdirSync, rmSync, existsSync } = require('fs')
const { join } = require('path')

const root      = process.cwd()
const dist      = join(root, 'dist')
const mainDist  = join(root, 'tebk-project', 'dist')
const adminDist = join(root, 'tebk-admin',   'dist')

// Verify both builds exist before touching anything
if (!existsSync(mainDist)) {
  console.error('❌ tebk-project/dist not found — did npm run build:main succeed?')
  process.exit(1)
}
if (!existsSync(adminDist)) {
  console.error('❌ tebk-admin/dist not found — did npm run build:admin succeed?')
  process.exit(1)
}

// Clean root dist
console.log('🧹 Cleaning dist/')
rmSync(dist, { recursive: true, force: true })
mkdirSync(dist, { recursive: true })

// Main app → dist/
console.log('📦 Copying tebk-project/dist → dist/')
cpSync(mainDist, dist, { recursive: true })

// Admin app → dist/admin/
//
// vite.config.js in tebk-admin has base: '/admin', so the compiled index.html
// already references /admin/assets/... which maps to dist/admin/assets/... here.
console.log('📦 Copying tebk-admin/dist → dist/admin/')
mkdirSync(join(dist, 'admin'), { recursive: true })
cpSync(adminDist, join(dist, 'admin'), { recursive: true })

console.log('\n✅ Merge complete!')
console.log('   dist/              ← main site  (served at /)')
console.log('   dist/admin/        ← admin panel (served at /admin/)')
